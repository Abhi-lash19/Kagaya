// apps/api/src/services/featureFlag.service.ts

import { prisma } from '@kagaya/database';
import { percentageHash } from '../utils/hash.util';
import { GraphQLError } from 'graphql';

type PrismaClientType = typeof prisma;

export class FeatureFlagService {
    constructor(private prisma: PrismaClientType) { }

    /**
     * Create Feature Flag
     */
    async createFlag(data: {
        orgId: string;
        key: string;
        description?: string;
        enabled?: boolean;
        rolloutPercentage?: number;
    }) {
        const orgExists = await this.prisma.organization.findUnique({
            where: { id: data.orgId },
            select: { id: true },
        });

        if (!orgExists) {
            throw new GraphQLError('Organization not found', {
                extensions: {
                    code: 'NOT_FOUND',
                    entity: 'Organization',
                    orgId: data.orgId,
                },
            });
        }

        if (
            data.rolloutPercentage !== undefined &&
            (data.rolloutPercentage < 0 || data.rolloutPercentage > 100)
        ) {
            throw new GraphQLError('Rollout percentage must be between 0 and 100', {
                extensions: {
                    code: 'BAD_USER_INPUT',
                    field: 'rolloutPercentage',
                },
            });
        }

        try {
            return await this.prisma.featureFlag.create({
                data: {
                    organizationId: data.orgId,
                    key: data.key,
                    description: data.description,
                    enabled: data.enabled ?? false,
                    rolloutPercentage: data.rolloutPercentage ?? 100,
                },
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new GraphQLError(
                    'Feature flag with this key already exists for this organization',
                    {
                        extensions: {
                            code: 'CONFLICT',
                            entity: 'FeatureFlag',
                            key: data.key,
                            orgId: data.orgId,
                        },
                    },
                );
            }

            // 🧨 Foreign key violation fallback (shouldn't happen due to pre-check)
            if (error.code === 'P2003') {
                throw new GraphQLError('Invalid organization reference', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        entity: 'Organization',
                        orgId: data.orgId,
                    },
                });
            }

            // 🚨 Unknown error fallback
            throw new GraphQLError('Failed to create feature flag', {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR',
                },
            });
        }
    }

    /**
     * Get Flags by Organization
     */
    async getFlagsByOrg(orgId: string) {
        return this.prisma.featureFlag.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Update Feature Flag (partial update)
     */
    async updateFlag(data: {
        orgId: string;
        key: string;
        description?: string;
        enabled?: boolean;
        rolloutPercentage?: number;
    }) {
        const existing = await this.prisma.featureFlag.findUnique({
            where: {
                organizationId_key: {
                    organizationId: data.orgId,
                    key: data.key,
                },
            },
        });

        if (!existing) {
            throw new GraphQLError('Feature flag not found', {
                extensions: { code: 'NOT_FOUND' },
            });
        }

        if (
            data.rolloutPercentage !== undefined &&
            (data.rolloutPercentage < 0 || data.rolloutPercentage > 100)
        ) {
            throw new GraphQLError('Rollout percentage must be between 0 and 100', {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }

        return this.prisma.featureFlag.update({
            where: {
                organizationId_key: {
                    organizationId: data.orgId,
                    key: data.key,
                },
            },
            data: {
                description: data.description ?? existing.description,
                enabled: data.enabled ?? existing.enabled,
                rolloutPercentage:
                    data.rolloutPercentage ?? existing.rolloutPercentage,
            },
        });
    }

    /**
     * Delete Feature Flag
     */
    async deleteFlag(orgId: string, key: string): Promise<boolean> {
        const existing = await this.prisma.featureFlag.findUnique({
            where: {
                organizationId_key: {
                    organizationId: orgId,
                    key,
                },
            },
        });

        if (!existing) {
            throw new GraphQLError('Feature flag not found', {
                extensions: { code: 'NOT_FOUND' },
            });
        }

        await this.prisma.featureFlag.delete({
            where: {
                organizationId_key: {
                    organizationId: orgId,
                    key,
                },
            },
        });

        return true;
    }

    /**
     * Evaluate Feature Flag
     */
    async evaluateFlag(
        orgId: string,
        key: string,
        userId: string,
    ): Promise<boolean> {
        const flag = await this.prisma.featureFlag.findUnique({
            where: {
                organizationId_key: {
                    organizationId: orgId,
                    key,
                },
            },
        });

        if (!flag || !flag.enabled) return false;

        const bucket = percentageHash(`${userId}:${key}`);

        return bucket < flag.rolloutPercentage;
    }
}