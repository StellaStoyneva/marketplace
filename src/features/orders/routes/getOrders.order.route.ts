import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ObjectId } from 'mongodb';
import { DeliveryStatusEnum, UserRoleEnum } from 'src/constants/enum';
import { CollectionEnum } from 'src/db/enum/collection.enum';

//Pagination
export const getOrders: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.get(
    '/',
    {
      onRequest: [fastify.authenticate],
    },
    async function handler(req, reply) {
      const userRole = req.user.role;

      if (userRole === UserRoleEnum.Customer) {
        const allOrders = fastify
          .db(process.env.DB_NAME as string)
          ?.collection(CollectionEnum.Orders)
          .find({ user: new ObjectId(req.user._id) });
        if (!allOrders) {
          return [];
        }

        const result = await allOrders.toArray();
        return result.map((order: any) => {
          if (order.deliveryStatus === DeliveryStatusEnum.ordered) {
            return { ...order, canBeCanceled: true };
          }
        });
      }
      if (userRole === UserRoleEnum.StoreAdmin) {
        fastify.authorizeStoreAdminForSpecificStore(
          req,
          reply,
          CollectionEnum.Orders,
          { user: new ObjectId(req.user._id) }
        );
        const allOrders = fastify
          .db(process.env.DB_NAME as string)
          ?.collection(CollectionEnum.Orders)
          .find({ store: new ObjectId(req.user.store) });
        if (!allOrders) {
          return reply.code(404);
        }
        return await allOrders.toArray();
      }
    }
  );

  done();
};
