import Fastify, { FastifyInstance } from 'fastify';
import prismaPlugin from './plugins/prisma.plugin';
import healthRoute from './routes/health.route';

import { ApolloServer } from '@apollo/server';
import { typeDefs } from './graphql/schema';
import fastifyApollo from '@as-integrations/fastify';
import { resolvers } from './graphql/resolvers';
import { buildContext } from './graphql/context';

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

    // Setup Apollo
    const apollo = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apollo.start();

    await app.register(fastifyApollo(apollo), {
        context: buildContext,
    });

    return app;
}