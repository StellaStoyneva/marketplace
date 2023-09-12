import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { Collection, MongoError, ObjectId, ServerSession } from 'mongodb';
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
      console.log(req.body);
      let order;
      const session = fastify.dbClient.startSession();
      try {
        session.startTransaction();
        console.log('Session started');

        // 1. TODO create invoice
        // 2. get customer details
        const customer = req.user._id;
        const userDetails = await fastify
          .db(process.env.DB_NAME as string)
          ?.collection(CollectionEnum.Users)
          .findOne({ _id: new ObjectId(customer) }, { session });

        console.log({ userDetails });

        const { ordersToStore } = req.body; // transaction id => finalPriceWithVAT

        if (!Array.isArray) {
          throw new Error('Invalid input format - expected array');
        }
        if (Array.isArray(ordersToStore)) {
          console.log(47);
          const arr = ordersToStore.map((res) => {
            // 3. update products in order items quantity
            res.items.forEach(async (element: any) => {
              const product = await fastify
                .db(process.env.DB_NAME as string)
                ?.collection(CollectionEnum.Products)
                .findOne(
                  {
                    _id: new ObjectId(element._id),
                  },
                  { session }
                );
              console.log({ product });

              if (!product) {
                throw new Error(`Product with _id ${element._id} not found`);
              }
              if (element.quantity > product.availableQuantity) {
                throw new Error(
                  `Insufficient quantity of product ${element._id}. Max quantity is ${product.availableQuantity}`
                );
              }
              await fastify
                .db(process.env.DB_NAME as string)
                ?.collection(CollectionEnum.Products)
                .updateOne(
                  {
                    _id: new ObjectId(element._id),
                  },
                  { $inc: { availableQuantity: -element.quantity } },
                  { session }
                );
            });
            // 3. create order
            const currentDeliveryStatus = DeliveryStatusEnum.ordered;
            console.log({ currentDeliveryStatus });

            return {
              ...res.items.map((item: any) => ({
                ...item,
                ...flags[
                  currentDeliveryStatus as keyof typeof DeliveryStatusEnum
                ],
                status: OrderItemLifeCycleEnum.ordered,
              })),
              customer,
              customerContact: {
                email: req.user.email,
                phoneNumber: userDetails?.phoneNumber,
              },
              store: new ObjectId(res.store),
              createdAt: new Date(),
              createdBy: customer,
              deliveryStatus: fastify.deliveryStatusEnum?.find(
                (status: { _id: ObjectId; deliveryStatus: string }) =>
                  status?.deliveryStatus === DeliveryStatusEnum.ordered
              )._id,
            };
          });

          console.log({ arr });

          order = await fastify
            .db(process.env.DB_NAME as string)
            ?.collection(CollectionEnum.Orders)
            .insertMany(arr, { session });
          return order;

          // console.log({ order });

          //5. TODO complete payment - if paymentType === card/ paypal
          //6. TODO emit event
          // event handler -> TODO send confirmation email -> emit event
          // event handler -> create invoice
          //return order;
        }
        await session.commitTransaction();

        console.log('Transaction successfully committed.');
      } catch (error) {
        if (
          error instanceof MongoError &&
          error.hasErrorLabel('UnknownTransactionCommitResult')
        ) {
          console.log(132, error);
        } else if (
          error instanceof MongoError &&
          error.hasErrorLabel('TransientTransactionError')
        ) {
          console.log(137, error);
        } else {
          console.log(
            'An error occurred in the transaction, performing a data rollback:' +
              error
          );
        }
        await session.abortTransaction();
      } finally {
        await session.endSession();
      }
      console.log({ order });
      //return order;
    }
  );

  done();
};
