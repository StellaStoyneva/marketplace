import Fastify from 'fastify';
import fastifyQs from 'fastify-qs';
import initiateDb from './plugins/decorate-db';

import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { productsCount } from './features/products/services';

// const {
//   MONGO_HOST = 'localhost',
//   MONGO_PORT = '27017',
//   MONGO_USER = 'contrast',
//   MONGO_PASSWORD = 'password',
// } = process.env;

// const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
const MONGO_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.w0gfkgp.mongodb.net/?retryWrites=true&w=majority`;

export const create = async () => {
  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  app.register(fastifyQs, {});

  // Add schema validator and serializer
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(initiateDb, { url: MONGO_URL });

  app.register(productsCount, { prefix: '/products' });

  return app;
};
