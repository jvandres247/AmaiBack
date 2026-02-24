import { AppDataSource } from "@db/data-source";
import { User } from "@db/entities/user/user.entity";
import { UserProfile } from "@db/entities/profile/userProfile.entity";
import { Plant } from "@db/entities/plants/plants.entity";
import { UserPlant } from "@db/entities/userPlant/userPlant.entity";
import { EmotionalGoal } from "@db/entities/emotionalGoal/emotionalGoal.entity";
import { EmotionProcessingStyle } from "@db/entities/emotionProcessingStyle/emotionProcessingStyle.entity";
import { AgeRange } from "@/database/entities/profile/userProfile.enum";

export const profileResolvers = {
  Query: {},

  Mutation: {
    completeOnboarding: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const userRepo = queryRunner.manager.getRepository(User);
        const profileRepo = queryRunner.manager.getRepository(UserProfile);
        const plantRepo = queryRunner.manager.getRepository(Plant);
        const userPlantRepo = queryRunner.manager.getRepository(UserPlant);
        const goalRepo = queryRunner.manager.getRepository(EmotionalGoal);
        const styleRepo = queryRunner.manager.getRepository(
          EmotionProcessingStyle,
        );

        const user = await userRepo.findOne({
          where: { email: context.user.email },
        });

        if (!user) throw new Error("User not found");

        const existingProfile = await profileRepo.findOne({
          where: { user: { id: user.id } },
        });

        if (existingProfile) throw new Error("Onboarding already completed");

        const goals = await goalRepo.findByIds(input.goalIds);
        const styles = await styleRepo.findByIds(input.processingStyleIds);

        const ageRange = AgeRange[input.ageRange as keyof typeof AgeRange];
        const profile = profileRepo.create({
          user,
          ageRange,
          gender: input.gender,
          reminderPreference: input.reminderPreference,
          goals,
          processingStyles: styles,
        });

        await profileRepo.save(profile);

        const plant = await plantRepo.findOne({
          where: { id: input.plantId },
        });

        if (!plant) throw new Error("Plant not found");

        const userPlant = userPlantRepo.create({
          user,
          plant,
          startedAt: new Date(),
          progressPercentage: 0,
        });

        await userPlantRepo.save(userPlant);

        await queryRunner.commitTransaction();
        return true;
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    },
  },
};
