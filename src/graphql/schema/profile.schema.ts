import { gql } from "apollo-server";

export const profileTypeDefs = gql`
  enum AgeRange {
    OVER_18
    FROM_18_TO_24
    FROM_25_TO_34
    FROM_35_TO_44
    FROM_45_TO_54
    FROM_55_TO_64
    OVER_65
  }

  enum Gender {
    FEMALE
    MALE
    NON_BINARY
    PREFER_NOT_TO_SAY
  }

  enum ReminderPreference {
    DAILY
    WHEN_NEEDED
    NONE
  }

  input CompleteOnboardingInput {
    ageRange: AgeRange!
    gender: Gender!
    reminderPreference: ReminderPreference!
    goalIds: [ID!]!
    processingStyleIds: [ID!]!
    plantId: ID!
  }

  type Mutation {
    completeOnboarding(input: CompleteOnboardingInput!): Boolean!
  }
`;
