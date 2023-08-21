import Fastify from 'fastify';
import fastifyQs from 'fastify-qs';
import initiateDb from './plugins/decorate-db'
import { hello } from './api/hello'

import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { productsCount } from './api/product';

const {
  MONGO_HOST = 'localhost',
  MONGO_PORT = '27017',
  MONGO_USER = 'contrast',
  MONGO_PASSWORD = 'password',
} = process.env;

const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;

export const create = async () => {
  const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  app.register(fastifyQs, {});

  // Add schema validator and serializer
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(initiateDb, { url: MONGO_URL })

  app.register(hello, { prefix: '/hello' })
  app.register(productsCount, { prefix: '/products' })

  return app;
}
