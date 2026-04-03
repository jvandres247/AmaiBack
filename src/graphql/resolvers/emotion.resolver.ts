import { EmotionLog } from "@/database/entities/emotion/emotionLog.entity";
import { applyEmotionImpact } from "@/utils/applyEmotionImpact";
import { AppDataSource } from "@db/data-source";
import { Emotion } from "@db/entities/emotion/emotion.entity";

export const emotionResolvers = {
  Query: {
    emotions: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const repo = AppDataSource.getRepository(Emotion);

      const emotions = await repo
        .createQueryBuilder("emotion")
        .leftJoinAndSelect("emotion.subEmotions", "subEmotions")
        .leftJoinAndSelect("emotion.causes", "causes")
        .orderBy("emotion.name", "ASC")
        .getMany();

      return emotions;
    },
    emotionLogs: async (_: any, { startDate, endDate }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const repo = AppDataSource.getRepository(EmotionLog);

      const query = repo
        .createQueryBuilder("log")
        .leftJoinAndSelect("log.emotion", "emotion")
        .leftJoinAndSelect("log.subEmotions", "subEmotions")
        .leftJoinAndSelect("log.causes", "causes")
        .where("log.userId = :userId", { userId: context.user.id })
        .orderBy("log.createdAt", "DESC");

      if (startDate) {
        query.andWhere("log.createdAt >= :startDate", { startDate });
      }

      if (endDate) {
        query.andWhere("log.createdAt <= :endDate", { endDate });
      }

      return query.getMany();
    },
  },
  Mutation: {
    createEmotionLog: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const { emotionId, subEmotionIds = [], causeIds = [], notes } = input;

      const emotionRepo = AppDataSource.getRepository("emotions");
      const subEmotionRepo = AppDataSource.getRepository("sub_emotions");
      const causeRepo = AppDataSource.getRepository("emotion_causes");
      const logRepo = AppDataSource.getRepository("emotion_logs");
      const userRepo = AppDataSource.getRepository("users");

      const emotion = await emotionRepo.findOneBy({ id: emotionId });
      if (!emotion) throw new Error("Emotion not found");

      const user = await userRepo.findOneBy({ id: context.user.id });

      const subEmotions = subEmotionIds.length
        ? await subEmotionRepo.findByIds(subEmotionIds)
        : [];

      const causes = causeIds.length ? await causeRepo.findByIds(causeIds) : [];

      const log = logRepo.create({
        user,
        emotion,
        subEmotions,
        causes,
        notes,
      });

      await logRepo.save(log);

      await applyEmotionImpact(context.user.id, emotionId);

      return log;
    },
  },
};
