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
import { productService as initiateProductService } from 'src/features/products/services/product.service';
import { IUser } from './authentication';

declare module 'fastify' {
  interface FastifyInstance {
    services: {
      productService: {
        addProducts: (
          user: IUser,
          products: IInsertProduct[]
        ) => Promise<InsertManyResult<Document>>;
        updateProduct: (
          productId: ObjectId,
          user: IUser,
          data: IUpdateProduct
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
