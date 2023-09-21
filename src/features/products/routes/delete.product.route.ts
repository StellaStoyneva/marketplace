import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ObjectId } from 'mongodb';
import { CollectionEnum } from 'src/db/enum/collection.enum';
import { z } from 'zod';

export const deleteProduct: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.delete(
    '/:id',
    {
      schema: {
        params: z.object({ id: z.string() }),
      },
    },
    async (req, reply) => {
      const productId = new ObjectId(req.params.id);

      const isAuthorized = await fastify.authorizeStoreAdminForSpecificStore(
        req,
        reply,
        CollectionEnum.Products,
        {
          _id: productId,
        }
      );

      if (!isAuthorized) {
        return;
      }
      return await fastify.services.productService?.deleteProduct(productId);

      // return await fastify.services.productService?.deleteProduct(productId);
    }
  );

  done();
};
