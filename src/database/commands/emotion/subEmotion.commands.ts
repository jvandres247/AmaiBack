import { AppDataSource } from "@/database/data-source";
import { SubEmotion } from "@/database/entities/emotion/subEmotion.entity";
import { In } from "typeorm";

export const getSubEmotionsByIds = async (
  ids: string[],
): Promise<SubEmotion[]> => {
  if (!ids.length) return [];
  const subEmotionRepo = AppDataSource.getRepository(SubEmotion);
  return await subEmotionRepo.findBy({ id: In(ids) });
};
