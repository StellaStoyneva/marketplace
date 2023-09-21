/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  FastifyPluginCallback,
  FastifySchema,
  RawServerDefault,
  RouteGenericInterface,
} from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { ObjectId } from 'mongodb';
import { IncomingMessage } from 'http';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

const { JWT_SECRET } = process.env;
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: <T extends FastifySchema>(
      request: FastifyRequest<
        RouteGenericInterface,
        RawServerDefault,
        IncomingMessage,
        T,
        ZodTypeProvider
      >,
      reply: FastifyReply
    ) => Promise<void>;

    authorizeStoreAdmin: <T extends FastifySchema>(
      request: FastifyRequest<
        RouteGenericInterface,
        RawServerDefault,
        IncomingMessage,
        T,
        ZodTypeProvider
      >,
      reply: FastifyReply,
      done: (err?: undefined | Error) => void
    ) => Promise<void>;
    authorizeStoreAdminForSpecificStore: <T extends FastifySchema>(
      request: FastifyRequest<
        RouteGenericInterface,
        RawServerDefault,
        IncomingMessage,
        T,
        ZodTypeProvider
      >,
      reply: FastifyReply,
      coll: string,
      query: { _id: ObjectId }
    ) => Promise<boolean>;
  }
}

export interface IUser {
  email: string;
  role: string;
  store?: string;
  _id: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: any;
    user: IUser;
  }
}

const authenticationPlugin: FastifyPluginCallback =
  async function authenticationPlugin(fastify, opts, done) {
    const revokedTokens = new Map<string, boolean>();

    fastify.register(fastifyJwt, {
      secret: JWT_SECRET as string,
      trusted: function isTrusted(request, decodedToken) {
        return !revokedTokens.has(decodedToken.jti);
      },
    });

    fastify.decorate(
      'authenticate',
      async function authenticate(request, reply) {
        console.log('authenticate');

        try {
          await request.jwtVerify();
        } catch (err) {
          reply.send(err);
        }
      }
    );

    fastify.decorate(
      'authorizeStoreAdmin',
      async function authorizeStoreAdmin(request, reply, done) {
        try {
          console.log(request.user);

          await request.jwtVerify();

          if (request.user.role !== String(fastify.userRolesEnum!.storeAdmin)) {
            done(new Error(authenticationErrors.notStoreAdmin));
            throw new Error(authenticationErrors.notStoreAdmin);
          }
          done();
        } catch (err) {
          reply.send(err);
          return;
        }
      }
    );

    fastify.decorate(
      'authorizeStoreAdminForSpecificStore',
      async function authorizeStoreAdminForSpecificStore(
        request,
        reply,
        coll,
        query
      ) {
        let isAuthorized = false;

        try {
          await request.jwtVerify();

          if (request.user.role !== String(fastify.userRolesEnum!.storeAdmin)) {
            done(new Error(authenticationErrors.notStoreAdmin));
            throw new Error(authenticationErrors.notStoreAdmin);
          }

          const itemInParams = await fastify
            .db(process.env.DB_NAME as string)
            ?.collection(coll)
            .findOne(query);

          if (request.user.store !== String(itemInParams?.store)) {
            done(new Error(authenticationErrors.notStoreAdminToSameStore));
            throw new Error(authenticationErrors.notStoreAdminToSameStore);
          }

          isAuthorized = true;
        } catch (err) {
          reply.send(err);
          isAuthorized = false;
        }
        return isAuthorized;
      }
    );

    done();
  };

export default fp(authenticationPlugin);

enum authenticationErrors {
  notStoreAdmin = 'User is not authorized for this operation. User must have store admin rights',
  notStoreAdminToSameStore = 'Unauthorized store admin',
}
