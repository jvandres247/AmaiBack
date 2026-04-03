import express from "express";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { buildContext } from "./context";

import { userTypeDefs } from "./schema/user.schema";
import { profileTypeDefs } from "./schema/profile.schema";
import { plantTypeDefs } from "./schema/plants.schema";
import { onboardingTypeDefs } from "./schema/onboarding.schema";
import { emotionTypeDefs } from "./schema/emotion.schema";

import { userResolvers } from "./resolvers/user.resolver";
import { profileResolvers } from "./resolvers/profile.resolver";
import { plantResolvers } from "./resolvers/plants.resolver";
import { onboardingResolvers } from "./resolvers/onboarding.resolver";
import { emotionResolvers } from "./resolvers/emotion.resolver";

export const createServer = async () => {
  const app = express();

  const apollo = new ApolloServer({
    typeDefs: [
      userTypeDefs,
      profileTypeDefs,
      plantTypeDefs,
      onboardingTypeDefs,
      emotionTypeDefs,
    ],
    resolvers: [
      userResolvers,
      profileResolvers,
      plantResolvers,
      onboardingResolvers,
      emotionResolvers,
    ],
    context: buildContext,
  });

  await apollo.start();
  apollo.applyMiddleware({ app, path: "/graphql" });

  const httpServer = http.createServer(app);

  return { app, httpServer, apollo };
};

export const startGraphQLServer = async () => {
  const { httpServer } = await createServer();

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve),
  );

  console.log("🚀 GraphQL ready at http://localhost:4000/graphql");
};
