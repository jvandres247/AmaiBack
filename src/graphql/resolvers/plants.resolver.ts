import { AppDataSource } from "@db/data-source";
import { PlantSeason } from "@db/entities/plantSeason/plants.entity";

export const plantResolvers = {
  Query: {
    activePlants: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      const repo = AppDataSource.getRepository(PlantSeason);

      const seasons = await repo
        .createQueryBuilder("season")
        .leftJoinAndSelect("season.plant", "plant")
        .leftJoinAndSelect("plant.stages", "stages")
        .where("season.isActive = true")
        .andWhere("CURRENT_DATE BETWEEN season.startDate AND season.endDate")
        .orderBy("stages.requiredProgress", "ASC")
        .getMany();

      return seasons.map((season) => ({
        ...season.plant,
        stages: season.plant.stages.sort(
          (a, b) => a.requiredProgress - b.requiredProgress,
        ),
        season: season,
      }));
    },
  },
};
