import { gql } from "graphql-tag";

export const plantTypeDefs = gql`
  type PlantStage {
    id: ID!
    imageUrl: String!
    requiredProgress: Int!
  }

  type PlantSeason {
    id: ID!
    startDate: String!
    endDate: String!
    isActive: Boolean!
  }

  type Plant {
    id: ID!
    name: String!
    represents: String!
    stages: [PlantStage!]!
    season: PlantSeason
  }

  extend type Query {
    activePlants: [Plant!]!
  }
`;
