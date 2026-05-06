import { AppDataSource } from "@/database/data-source";
import { EmotionCause } from "@/database/entities/emotion/emotionCause.entity";
import { In } from "typeorm";

export const getCausesByIds = async (
  ids: string[],
): Promise<EmotionCause[]> => {
  if (!ids.length) return [];
  const causeRepo = AppDataSource.getRepository(EmotionCause);
  return await causeRepo.findBy({ id: In(ids) });
};
