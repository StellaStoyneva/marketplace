import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { queryStringProductSchema } from '../schemas/queryStringProductSchema';
import { productsQueryFilter } from '../utils/queryFilter';

export const productsCount: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.get(
    '/count',
    {
      schema: {
        querystring: queryStringProductSchema,
      },
    },
    async (req, reply) => {
      console.log(req.query);
      const resultQuery = Object.entries(req.query).reduce(
        (acc: any, [k, v]) => {
          return {
            ...acc,
            ...productsQueryFilter[k as keyof typeof productsQueryFilter](
              v as any
            ),
          };
        },
        {}
      );

      reply.send({
        productsCount: await fastify
          .db(process.env.DB_NAME as string)
          ?.collection('products')
          .countDocuments(resultQuery),
      });
    }
  );

  done();
};
