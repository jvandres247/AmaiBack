import {
  getAllEmotions,
  getEmotionById,
} from "@/database/commands/emotion/emotion.commands";
import { getCausesByIds } from "@/database/commands/emotion/emotionCause.commands";
import {
  createEmotionLogEntry,
  deleteEmotionLogById,
  getEmotionLogById,
  getEmotionLogsByUser,
  updateEmotionLogEntry,
} from "@/database/commands/emotion/emotionLog.commands";
import { getSubEmotionsByIds } from "@/database/commands/emotion/subEmotion.commands";
import { getUserById } from "@/database/commands/user/user.commands";
import { updateUserPlantProgress } from "@/database/commands/userPlant/userPlant.commands";
import { calculateEmotionLogPoints } from "@/utils/calculateEmotionLogPoints";

export const emotionResolvers = {
  Query: {
    emotions: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const emotions = await getAllEmotions();

      return emotions;
    },
    emotionLogs: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const { startDate, endDate, emotionIds, causeIds, searchNotes } = input;

      const logs = await getEmotionLogsByUser({
        userId: context.user.id,
        startDate,
        endDate,
        emotionIds,
        causeIds,
        searchNotes,
      });

      return logs;
    },
  },
  Mutation: {
    createEmotionLog: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const {
        emotionId,
        subEmotionIds = [],
        causeIds = [],
        notes,
        loggedAt,
      } = input;

      let validatedLoggedAt: Date | null = null;
      const providedDate = new Date(loggedAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!providedDate)
        throw new Error("Cannot log emotions for invalid dates");

      if (providedDate > today) {
        throw new Error("Cannot log emotions for future dates");
      }
      validatedLoggedAt = providedDate;

      const emotion = await getEmotionById(emotionId);
      if (!emotion) throw new Error("Emotion not found");

      const user = await getUserById(context.user.id);
      if (!user) throw new Error("User not found");

      const subEmotions = await getSubEmotionsByIds(subEmotionIds);
      const causes = await getCausesByIds(causeIds);

      const hasSubEmotions = subEmotions.length > 0;
      const hasCauses = causes.length > 0;
      const hasNotes = !!notes && notes.trim().length > 0;

      const pointsEarned = calculateEmotionLogPoints(
        hasSubEmotions,
        hasCauses,
        hasNotes,
      );

      await updateUserPlantProgress(context.user.id, pointsEarned);

      const log = await createEmotionLogEntry({
        user,
        emotion,
        subEmotions,
        causes,
        notes,
        pointsEarned,
        loggedAt: validatedLoggedAt,
      });

      return log;
    },
    updateEmotionLog: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const {
        logId,
        emotionId,
        subEmotionIds = [],
        causeIds = [],
        notes,
        loggedAt,
      } = input;

      let validatedLoggedAt: Date | null = null;
      const providedDate = new Date(loggedAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!providedDate)
        throw new Error("Cannot log emotions for invalid dates");

      if (providedDate > today) {
        throw new Error("Cannot log emotions for future dates");
      }
      validatedLoggedAt = providedDate;

      const existingLog = await getEmotionLogById(logId);
      if (!existingLog) throw new Error("Emotion log not found");
      if (existingLog.user.id !== context.user.id)
        throw new Error("Unauthorized");

      let emotion = existingLog.emotion;

      if (emotionId) {
        let newEmotion = await getEmotionById(emotionId);
        if (!newEmotion) throw new Error("Emotion not found");

        emotion = newEmotion;
      }

      let subEmotions = existingLog.subEmotions;
      if (subEmotionIds.length > 0) {
        subEmotions = await getSubEmotionsByIds(subEmotionIds);
      }

      let causes = existingLog.causes;
      if (causeIds.length > 0) {
        causes = await getCausesByIds(causeIds);
      }

      const updatedLog = await updateEmotionLogEntry(logId, {
        emotion,
        subEmotions,
        causes,
        notes: notes !== undefined ? notes : existingLog.notes,
      });

      return updatedLog;
    },
    deleteEmotionLog: async (_: any, { logId }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const result = await deleteEmotionLogById(logId, context.user.id);

      return result;
    },
  },
};
