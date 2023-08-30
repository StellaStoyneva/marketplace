import {
  FastifyBaseLogger,
  FastifyPluginCallback,
  RawServerDefault,
} from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { FastifyInstance } from 'fastify/types/instance';
import { IncomingMessage, ServerResponse } from 'http';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { insertOneBodySchema } from '../schemas';

export const updateProduct: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.patch(
    '/:id',
    {
      schema: {
        params: z.object({ id: z.string() }),
        body: insertOneBodySchema,
      },
    },
    async function updateProductRoute(req) {
      const result = await updateProductHandler(fastify, req.params, req.body);
      return result;
    }
  );

  done();
};

async function updateProductHandler(
  fastify: FastifyInstance<
    RawServerDefault,
    IncomingMessage,
    ServerResponse<IncomingMessage>,
    FastifyBaseLogger,
    ZodTypeProvider
  >,
  params: Record<string, string>,
  body: Record<string, any>
) {
  const updatedBy = new ObjectId();

  return await fastify
    .db(process.env.DB_NAME as string)
    ?.collection('products')
    .updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...body, updatedAt: new Date(), updatedBy } }
    );
}
