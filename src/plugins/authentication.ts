import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { UserRoleEnum } from 'src/constants/enum';
import { ObjectId } from 'mongodb';

const { JWT_SECRET } = process.env;
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    authorizeStoreAdmin: (request: any, reply: FastifyReply) => Promise<void>;
    authorizeStoreAdminForSpecificStore: (
      request: FastifyRequest,
      reply: FastifyReply,
      coll: string,
      query: Record<string, ObjectId>
    ) => Promise<void>;
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
          //console.log('req user', request.user);
        } catch (err) {
          reply.send(err);
        }
      }
    );

    fastify.decorate(
      'authorizeStoreAdmin',
      async function authorizeStoreAdmin(request, reply) {
        try {
          await request.jwtVerify();

          if (request.user.role !== UserRoleEnum.StoreAdmin) {
            throw new Error(
              'User is not authorized for this operation. User must have store admin rights'
            );
          }
        } catch (err) {
          reply.send(err);
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
        try {
          await request.jwtVerify();

          if (request.user.role !== UserRoleEnum.StoreAdmin) {
            throw new Error(
              'User is not authorized for this operation. User must have store admin rights'
            );
          }

          const itemInParams = await fastify
            .db(process.env.DB_NAME as string)
            ?.collection(coll)
            .findOne(query);

          if (request.user.store !== itemInParams?.store) {
            throw new Error('Unauthorized store admin');
          }
        } catch (err) {
          reply.send(err);
        }
      }
    );

    // fastify.decorateRequest('generateToken', function (this: FastifyRequest) {
    //   const token = fastify.jwt.sign(
    //     {
    //       id: String(this.user._id),
    //       username: this.user.username,
    //     },
    //     {
    //       jti: String(Date.now()),
    //       expiresIn: process.env.JWT_EXPIRE_IN,
    //     }
    //   );
    //   return token;
    // });

    done();
  };

export default fp(authenticationPlugin);
