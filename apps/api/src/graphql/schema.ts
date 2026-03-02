// apps/api/src/graphql/schema.ts


export const typeDefs = `
  type Organization {
    id: ID!
    name: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    organizations: [Organization!]!
  }

  type Mutation {
    createOrganization(name: String!): Organization!
  }
`;