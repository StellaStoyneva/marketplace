import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { queryStringProductSchema } from '../schemas/queryString.product.schema';

export const getProducts: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.get(
    '',
    {
      schema: {
        querystring: queryStringProductSchema,
      },
    },
    async (req) => await fastify.services.productService.getProducts(req.query)
  );

  done();
};
