import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { insertProductsBodySchema } from '../schemas';

export const addProducts: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.post(
    '/',
    {
      onRequest: [fastify.authenticate, fastify.authorizeStoreAdmin],
      schema: {
        body: insertProductsBodySchema,
      },
    },
    async (req) => {
      return await fastify.services.productService.addProducts(
        req.user,
        req.body
      );
    }
  );

  done();
};
