import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin'
import { Db } from 'mongodb';
import { connectMongoDB } from 'src/db'

declare module 'fastify' {
  interface FastifyInstance {
    db: (dbName: string) => Db | void
  }
}

const dbPlugin: FastifyPluginCallback<{ url: string }> = async function dbPlugin(fastify, opts, done) {
  let db: (dbName: string) => void | Db = () => fastify.log.error('Database connection not established')

  try {
    db = await connectMongoDB(opts.url)
  } catch (err) {
    fastify.log.error({ err })
    done()
  }

  fastify.decorate('db', db);

  done()
}

export default fp(dbPlugin)
