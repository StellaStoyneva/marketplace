import { userSchema } from '@users/schemas/login.user.schema';
import { comparePasswords, hashPassword } from '@users/utils/passwordProcess';
import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export const loginUser: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.post(
    '/login',
    {
      schema: {
        body: userSchema,
      },
    },
    async function handler(req, reply) {
      const { email, password } = req.body;
      const errorMessage = 'User or password is invalid';
      const existingUser = await fastify
        .db(process.env.DB_NAME as string)
        ?.collection('users')
        .findOne({ email });
      if (!existingUser) {
        reply.code(404).send({ message: errorMessage });
        fastify.log.info('User not found');
        return;
      }

      if (!(await comparePasswords(password, existingUser.password))) {
        reply.code(400).send({ message: errorMessage });
        fastify.log.info('Password invalid not found');

        return;
      }

      //console.log('existingUser', existingUser);

      const token = fastify.jwt.sign(
        {
          _id: String(existingUser._id),
          email: existingUser.email,
          role: String(existingUser.role),
          store: existingUser.store,
        },
        {
          jti: String(Date.now()),
          expiresIn: process.env.JWT,
        }
      );
      return { token };
    }
  );

  done();
};
