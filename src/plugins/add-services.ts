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
import { orderService as initiateOrderService } from 'src/features/orders/services/order.service';
import { IUser } from './authentication';
import { IRequestBodyInsertOrder } from 'src/features/orders/entities';

declare module 'fastify' {
  interface FastifyInstance {
    services: {
      orderService: {
        addOrder: (
          user: IUser,
          data: IRequestBodyInsertOrder
        ) => Promise<unknown>;
      };
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

const servicesPlugin: FastifyPluginCallback = async function servicesPlugin(
  fastify,
  _opts,
  done
) {
  const db = fastify.db(process.env.DB_NAME as string);
  const dbClient = fastify.dbClient;
  const deliveryStatusEnum = fastify.deliveryStatusEnum;

  if (db) {
    const productService = initiateProductService(db);
    const orderService = initiateOrderService(db, dbClient, deliveryStatusEnum);

    const services = {
      productService,
      orderService,
    };

    fastify.decorate('services', services);

    done();
  } else {
    done(new Error('No database initiated'));
  }
};

export default fp(servicesPlugin);
