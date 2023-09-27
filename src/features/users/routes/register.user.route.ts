import { registerUserSchema } from '@users/schemas/register.user.schema';
import { hashPassword } from '@users/utils/passwordProcess';
import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UserRoleEnum } from 'src/constants/enum';

export const registerUser: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.post(
    '/register',
    {
      schema: {
        body: registerUserSchema,
      },
    },
    async function handler(req, reply) {
      const { email, password, role, store } = req.body;
      const existingUser = await fastify
        .db(process.env.DB_NAME as string)
        ?.collection('users')
        .findOne({ email });
      if (existingUser) {
        reply.code(400).send({ message: 'User already exists' });
        return;
      }
      if (role === UserRoleEnum.StoreAdmin && !store) {
        reply.code(400).send({
          message: 'Store is required for registration of store admin account',
        });
      }

      const hashedPass = await hashPassword(password);

      const body = {
        email: req.body.email,
        password: hashedPass,
        role: fastify.userRolesEnum![role],
        store: req.body.store,
      };

      return await fastify
        .db(process.env.DB_NAME as string)
        ?.collection('users')
        .insertOne(body);
    }
  );

  done();
};
