import {
  Db,
  MongoClient,
  MongoError,
  ObjectId,
  TransactionOptions,
} from 'mongodb';
import { CollectionEnum } from '../../../db/enum/collection.enum';
import { IUser } from 'src/plugins/authentication';
import { TInsertOrderItem } from '../entities/insertOrderItems';
import { IRequestBodyInsertOrder } from '../entities';
import {
  getAddOrderRequestBodyProcessedData,
  getProductsWithInsufficientQuantity,
} from '../utils';

export const orderService = function (
  db: Db,
  dbClient: MongoClient,
  deliveryStatusEnum: Record<string, ObjectId> | undefined
) {
  const ordersCollection = db.collection(CollectionEnum.Orders);
  const userCollection = db.collection(CollectionEnum.Users);
  const productsCollection = db.collection(CollectionEnum.Products);

  // ADD ORDER
  async function addOrder(user: IUser, data: IRequestBodyInsertOrder) {
    let orderResult;
    let error;
    const session = dbClient.startSession();

    try {
      const transactionOptions: TransactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
      };

      await session.withTransaction(async () => {
        /** 1. get customer details */
        const customer = user._id;
        const userDetails = await userCollection.findOne(
          { _id: new ObjectId(customer) },
          { session }
        );

        // /** 2. process req.body */
        const { ordersToStore } = data; // transaction id => finalPriceWithVAT
        const { productsInOrder, productsInOrderIDs, ordersArr } =
          getAddOrderRequestBodyProcessedData(
            userDetails!,
            ordersToStore,
            deliveryStatusEnum!
          );

        /** 3. update products quantity */
        const updatedProducts = await productsCollection.bulkWrite(
          productsInOrder.map(
            (el: { _id: ObjectId; item: TInsertOrderItem }) => ({
              updateOne: {
                filter: {
                  _id: el._id,
                  availableQuantity: { $gte: el.item.quantity },
                },
                update: { $inc: { availableQuantity: -el.item.quantity } },
              },
            })
          ),
          { session }
        );

        /** 4. check if products exist and there's enough quantity */
        if (updatedProducts?.matchedCount !== productsInOrder.length) {
          const allOrderedProducts = productsCollection.find({
            _id: { $in: productsInOrderIDs },
          });

          const allOrderedProductsArr = await allOrderedProducts!.toArray();

          const productWithInsufficientQuantity =
            getProductsWithInsufficientQuantity(
              productsInOrder,
              allOrderedProductsArr
            );

          throw new Error(
            `Not enough quantity of a product(s) with _id ${productWithInsufficientQuantity}`
          );
        }

        /** 4. create orders per store */
        orderResult = await ordersCollection.insertMany(ordersArr, { session });

        // TODO 5. complete payment - if paymentType === card/ paypal */
        // TODO 6. emit event
        // in event handler -> TODO send confirmation email -> emit event
        // in event handler -> create invoice
        // in event handler -> create OrderItems
      }, transactionOptions);
    } catch (err) {
      error = err;
      if (
        err instanceof MongoError &&
        err.hasErrorLabel('UnknownTransactionCommitResult')
      ) {
        console.error(JSON.stringify(err));
      } else if (
        err instanceof MongoError &&
        err.hasErrorLabel('TransientTransactionError')
      ) {
        console.error(JSON.stringify(err));
      } else {
        console.error(err);
      }
    } finally {
      await session.endSession();
    }

    return orderResult || error;
  }
  return {
    addOrder,
  };
};
