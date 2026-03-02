import { FastifyRequest } from 'fastify';
import type { prisma } from '@kagaya/database';

export interface GraphQLContext {
    prisma: typeof prisma;
}

export async function buildContext(
    request: FastifyRequest,
): Promise<GraphQLContext> {
    return {
        prisma: request.server.prisma,
    };
}