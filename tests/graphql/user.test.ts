import request from "supertest";
import { createServer } from "@graphql/server";
import { AppDataSource } from "@db/data-source";

let app: any;
let apollo: any;

beforeAll(async () => {
  await AppDataSource.initialize();

  const srv = await createServer();
  app = srv.app;
  apollo = srv.apollo;
});

afterAll(async () => {
  await AppDataSource.destroy();
  await apollo.stop();
});
