import { AppDataSource } from "@/database/data-source";
import { Emotion } from "@/database/entities/emotion/emotion.entity";

export const getEmotionById = async (id: string): Promise<Emotion | null> => {
  const emotionRepo = AppDataSource.getRepository(Emotion);
  return await emotionRepo.findOneBy({ id });
};

export const getAllEmotions = async (): Promise<Emotion[]> => {
  const repo = AppDataSource.getRepository(Emotion);

  const emotions = await repo
    .createQueryBuilder("emotion")
    .leftJoinAndSelect("emotion.subEmotions", "subEmotions")
    .leftJoinAndSelect("emotion.causes", "causes")
    .orderBy("emotion.name", "ASC")
    .getMany();

  return emotions;
};
