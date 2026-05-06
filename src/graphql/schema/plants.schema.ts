import { gql } from "graphql-tag";

export const plantTypeDefs = gql`
  type PlantStage {
    id: ID!
    imageUrl: String!
    requiredPoints: Int!
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
    seasons: [PlantSeason]
  }

  type ActivePlant {
    id: ID!
    startedAt: DateTime!
    endedAt: DateTime
    progressPoints: Int!
    plant: Plant!
    currentStage: PlantStage
    progressPercentage: Float!
    remainingPointsToNextStage: Int!
    remainingPointsToGoal: Int!
    isCompleted: Boolean!
  }

  extend type Query {
    activePlants: [Plant!]!
    userActivePlant: ActivePlant
    userPlantHistory: [ActivePlant]
  }

  # Scalars
  scalar DateTime
`;
