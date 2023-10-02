import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import { Db, MongoClient } from 'mongodb';
import { connectMongoDB, createMongoClient } from 'src/db';

declare module 'fastify' {
  interface FastifyInstance {
    db: (dbName: string) => Db | void;
    dbClient: MongoClient;
  }
}

const dbPlugin: FastifyPluginCallback<{ url: string }> =
  async function dbPlugin(fastify, opts, done) {
    let db: (dbName: string) => void | Db = () =>
      fastify.log.error('Database connection not established');
    let client;
    try {
      client = await createMongoClient(opts.url);
      db = await connectMongoDB(client);
    } catch (err) {
      fastify.log.error({ err });
      done();
    }

    fastify.decorate('db', db);
    fastify.decorate('dbClient', client as MongoClient);

    done();
  };

export default fp(dbPlugin);
