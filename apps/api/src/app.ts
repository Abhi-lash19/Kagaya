// apps/api/src/app.ts

import Fastify, { FastifyInstance } from 'fastify';
import prismaPlugin from './plugins/prisma.plugin';
import healthRoute from './routes/health.route';

export async function buildApp(): Promise<FastifyInstance> {
    const app = Fastify({
        logger: {
            level: 'info',
        },
    });

    // Register plugins
    await app.register(prismaPlugin);

    // Register routes
    await app.register(healthRoute);

    return app;
}