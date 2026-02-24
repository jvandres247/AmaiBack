import { AppDataSource } from "@db/data-source";
import { EmotionalGoal } from "@db/entities/emotionalGoal/emotionalGoal.entity";
import { EmotionProcessingStyle } from "@db/entities/emotionProcessingStyle/emotionProcessingStyle.entity";

export const onboardingResolvers = {
  Query: {
    emotionalGoals: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      return AppDataSource.getRepository(EmotionalGoal).find({
        order: { title: "ASC" },
      });
    },

    emotionProcessingStyles: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      return AppDataSource.getRepository(EmotionProcessingStyle).find({
        order: { title: "ASC" },
      });
    },
  },
};
