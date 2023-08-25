import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ObjectId } from 'mongodb';
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
    async function updateProductHandler(req) {
      return await fastify
        .db(process.env.DB_NAME as string)
        ?.collection('products')
        .deleteOne({ _id: new ObjectId(req.params.id) });
    }
  );

  done();
};
