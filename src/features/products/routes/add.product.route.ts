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
      schema: {
        body: insertBodySchema,
      },
    },
    async function countProductsHandler(req) {
      console.log(req.body);
      //TODO add user as createdBy value
      //TODO add store id as store
      const store = new ObjectId();
      const createdBy = new ObjectId();

      const resultBody = req.body;
      if (Array.isArray(resultBody)) {
        resultBody.forEach((res) => ({
          ...res,
          createdAt: new Date(),
          store,
          createdBy,
        }));

        return await fastify
          .db(process.env.DB_NAME as string)
          ?.collection('products')
          .insertMany(resultBody);
      }

      return await fastify
        .db(process.env.DB_NAME as string)
        ?.collection('products')
        .insertOne({
          ...req.body,
          createdAt: new Date(),
          createdBy: new ObjectId(),
        });
    }
  );

  done();
};
