import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ObjectId } from 'mongodb';
import { CollectionEnum } from '../../../db/enum/collection.enum';
import { z } from 'zod';

export const deleteProduct: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.delete(
    '/:id',
    {
      onRequest: [fastify.authenticate, fastify.authorizeStoreAdmin],
      schema: {
        params: z.object({ id: z.string() }),
      },
    },
    async (req, reply) => {
      const productId = new ObjectId(req.params.id);

      await fastify.authorizeStoreAdminForSpecificStore(
        req,
        reply,
        CollectionEnum.Products,
        {
          _id: productId,
        }
      );

      return await fastify.services.productService.deleteProduct(productId);
    }
  );

  done();
};
