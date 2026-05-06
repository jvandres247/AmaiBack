import { AppDataSource } from "@/database/data-source";
import { Emotion } from "@/database/entities/emotion/emotion.entity";
import { EmotionCause } from "@/database/entities/emotion/emotionCause.entity";
import { EmotionLog } from "@/database/entities/emotion/emotionLog.entity";
import { SubEmotion } from "@/database/entities/emotion/subEmotion.entity";
import { User } from "@/database/entities/user/user.entity";

export const createEmotionLogEntry = async (data: {
  user: User;
  emotion: Emotion;
  subEmotions: SubEmotion[];
  causes: EmotionCause[];
  notes: string;
  pointsEarned: number;
  loggedAt: Date;
}): Promise<EmotionLog> => {
  const logRepo = AppDataSource.getRepository(EmotionLog);

  const log = logRepo.create({
    user: data.user,
    emotion: data.emotion,
    subEmotions: data.subEmotions,
    causes: data.causes,
    notes: data.notes,
    pointsEarned: data.pointsEarned,
    loggedAt: data.loggedAt,
  });

  return await logRepo.save(log);
};

export const getEmotionLogById = async (
  id: string,
): Promise<EmotionLog | null> => {
  const logRepo = AppDataSource.getRepository(EmotionLog);
  return await logRepo.findOne({
    where: { id },
    relations: ["user", "emotion", "subEmotions", "causes"],
  });
};

export const updateEmotionLogEntry = async (
  logId: string,
  data: {
    emotion?: Emotion;
    subEmotions?: SubEmotion[];
    causes?: EmotionCause[];
    notes?: string;
  },
): Promise<EmotionLog> => {
  const logRepo = AppDataSource.getRepository(EmotionLog);

  const log = await logRepo.findOne({
    where: { id: logId },
    relations: ["emotion", "subEmotions", "causes"],
  });

  if (!log) throw new Error("Emotion log not found");

  if (data.emotion) log.emotion = data.emotion;
  if (data.subEmotions) log.subEmotions = data.subEmotions;
  if (data.causes) log.causes = data.causes;
  if (data.notes !== undefined) log.notes = data.notes;

  return await logRepo.save(log);
};

interface GetEmotionLogsFilters {
  userId: string;
  startDate?: Date;
  endDate?: Date;
  emotionIds?: string[];
  causeIds?: string[];
  searchNotes?: string;
}
export const getEmotionLogsByUser = async (
  filters: GetEmotionLogsFilters,
): Promise<EmotionLog[]> => {
  const repo = AppDataSource.getRepository(EmotionLog);

  const query = repo
    .createQueryBuilder("log")
    .leftJoinAndSelect("log.emotion", "emotion")
    .leftJoinAndSelect("log.subEmotions", "subEmotions")
    .leftJoinAndSelect("log.causes", "causes")
    .where("log.userId = :userId", { userId: filters.userId });

  if (filters.startDate) {
    query.andWhere("log.loggedAt >= :startDate", {
      startDate: filters.startDate,
    });
  }

  if (filters.endDate) {
    query.andWhere("log.loggedAt <= :endDate", { endDate: filters.endDate });
  }

  if (filters.emotionIds && filters.emotionIds.length > 0) {
    query.andWhere("emotion.id IN (:...emotionIds)", {
      emotionIds: filters.emotionIds,
    });
  }

  if (filters.causeIds && filters.causeIds.length > 0) {
    query.andWhere("causes.id IN (:...causeIds)", {
      causeIds: filters.causeIds,
    });
  }

  query.orderBy("log.loggedAt", "DESC");

  let logs = await query.getMany();

  if (filters.searchNotes && filters.searchNotes.trim()) {
    const searchTerm = filters.searchNotes.trim().toLowerCase();
    logs = logs.filter((log) => {
      if (!log.notes) return false;
      return log.notes.toLowerCase().includes(searchTerm);
    });
  }

  return logs;
};

export interface DeleteEmotionLogResult {
  success: boolean;
  message: string;
  deletedLog?: {
    id: string;
    loggedAt?: Date | null;
    emotionName?: string;
  };
}

export const deleteEmotionLogById = async (
  logId: string,
  userId: string,
): Promise<DeleteEmotionLogResult> => {
  const logRepo = AppDataSource.getRepository(EmotionLog);

  const log = await logRepo.findOne({
    where: {
      id: logId,
      user: { id: userId },
    },
    relations: ["user", "emotion"],
  });

  if (!log) {
    throw new Error("Emotion log not found or unauthorized");
  }

  const deletedLogInfo = {
    id: log.id,
    loggedAt: log.loggedAt,
    emotionName: log.emotion?.name,
  };

  await logRepo.remove(log);

  return {
    success: true,
    message: `Emotion log for ${deletedLogInfo.emotionName} deleted successfully`,
    deletedLog: deletedLogInfo,
  };
};
