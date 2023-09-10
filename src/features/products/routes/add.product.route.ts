import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ObjectId } from 'mongodb';
import { insertBodySchema } from '../schemas';

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
    async function addProductsHandler(req) {
      const store = req.user.store;
      const createdBy = req.user._id;

      const resultBody = req.body;
      if (Array.isArray(resultBody)) {
        const arr = resultBody.map((res) => ({
          ...res,
          daysForReturn:
            res.daysForReturn ?? Number(process.env.STANDARD_DAYS_TO_RETURN),
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
          store,
          createdBy,
        });
    }
  );

  done();
};

//{"name":"aaa", "password": "test123123", "email": "aa@abv.bg", "store": "64da22bb79c2ec46b859288e", "role": "store admin" }
//{"password": "test123123", "email": "aa@abv.bg" }
//{"name": "nn", "productCode": "aefs" }
