import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { updateProductBodySchema } from '../schemas';
import { processProductUpdateRequestBody } from '../utils';

export const updateProduct: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.patch(
    '/:id',
    {
      onRequest: [fastify.authenticate, fastify.authorizeStoreAdmin],
      schema: {
        params: z.object({ id: z.string() }),
        body: updateProductBodySchema,
      },
    },
    async (req, reply) => {
      const productId = new ObjectId(req.params.id);

      await fastify.authorizeStoreAdminForSpecificStore(
        req,
        reply,
        'products',
        {
          _id: productId,
        }
      );

      return await fastify.services.productService.updateProduct(
        productId,
        req.user,
        req.body
      );
    }
  );

  done();
};
