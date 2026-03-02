// apps/api/src/server.ts

import Fastify from 'fastify';
import { buildApp } from './app';

const app = Fastify({
  logger: true,
});

app.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  const app = await buildApp();

  try {
    await app.listen({
      port: 4000,
      host: '0.0.0.0',
    });

    app.log.info('🚀 Kagaya API running at http://localhost:4000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();