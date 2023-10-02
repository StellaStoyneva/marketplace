/* eslint-disable security/detect-object-injection */
import { FastifyPluginCallback, RawServerDefault } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { insertOrderSchema } from '../schemas/insertMany.schema';

export const addOrder: FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider
> = (fastify, _opts, done) => {
  fastify.post(
    '/',
    {
      onRequest: [fastify.authenticate],
      schema: {
        body: insertOrderSchema,
      },
    },
    async (req) => {
      return await fastify.services.orderService.addOrder(req.user, req.body);
    }
  );
  done();
};
