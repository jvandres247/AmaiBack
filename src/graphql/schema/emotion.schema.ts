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
    pointsEarned: Int
    loggedAt: String!
    createdAt: String!
  }

  input CreateEmotionLogInput {
    emotionId: ID!
    subEmotionIds: [ID!]
    causeIds: [ID!]
    notes: String
    loggedAt: String!
  }

  input UpdateEmotionLogInput {
    logId: String!
    emotionId: String
    subEmotionIds: [String!]
    causeIds: [String!]
    notes: String
    loggedAt: String!
  }

  input DeleteEmotionLogInput {
    logId: String!
  }

  type DeleteEmotionLogResponse {
    success: Boolean!
    message: String!
    deletedLog: DeletedLogInfo
  }

  type DeletedLogInfo {
    id: ID!
    loggedAt: DateTime
    emotionName: String
  }

  input EmotionLogsFilters {
    startDate: String
    endDate: String
    emotionIds: [String]
    causeIds: [String]
    searchNotes: String
  }

  extend type Query {
    emotions: [Emotion!]!
    emotionLogs(input: EmotionLogsFilters!): [EmotionLog!]!
  }

  extend type Mutation {
    createEmotionLog(input: CreateEmotionLogInput!): EmotionLog!
    updateEmotionLog(input: UpdateEmotionLogInput!): EmotionLog!
    deleteEmotionLog(input: DeleteEmotionLogInput!): DeleteEmotionLogResponse!
  }
`;
