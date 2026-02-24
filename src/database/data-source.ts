import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: process.env.NODE_ENV !== "production",
  dropSchema: process.env.NODE_ENV === "test",
  logging: true,

  entities: ["src/database/entities/**/*.entity.ts"],
  migrations: ["src/database/migrations/*.ts"],
});
