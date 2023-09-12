import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ObjectId } from 'mongodb';
import { insertBodySchema, insertOneBodySchema } from '../schemas';

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
        body: insertOneBodySchema,
      },
    },
    async function addProductsHandler(req) {
      const store = new ObjectId(req.user.store);
      const createdBy = new ObjectId(req.user._id);

      const resultBody = req.body;
      if (Array.isArray(resultBody)) {
        const arr = resultBody.map((res) => ({
          ...res,
          isPromoted:
            res.isPromoted && res.isPromoted === 'true' ? true : false,
          productCategories: res.productCategories.map(
            (cat: string) => new ObjectId(cat)
          ),
          productTypes: new ObjectId(res.productTypes),
          daysForReturn: res.daysForReturn,
          isReturnable: !!res.daysForReturn,
          createdAt: new Date(),
          store,
          createdBy,
        }));

        return await fastify
          .db(process.env.DB_NAME as string)
          ?.collection('products')
          .insertMany(arr);
      }
    }
  );

  done();
};
