import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { AppDataSource } from "@db/data-source";
import { startGraphQLServer } from "@graphql/server";

const bootstrap = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");
    console.log("Running migrations...");
    await AppDataSource.runMigrations();
    console.log("Data Source has been initialized");

    await startGraphQLServer();
  } catch (error) {
    console.error("Startup error:", error);
  }
};

bootstrap();
