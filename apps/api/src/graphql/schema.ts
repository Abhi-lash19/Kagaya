// apps/api/src/graphql/schema.ts

export const typeDefs = `
  type Organization {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type FeatureFlag {
    id: ID!
    key: String!
    description: String
    enabled: Boolean!
    rolloutPercentage: Int!
    organizationId: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    organizations: [Organization!]!
    featureFlags(orgId: String!): [FeatureFlag!]!
    evaluateFlag(orgId: String!, key: String!, userId: String!): Boolean!
  }

  type Mutation {
    createOrganization(name: String!): Organization!
    createFeatureFlag(
      orgId: String!
      key: String!
      description: String
      enabled: Boolean
      rolloutPercentage: Int
    ): FeatureFlag!

    # NEW: Partial update support
    updateFeatureFlag(
      orgId: String!
      key: String!
      description: String
      enabled: Boolean
      rolloutPercentage: Int
    ): FeatureFlag!

    # NEW: Delete flag
    deleteFeatureFlag(
      orgId: String!
      key: String!
    ): Boolean!
  }
`;