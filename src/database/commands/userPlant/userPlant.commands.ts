import { AppDataSource } from "@/database/data-source";
import { UserPlant } from "@/database/entities/userPlant/userPlant.entity";
import { IsNull } from "typeorm";

export interface ActivePlantWithDetails {
  id: string;
  startedAt: Date;
  endedAt: Date | null;
  progressPoints: number;
  user: any;
  plant: any;
  currentStage?: any;
  progressPercentage: number;
  remainingPointsToNextStage: number;
  remainingPointsToGoal: number;
  isCompleted: boolean;
}

export const getPlantsByUser = async (
  userId: string,
  onlyActive?: boolean,
): Promise<ActivePlantWithDetails[]> => {
  const userPlantRepo = AppDataSource.getRepository(UserPlant);

  const whereCondition: any = {
    user: { id: userId },
  };

  if (onlyActive) {
    whereCondition.endedAt = IsNull();
  }

  const activePlants = await userPlantRepo.find({
    where: whereCondition,
    relations: ["user", "plant", "plant.stages", "plant.seasons"],
  });

  if (!activePlants || activePlants.length === 0) {
    return [];
  }

  return activePlants.map((activePlant) => {
    const sortedStages =
      activePlant.plant.stages?.sort(
        (a: any, b: any) => a.requiredPoints - b.requiredPoints,
      ) || [];

    let currentStage = null;
    let remainingPointsToNextStage = 0;

    if (sortedStages.length > 0) {
      let currentStageIndex = 0;

      for (let i = sortedStages.length - 1; i >= 0; i--) {
        if (activePlant.progressPoints >= sortedStages[i].requiredPoints) {
          currentStageIndex = i;
          break;
        }
      }

      currentStage = sortedStages[currentStageIndex];

      const nextStage = sortedStages[currentStageIndex + 1];
      if (nextStage) {
        remainingPointsToNextStage = Math.max(
          0,
          nextStage.requiredPoints - activePlant.progressPoints,
        );
      } else {
        remainingPointsToNextStage = 0;
      }
    }

    const progressPercentage = Math.min(
      (activePlant.progressPoints / 120) * 100,
      100,
    );

    const remainingPointsToGoal = Math.max(0, 120 - activePlant.progressPoints);
    const isCompleted = activePlant.progressPoints >= 120;

    return {
      id: activePlant.id,
      startedAt: activePlant.startedAt,
      endedAt: activePlant.endedAt,
      progressPoints: activePlant.progressPoints,
      user: activePlant.user,
      plant: activePlant.plant,
      currentStage,
      progressPercentage,
      remainingPointsToNextStage,
      remainingPointsToGoal,
      isCompleted,
    };
  });
};

export const updateUserPlantProgress = async (
  userId: string,
  pointsToAdd: number,
): Promise<UserPlant | null> => {
  const userPlantRepo = AppDataSource.getRepository(UserPlant);

  const activePlant = await userPlantRepo.findOne({
    where: {
      user: { id: userId },
      endedAt: IsNull(),
    },
    relations: ["user", "plant"],
  });

  if (!activePlant) {
    console.log(`Usuario ${userId} no tiene una planta activa`);
    return null;
  }

  const newProgress = Math.min(activePlant.progressPoints + pointsToAdd, 420);

  activePlant.progressPoints = newProgress;
  await userPlantRepo.save(activePlant);

  if (newProgress >= 120 && activePlant.progressPoints < 120) {
    console.log(`¡Usuario ${userId} alcanzó la meta trimestral de 120 puntos!`);
  }

  return activePlant;
};
