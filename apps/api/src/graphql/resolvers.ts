// apps/api/src/graphql/resolvers.ts

import { GraphQLContext } from './context';

export const resolvers = {
    Query: {
        organizations: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
            return ctx.prisma.organization.findMany({
                orderBy: { createdAt: 'desc' },
            });
        },
    },

    Mutation: {
        createOrganization: async (
            _: unknown,
            args: { name: string },
            ctx: GraphQLContext,
        ) => {
            return ctx.prisma.organization.create({
                data: {
                    name: args.name,
                },
            });
        },
    },
};