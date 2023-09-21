import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { insertProductsBodySchema } from '../schemas';
import { processNewOrderRequest } from './../utils';

export const addProducts: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.post(
    '/',
    {
      onRequest: [fastify.authorizeStoreAdmin],
      schema: {
        body: insertProductsBodySchema,
      },
    },
    async (req) => {
      const productsArray = processNewOrderRequest(req.user, req.body);
      return await fastify.services.productService.addProducts(productsArray);
    }
  );

  done();
};
