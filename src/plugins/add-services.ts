import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { productService as initiateProductService } from 'src/features/products/product.service';

declare module 'fastify' {
  interface FastifyInstance {
    services: {
      productService: {
        addProducts: (products: any[]) => Promise<any>
      }
    }
  }
}

const dbPlugin: FastifyPluginCallback =
  async function dbPlugin(fastify, _opts, done) {
    const db = fastify.db('test');

    if (db) {
      const productService = initiateProductService(db)

      const services = {
        productService
      }

      fastify.decorate('services', services);

      done();
    } else {
      done(new Error('No database initiated'))
    }
  };

export default fp(dbPlugin);
