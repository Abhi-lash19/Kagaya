import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { prisma } from '@kagaya/database';

/**
 * Prisma plugin
 * Attaches Prisma client to Fastify instance
 * Ensures graceful shutdown
 */
async function prismaPlugin(app: FastifyInstance) {
    app.decorate('prisma', prisma);

    app.addHook('onClose', async () => {
        await prisma.$disconnect();
    });
}

export default fp(prismaPlugin);