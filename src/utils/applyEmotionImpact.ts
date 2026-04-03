import { AppDataSource } from "@/database/data-source";
import { Emotion } from "@/database/entities/emotion/emotion.entity";
import { UserPlant } from "@/database/entities/userPlant/userPlant.entity";
import { IsNull } from "typeorm";

export const applyEmotionImpact = async (userId: string, emotionId: string) => {
  const emotionRepo = AppDataSource.getRepository(Emotion);
  const userPlantRepo = AppDataSource.getRepository(UserPlant);

  const emotion = await emotionRepo.findOneBy({ id: emotionId });

  if (!emotion) return;

  const userPlant = await userPlantRepo.findOne({
    where: { user: { id: userId }, endedAt: IsNull() },
  });

  if (!userPlant) return;

  let newProgress = userPlant.progressPercentage + emotion.impact;

  if (newProgress < 0) newProgress = 0;
  if (newProgress > 100) newProgress = 100;

  userPlant.progressPercentage = newProgress;

  await userPlantRepo.save(userPlant);
};
