import { FastifyBaseLogger } from 'fastify';

import { FastifyPluginCallback, RawServerDefault } from 'fastify';

import { ZodTypeProvider } from 'fastify-type-provider-zod';
import orderRoutes from '../features/orders/routes';
import productRoutes from '../features/products/routes';
import { FastifyInstance } from 'fastify/types/instance';
import { IncomingMessage, Server, ServerResponse } from 'http';

type routType = FastifyPluginCallback<
  Record<never, never>,
  RawServerDefault,
  ZodTypeProvider,
  FastifyBaseLogger
>;

export const registerRoutes = (
  app: FastifyInstance<
    Server<typeof IncomingMessage, typeof ServerResponse>,
    IncomingMessage,
    ServerResponse<IncomingMessage>,
    FastifyBaseLogger,
    ZodTypeProvider
  >
) => {
  productRoutes.forEach((route: routType) =>
    app.register(route, { prefix: '/products' })
  );

  orderRoutes.forEach((route: routType) =>
    app.register(route, { prefix: '/order' })
  );
};
