import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { MongoError, ObjectId } from 'mongodb';
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
      const session = fastify.dbClient.startSession();
      try {
        session.startTransaction();
        // 1. TODO complete payment
        // 2. TODO create invoice
        // 3. get customer details
        const customer = req.user._id;
        const userDetails = await fastify
          .db(process.env.DB_NAME as string)
          ?.collection(CollectionEnum.Users)
          .findOne({ _id: new ObjectId(customer) }, { session });
        const { orderItems } = req.body; // transaction id => finalPriceWithVAT

        if (!Array.isArray) {
          throw new Error('Invalid input format - expected array');
        }
        if (Array.isArray(orderItems)) {
          const arr = orderItems.map((res) => {
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
              if (!product) {
                throw new Error(`Product with _id ${element._id} not found`);
              }
              if (element.quantity > product.quantity) {
                throw new Error(
                  `Insufficient quantity of product ${element._id}. Max quantity is ${product.quantity}`
                );
              }
              await fastify
                .db(process.env.DB_NAME as string)
                ?.collection(CollectionEnum.Products)
                .updateOne(
                  {
                    _id: new ObjectId(element._id),
                  },
                  { $inc: { quantity: -element.quantity } },
                  { session }
                );
            });
            // 4. create order
            const currentDeliveryStatus = DeliveryStatusEnum.ordered;

            return {
              ...res.items.map((item: any) => ({
                ...item,
                status: OrderItemLifeCycleEnum.ordered,
              })),
              ...flags[
                currentDeliveryStatus as keyof typeof DeliveryStatusEnum
              ],
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

          const order = await fastify
            .db(process.env.DB_NAME as string)
            ?.collection('orders')
            .insertMany(arr, { session });

          // 5. TODO send confirmation email -> emit event
          return order;
        }

        await session.commitTransaction();
        console.log('Transaction successfully committed.');
      } catch (error) {
        if (
          error instanceof MongoError &&
          error.hasErrorLabel('UnknownTransactionCommitResult')
        ) {
          console.log(error);
        } else if (
          error instanceof MongoError &&
          error.hasErrorLabel('TransientTransactionError')
        ) {
          console.log(error);
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
    }
  );

  done();
};

/***
  {
    "priceToPayOnOrderWithVAT": 1937.8,
    "paymentMethod": "", //PaymentMethodTypeEnum; - card or pay pal
    "invoiceAddress": {
        "streetAddress": "ul.Ivan Vazov 50",
        "zipCode": 4000,
        "city": "Plovdiv",
        "country": "Bulgaria"
    },
    "orderItems": [
        {
            "deliveryType": "64d6150f3fce5756116f4f86", //DeliveryTypeEnum;
            "deliveryRecipient": "Penka Genkova",
            "recipientPhoneNumber": "+3598955555555",
            "finalPriceBeforeVAT": 188.92,
            "finalPriceWithVAT": 226.70,
            "paymentMethod": "64d615b73fce5756116f4f8c",
            "store": "64da22bb79c2ec46b859288f",
            "items": [
                {
                    "_id": "64f6d03f017b5c070e89477c",
                    "name": "dress",
                    "productCode": "ssxy",
                    "images": [
                        "htps://facebook.com"
                    ],
                    "quantity": 2,
                    "singlePriceBeforeVAT": 74.08,
                    "singlePriceWithVAT": 88.9,
                    "finalPriceBeforeVAT": 148.17,
                    "finalPriceWithVAT": 177.8,
                    "returnPeriod": 30
                },
                {
                    "_id": "64f6d03f017b5c070e89477d",
                    "name": "jeans",
                    "productCode": "ssxy",
                    "images": [
                        "htps://facebook.com"
                    ],
                    "quantity": 1,
                    "singlePriceBeforeVAT": 40.75,
                    "singlePriceWithVAT": 48.9,
                    "finalPriceBeforeVAT": 40.75,
                    "finalPriceWithVAT": 48.9,
                    "returnPeriod": 30
                }
            ]
        },
        {
            "finalPriceBeforeVAT": 1500,
            "finalPriceWithVAT": 1800,
            "paymentMethod": "64d615ab3fce5756116f4f8b",
            "invoiceAddress": {
                "streetAddress": "ul.Veliko Tarnovo 95",
                "zipCode": 1008,
                "city": "Sofia",
                "country": "Bulgaria"
            },
            "deliveryType": "64d614b4be3205c2ce47dfd4", //DeliveryTypeEnum;
            "deliveryRecipient": "Stoyan Todorov",
            "recipientPhoneNumber": "+359894444444",
            "store": "64f6d5a7017b5c070e89477e",
            "items": [
                {
                    "_id": "64f6d654017b5c070e89477f",
                    "name": "chair",
                    "productCode": "sitty",
                    "quantity": 1,
                    "singlePriceBeforeVAT": 166.67,
                    "singlePriceWithVAT": 200,
                    "finalPriceBeforeVAT": 666.67,
                    "finalPriceWithVAT": 800,
                    "returnPeriod": 365,
                    "images": [
                        "htps://facebook.com"
                    ]
                },
                {
                    "_id": "64f6d654017b5c070e894780",
                    "name": "sofa",
                    "productCode": "soffi",
                    "quantity": 1,
                    "singlePriceBeforeVAT": 833.33,
                    "singlePriceWithVAT": 1000,
                    "finalPriceBeforeVAT": 833.33,
                    "finalPriceWithVAT": 1000,
                    "returnPeriod": 365,
                    "images": [
                        "htps://google.com"
                    ]
                }
            ]
        }
    ]
}
 */
