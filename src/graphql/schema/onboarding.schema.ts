import { gql } from "graphql-tag";

export const onboardingTypeDefs = gql`
  type EmotionalGoal {
    id: ID!
    title: String!
  }

  type EmotionProcessingStyle {
    id: ID!
    title: String!
  }

  extend type Query {
    emotionalGoals: [EmotionalGoal!]!
    emotionProcessingStyles: [EmotionProcessingStyle!]!
  }
`;
