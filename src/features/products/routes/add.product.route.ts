import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ObjectId } from 'mongodb';
import { insertBodySchema } from '../schemas';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      _id: string,
      store: string
    }
  }
}

export const addProduct: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.post(
    '/',
    {
      onRequest: [fastify.authorizeStoreAdmin],
      schema: {
        body: insertBodySchema,
      },
    },
    async function countProductsHandler(req) {
      console.log(req.body);
      //TODO add user as createdBy value
      //TODO add store id as store
      // const store = new ObjectId();
      // const createdBy = new ObjectId();

      const store = req.user.store;
      const createdBy = req.user._id;
      console.log({ usr: req.user });

      const resultBody = req.body;
      if (Array.isArray(resultBody)) {
        const arr = resultBody.map((res) => ({
          ...res,
          createdAt: new Date(),
          store,
          createdBy,
        }));

        return await fastify
          .db(process.env.DB_NAME as string)
          ?.collection('products')
          .insertMany(arr);
      }

      return await fastify
        .db(process.env.DB_NAME as string)
        ?.collection('products')
        .insertOne({
          ...(resultBody as object),
          createdAt: new Date(),
          createdBy: new ObjectId(),
        });
    }
  );

  done();
};

//{"name":"aaa", "password": "test123123", "email": "aa@abv.bg", "store": "64da22bb79c2ec46b859288e", "role": "store admin" }
//{"password": "test123123", "email": "aa@abv.bg" }
//{"name": "nn", "productCode": "aefs" }
