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
    async function deleteProductHandler(req, reply) {
      const productId = new ObjectId(req.params.id);

      // fastify.authorizeStoreAdmin(req, reply);

      // const product = await fastify
      // .db(process.env.DB_NAME as string)
      // ?.collection('products')
      // .findOne({ _id: productId });

      // if (product?.store !== req.user.store) {
      // throw new Error('Unauthorized user admin');
      // }
      //
      fastify.authorizeStoreAdmin(req, reply);

      fastify.authorizeStoreAdminForSpecificStore(req, reply, 'products', {
        _id: productId,
      });

      return await fastify
        .db(process.env.DB_NAME as string)
        ?.collection('products')
        .deleteOne({ _id: productId });
    }
  );

  done();
};

const a = () => {
  return;
};
/**
 * import { FastifyPluginCallback, RawServerDefault } from 'fastify';
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
      onRequest: [fastify.authorizeStoreAdmin],
      schema: {
        params: z.object({ id: z.string() }),
      },
    },
    async function deleteProductHandler(req, reply) {
      const productId = new ObjectId(req.params.id);
      const product = await fastify
        .db(process.env.DB_NAME as string)
        ?.collection('products')
        .findOne({ _id: productId });
      if (product?.store !== req.user.store) {
        reply.code(403);
        return;
      }
      return await fastify
        .db(process.env.DB_NAME as string)
        ?.collection('products')
        .deleteOne({ _id: productId });
    }
  );

  done();
};

 */
