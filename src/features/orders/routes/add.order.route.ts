import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { MongoError, ObjectId, TransactionOptions } from 'mongodb';
import { DeliveryStatusEnum, OrderItemLifeCycleEnum } from 'src/constants/enum';
import { CollectionEnum } from 'src/db/enum/collection.enum';
import { IUser } from 'src/plugins/authentication';
import { flags } from '../constants/flags';
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
    async function addOrderHandler(req: { body: any; user: IUser }) {
      const orderResult: any[] = [];
      const currentDeliveryStatus = DeliveryStatusEnum.ordered;
      const getOrderItem = (item: any) => {
        const {
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
        };
      };
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

          if (!Array.isArray) {
            throw new Error('Invalid input format - expected array');
          }
          if (Array.isArray(ordersToStore)) {
            //2. check if products exist and there's enough quantity
            const productsInOrder = ordersToStore.reduce(
              (
                products: { _id: ObjectId; item: any; store: string }[],
                order: any
              ) => {
                const itemsArray = order.items.reduce(
                  (
                    acc: { _id: ObjectId; item: any; store: ObjectId }[],
                    element: any
                  ) => {
                    acc.push({
                      _id: new ObjectId(element._id),
                      item: getOrderItem(element),
                      store: order.store,
                    });
                    return acc;
                  },
                  []
                );

                itemsArray.forEach(
                  (element: { _id: ObjectId; item: any; store: string }) => {
                    products.push(element);
                  }
                );
                return products;
              },
              []
            );

            const productPromises = productsInOrder.map(
              async (element: { _id: ObjectId; item: any }) => {
                const product = await fastify
                  .db(process.env.DB_NAME as string)
                  ?.collection(CollectionEnum.Products)
                  .findOne({ _id: new ObjectId(element._id) });

                if (!product) {
                  throw new Error(
                    `Product with _id ${element.item._id} not found`
                  );
                }
                if (product?.availableQuantity < element.item.quantity) {
                  throw new Error(
                    `Not enough quantity of product with _id ${element._id}`
                  );
                }

                return product;
              }
            );

            await Promise.all(productPromises);

            // 3. update products quantity
            await fastify
              .db(process.env.DB_NAME as string)
              ?.collection(CollectionEnum.Products)
              .bulkWrite(
                productsInOrder.map((el: { _id: ObjectId; item: any }) => ({
                  updateOne: {
                    filter: { _id: el._id },
                    update: { $inc: { availableQuantity: -el.item.quantity } },
                  },
                })),
                { session }
              );

            // 3. create order and order items one by one per store
            await Promise.all(
              ordersToStore.map(async (order) => {
                const itms = productsInOrder
                  .filter((item) => item.store === order.store)
                  .map((item: any) => ({
                    ...item.item,
                    store: new ObjectId(item.store),
                  }));

                const orderItems = await fastify
                  .db(process.env.DB_NAME as string)
                  ?.collection(CollectionEnum.OrderItems)
                  .insertMany(itms, { session });

                const newOrder = await fastify
                  .db(process.env.DB_NAME as string)
                  ?.collection(CollectionEnum.Orders)
                  .insertOne(
                    {
                      items: orderItems?.insertedIds
                        ? Object.values(orderItems?.insertedIds)
                        : [],
                      customer,
                      customerContact: {
                        email: req.user.email,
                        phoneNumber: userDetails?.phoneNumber,
                      },
                      store: new ObjectId(order.store),
                      createdAt: new Date(),
                      createdBy: customer,
                      deliveryStatus: fastify.deliveryStatusEnum?.find(
                        (status: { _id: ObjectId; deliveryStatus: string }) =>
                          status?.deliveryStatus === DeliveryStatusEnum.ordered
                      )._id,
                    },
                    { session }
                  );

                orderResult.push(newOrder);
              })
            );

            //  await Promise.all(arr);

            //5. TODO complete payment - if paymentType === card/ paypal
            //6. TODO emit event
            // in event handler -> TODO send confirmation email -> emit event
            // in event handler -> create invoice
          }
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
          console.error(JSON.stringify(error));
        }
      } finally {
        await session.endSession();
      }
      return orderResult;
    }
  );

  done();
};
