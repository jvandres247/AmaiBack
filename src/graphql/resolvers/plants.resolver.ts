import { getActivePlants } from "@/database/commands/plants/plants.commands";
import { getPlantsByUser } from "@/database/commands/userPlant/userPlant.commands";

export const plantResolvers = {
  Query: {
    activePlants: async (_: any, { input }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const activePlants = await getActivePlants();

      return activePlants;
    },
    userActivePlant: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const activePlant = await getPlantsByUser(context.user.id, true);

      if (!activePlant) {
        return null;
      }

      return activePlant[0];
    },
    userPlantHistory: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const activePlant = await getPlantsByUser(context.user.id);

      if (!activePlant) {
        return null;
      }

      return activePlant;
    },
  },
};
