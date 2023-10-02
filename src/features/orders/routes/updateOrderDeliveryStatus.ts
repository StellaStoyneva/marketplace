import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ObjectId } from 'mongodb';
import { DeliveryStatusEnum, OrderItemLifeCycleEnum } from 'src/constants/enum';
import { CollectionEnum } from 'src/db/enum/collection.enum';
import { z } from 'zod';
import { flags } from '../constants/flags';
import { updateDeliveryStatusSchema } from '../schemas/updateDeliveryStatus.schema';

/**
  delivered -> return date Item level should be calculated
  canceled -> rollback quantity
  shippedBack -> refund date Order level should be calculated
 */

export const updateOrderDeliveryStatus: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.patch(
    '/:id',
    {
      schema: {
        params: z.object({ id: z.string() }),
        body: updateDeliveryStatusSchema,
      },
    },
    async function handler(req, reply) {
      const orderId = new ObjectId(req.params.id);
      fastify.authorizeStoreAdminForSpecificStore(
        req,
        reply,
        CollectionEnum.Orders,
        {
          _id: orderId,
        }
      );

      const updatedBy = new ObjectId(req.user._id);
      const deliveryStatusId =
        fastify.deliveryStatusEnum && req.body.deliveryStatus
          ? fastify.deliveryStatusEnum[req.body.deliveryStatus]
          : null;

      const updatedAt = 0; //new Date();
      if (
        req.body.deliveryStatus === OrderItemLifeCycleEnum.shippedBack &&
        !req.body.items
      ) {
        throw new Error('Invalid request body. Returned items required');
      } else {
        // install moment
        // find order
        // loop through items in body and update their status, adding refund array: accumulated price and refund deadline
        // const refundDeadline = updatedAt + Number(process.env.DAYS_TO_REFUND);
      }
      if (req.body.deliveryStatus === DeliveryStatusEnum.delivered) {
        // transaction
        // find order and update their return
        // update order with the delivery status and the rest of the object
      }
      if (req.body.deliveryStatus === OrderItemLifeCycleEnum.deliveredBack) {
        // transaction
        // find order
        // loop through all items and update their return deadline
        // update order with the delivery status and the rest of the object
      }

      return await fastify
        .db(process.env.DB_NAME as string)
        ?.collection('products')
        .updateOne(
          { _id: orderId },
          {
            $set: {
              ...flags[
                req.body.deliveryStatus as keyof typeof DeliveryStatusEnum
              ],
              deliveryStatus: deliveryStatusId,
              updatedAt,
              updatedBy,
            },
          }
        );
    }
  );

  done();
};
