import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import {
  DeleteResult,
  Document,
  InsertManyResult,
  ObjectId,
  UpdateResult,
  WithId,
} from 'mongodb';
import {
  IInsertProduct,
  IQueryStringProduct,
  IUpdateProduct,
} from 'src/features/products';
import { productService as initiateProductService } from 'src/features/products/product.service';

declare module 'fastify' {
  interface FastifyInstance {
    services: {
      productService: {
        addProducts: (
          products: IInsertProduct[]
        ) => Promise<InsertManyResult<Document>>;
        updateProduct: (
          id: ObjectId,
          products: IUpdateProduct
        ) => Promise<UpdateResult<Document>>;
        deleteProduct: (id: ObjectId) => Promise<DeleteResult>;
        getProducts: (
          queryString: IQueryStringProduct
        ) => Promise<WithId<Document>[]>;
      };
    };
  }
}

const dbPlugin: FastifyPluginCallback = async function dbPlugin(
  fastify,
  _opts,
  done
) {
  const db = fastify.db(process.env.DB_NAME as string);

  if (db) {
    const productService = initiateProductService(db);

    const services = {
      productService,
    };

    fastify.decorate('services', services);

    done();
  } else {
    done(new Error('No database initiated'));
  }
};

export default fp(dbPlugin);
