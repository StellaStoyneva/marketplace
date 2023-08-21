import '@extensions/zod/register';
import { create as createApp } from './app';

async function bootstrap() {
  // create the app
  const app = await createApp();

  // start server
  try {
    await app.listen({ port: 5050, host: '0.0.0.0' });

    console.log(`App is running on http://localhost:5050`);
  } catch (err) {
    app.log.error('Fastify ERROR', JSON.stringify(err));
    process.exit(1);
  }
}

bootstrap();
