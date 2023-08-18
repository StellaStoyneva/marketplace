import { config } from 'dotenv';
import Fastify from 'fastify';
import { dbMapper } from './db/config/dbMapper';
import { dbEnum } from './db/enum/db.enum';
import { connectDb } from './db/utils/connectDb';
// import { mongoDB } from './db/config/mongoDB';
// import { CollectionEnum } from './db/enum/collection.enum';
import {
  getProductsCountRoute,
  getProductsRangeRoute,
} from './features/products/services';
import fastifyQS from 'fastify-qs';
config();

const app = Fastify({
  logger: true,
});

app.register(fastifyQS, {});

app.register(getProductsCountRoute, { prefix: '/v1' });
app.register(getProductsRangeRoute, { prefix: '/v1' });

const startServer = async () => {
  try {
    await app.ready();
    //console.log(app.printRoutes());

    await app.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    app.log.error('Fastify ERROR', JSON.stringify(err));
    process.exit(1);
  }
};

export const startApp = async () => {
  startServer();
  connectDb(dbEnum.Mongo, dbMapper);
  // const result = await mongoDB
  //   .collection(CollectionEnum.Products)
  //   .countDocuments({ ratingAverage: 2.41 });
  // console.log('COUNT', result);
};
