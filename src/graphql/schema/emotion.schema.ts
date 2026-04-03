import { gql } from "graphql-tag";

export const emotionTypeDefs = gql`
  type Emotion {
    id: ID!
    name: String!
    icon: String!
    subEmotions: [SubEmotion!]!
    causes: [EmotionCause!]!
  }

  type SubEmotion {
    id: ID!
    name: String!
    icon: String!
  }

  type EmotionCause {
    id: ID!
    name: String!
    icon: String!
  }

  type EmotionLog {
    id: ID!
    emotion: Emotion!
    subEmotions: [SubEmotion!]
    causes: [EmotionCause!]
    notes: String
    createdAt: String!
  }

  input CreateEmotionLogInput {
    emotionId: ID!
    subEmotionIds: [ID!]
    causeIds: [ID!]
    notes: String
  }

  extend type Query {
    emotions: [Emotion!]!
    emotionLogs(startDate: String, endDate: String): [EmotionLog!]!
  }

  extend type Mutation {
    createEmotionLog(input: CreateEmotionLogInput!): EmotionLog!
  }
`;
