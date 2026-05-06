import { gql } from "apollo-server";

export const userTypeDefs = gql`
  enum UserRole {
    USER
    ADMIN
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    emailConfirmed: Boolean!
    hasProfile: Boolean!
    createdAt: String!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): Boolean!
  }

  type Query {
    users: [User!]!
  }

  type AuthTokens {
    accessToken: String!
    idToken: String!
    refreshToken: String!
    user: User!
  }

  type RefreshTokens {
    accessToken: String!
    idToken: String!
  }

  extend type Mutation {
    confirmEmail(email: String!, code: String!): Boolean!
    login(email: String!, password: String!): AuthTokens!
  }

  extend type Mutation {
    refresh(refreshToken: String!): RefreshTokens!
    logout: Boolean!
  }

  extend type Mutation {
    forgotPassword(email: String!): Boolean
    resetPassword(email: String!, code: String!, newPassword: String!): Boolean
  }
`;
