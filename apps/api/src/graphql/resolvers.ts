// apps/api/src/graphql/resolvers.ts

import { GraphQLContext } from './context';
import { FeatureFlagService } from '../services/featureFlag.service';

export const resolvers = {
    Query: {
        organizations: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
            return ctx.prisma.organization.findMany({
                orderBy: { createdAt: 'desc' },
            });
        },

        featureFlags: async (
            _: unknown,
            args: { orgId: string },
            ctx: GraphQLContext,
        ) => {
            const service = new FeatureFlagService(ctx.prisma);
            return service.getFlagsByOrg(args.orgId);
        },

        evaluateFlag: async (
            _: unknown,
            args: { orgId: string; key: string; userId: string },
            ctx: GraphQLContext,
        ) => {
            const service = new FeatureFlagService(ctx.prisma);
            return service.evaluateFlag(args.orgId, args.key, args.userId);
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

        createFeatureFlag: async (
            _: unknown,
            args: {
                orgId: string;
                key: string;
                description?: string;
                enabled?: boolean;
                rolloutPercentage?: number;
            },
            ctx: GraphQLContext,
        ) => {
            const service = new FeatureFlagService(ctx.prisma);
            return service.createFlag(args);
        },

        updateFeatureFlag: async (
            _: unknown,
            args: {
                orgId: string;
                key: string;
                description?: string;
                enabled?: boolean;
                rolloutPercentage?: number;
            },
            ctx: GraphQLContext,
        ) => {
            const service = new FeatureFlagService(ctx.prisma);
            return service.updateFlag(args);
        },

        deleteFeatureFlag: async (
            _: unknown,
            args: { orgId: string; key: string },
            ctx: GraphQLContext,
        ) => {
            const service = new FeatureFlagService(ctx.prisma);
            return service.deleteFlag(args.orgId, args.key);
        },
    },
};