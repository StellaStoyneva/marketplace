/* eslint-disable security/detect-object-injection */
import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { MongoError, ObjectId, TransactionOptions } from 'mongodb';
import { DeliveryStatusEnum, OrderItemLifeCycleEnum } from 'src/constants/enum';
import { CollectionEnum } from 'src/db/enum/collection.enum';
import { flags } from '../constants/flags';
import { TInsertOrderItem } from '../entities/insertOrderItems';
import { IOrderItem } from '../entities/orderItem.entity';
import { insertOrderSchema } from '../schemas/insertMany.schema';

export const addOrder: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.post(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: insertOrderSchema,
      },
    },
    async (req) => {
      let orderResult;
      const session = fastify.dbClient.startSession();

      try {
        const transactionOptions: TransactionOptions = {
          readPreference: 'primary',
          readConcern: { level: 'local' },
          writeConcern: { w: 'majority' },
        };

        await session.withTransaction(async () => {
          // 1. get customer details
          const customer = req.user._id;
          const userDetails = await fastify
            .db(process.env.DB_NAME as string)
            ?.collection(CollectionEnum.Users)
            .findOne({ _id: new ObjectId(customer) }, { session });

          const { ordersToStore } = req.body; // transaction id => finalPriceWithVAT
          //1. process req.body
          const productsInOrder = [];
          const ordersArr = [];
          for (let i = 0; i < ordersToStore.length; i++) {
            const orderToStore = ordersToStore[i];
            const items = [];
            for (let j = 0; j < orderToStore.items.length; j++) {
              const orderToStoreItem = orderToStore.items[j];
              const item = getOrderItem(orderToStoreItem);
              productsInOrder.push({
                _id: new ObjectId(orderToStoreItem._id),
                item,
                store: new ObjectId(orderToStore.store),
              });
              items.push(item);
            }
            ordersArr.push({
              ...orderToStore,
              items,
              customer,
              customerContact: {
                email: req.user.email,
                phoneNumber: userDetails?.phoneNumber,
              },
              store: new ObjectId(orderToStore.store),
              createdAt: new Date(),
              createdBy: customer,
              deliveryStatus: fastify.deliveryStatusEnum?.ordered,
            });
          }

          console.log({ productsInOrder });

          // 2. update products quantity
          const updatedProducts = await fastify
            .db(process.env.DB_NAME as string)
            ?.collection(CollectionEnum.Products)
            .bulkWrite(
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

          //3. check if products exist and there's enough quantity
          if (updatedProducts?.matchedCount !== productsInOrder.length) {
            for (let k = 0; k < productsInOrder.length; k++) {
              const product = await fastify
                .db(process.env.DB_NAME as string)
                ?.collection(CollectionEnum.Products)
                .findOne({ _id: new ObjectId(productsInOrder[k]._id) });

              if (
                product?.availableQuantity < productsInOrder[k].item.quantity
              ) {
                throw new Error(
                  `Not enough quantity of a product with _id ${productsInOrder[k]._id}`
                );
              }
            }
          }

          // 4. create orders per store
          orderResult = await fastify
            .db(process.env.DB_NAME as string)
            ?.collection(CollectionEnum.Orders)
            .insertMany(ordersArr, { session });

          //5. TODO complete payment - if paymentType === card/ paypal
          //6. TODO emit event
          // in event handler -> TODO send confirmation email -> emit event
          // in event handler -> create invoice
          // in event handler -> create OrderItems
        }, transactionOptions);
      } catch (error) {
        if (
          error instanceof MongoError &&
          error.hasErrorLabel('UnknownTransactionCommitResult')
        ) {
          console.error(JSON.stringify(error));
          error;
        } else if (
          error instanceof MongoError &&
          error.hasErrorLabel('TransientTransactionError')
        ) {
          console.error(JSON.stringify(error));
        } else {
          console.error(error);
        }
      } finally {
        await session.endSession();
      }
      return orderResult;
    }
  );

  done();
};

const getOrderItem = (item: IOrderItem) => {
  const currentDeliveryStatus = DeliveryStatusEnum.ordered;
  const {
    _id,
    name,
    sku,
    image,
    quantity,
    singlePriceBeforeVAT,
    singlePriceWithVAT,
    finalPriceBeforeVAT,
    finalPriceWithVAT,
    daysForReturn,
  } = item;

  return {
    name,
    sku,
    image,
    quantity,
    singlePriceBeforeVAT,
    singlePriceWithVAT,
    finalPriceBeforeVAT,
    finalPriceWithVAT,
    daysForReturn,
    ...flags[currentDeliveryStatus as keyof typeof DeliveryStatusEnum],
    status: OrderItemLifeCycleEnum.ordered,
    product: new ObjectId(_id),
  };
};
