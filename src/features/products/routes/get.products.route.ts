import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CollectionEnum } from 'src/db/enum/collection.enum';
import { z } from 'zod';
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
        //params: z.object({ count: z.string() }).optional(),
        querystring: queryStringProductSchema,
      },
    },
    async (req) => {
      console.log({ params: req });

      return await fastify.services.productService.getProducts(req.query);
    }
  );

  done();
};
