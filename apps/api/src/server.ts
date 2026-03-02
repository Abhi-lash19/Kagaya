// apps/api/src/server.ts

import Fastify from 'fastify';

const app = Fastify({
  logger: true,
});

app.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    await app.listen({ port: 4000 });
    console.log('🚀 API running on http://localhost:4000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
