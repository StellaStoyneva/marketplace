import { loginUser } from '@users/routes/login.user.route';
import { registerUser } from '@users/routes/register.user.route';
import Fastify from 'fastify';
import fastifyQs from 'fastify-qs';

import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { CollectionEnum } from './db/enum/collection.enum';
import { addOrder } from './features/orders/routes/add.order.route';
import { getOrders } from './features/orders/routes/getOrders.order.route';
import {
  countProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from './features/products/routes';
import { initiateDb, authenticationPlugin, enumsPlugin } from './plugins';

// const {
//   MONGO_HOST = 'localhost',
//   MONGO_PORT = '27017',
//   MONGO_USER = 'contrast',
//   MONGO_PASS = 'password',
// } = process.env;

const { MONGO_HOST, MONGO_PORT, MONGO_USER, MONGO_PASS, MONGO_PROTOCOL } =
  process.env;

const MONGO_URL = `${MONGO_PROTOCOL}://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}${
  MONGO_PORT ? `:${MONGO_PORT}` : ''
}`;

export const create = async () => {
  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  app.register(fastifyQs, {});

  // Add schema validator and serializer
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setNotFoundHandler(function custom404(_request, reply) {
    reply.send({ not: 'found' });
  });
  app.setErrorHandler(function errHandler(error, _request, reply) {
    reply.send(error.message);
  });

  await app.register(initiateDb, { url: MONGO_URL });
  await app.register(enumsPlugin);
  app.register(authenticationPlugin);

  app.register(countProducts, { prefix: '/products' });
  app.register(addProduct, { prefix: '/products' });
  app.register(updateProduct, { prefix: '/products' });
  app.register(deleteProduct, { prefix: '/products' });
  app.register(registerUser, { prefix: '/auth' });
  app.register(loginUser, { prefix: '/auth' });
  app.register(addOrder, { prefix: '/order' });
  //app.register(getOrders, { prefix: '/order' });
  return app;
};
