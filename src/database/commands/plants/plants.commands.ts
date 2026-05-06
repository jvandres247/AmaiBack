import { Plant } from "@/database/entities/plants/plants.entity";
import { AppDataSource } from "@db/data-source";

interface ActivePlantResult {
  stages: any[];
  seasons: any[];
  [key: string]: any;
}

export const getActivePlants = async (): Promise<ActivePlantResult[]> => {
  const repo = AppDataSource.getRepository(Plant);

  const plants = await repo
    .createQueryBuilder("plant")
    .leftJoinAndSelect("plant.stages", "stages")
    .leftJoinAndSelect("plant.seasons", "seasons")
    .where("seasons.isActive = :isActive", { isActive: true })
    .andWhere("CURRENT_DATE BETWEEN seasons.startDate AND seasons.endDate")
    .orderBy("stages.requiredPoints", "ASC")
    .getMany();

  return plants
    .filter((plant) => plant.seasons && plant.seasons.length > 0)
    .map((plant) => ({
      ...plant,
      stages: plant.stages.sort((a, b) => a.requiredPoints - b.requiredPoints),
      seasons: plant.seasons,
    }));
};
