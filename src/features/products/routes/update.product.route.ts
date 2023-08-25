import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
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
    async function updateProductHandler(req) {
      const updatedBy = new ObjectId();
      const res = {
        updatedProd: await fastify
          .db(process.env.DB_NAME as string)
          ?.collection('products')
          .findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { ...req.body, updatedAt: new Date(), updatedBy } }
          ),
      };

      return res.updatedProd?.value;
    }
  );

  done();
};
