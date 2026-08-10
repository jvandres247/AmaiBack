import { verifyToken } from "@/utils/verifyToken";
import { AppDataSource } from "@db/data-source";
import { User } from "@db/entities/user/user.entity";

export interface AuthenticatedIdentity {
  sub: string;
  email?: string;
  name?: string;
  emailVerified: boolean;
  provider: "COGNITO" | "GOOGLE";
}

export interface GraphQLContext {
  req: any;
  user: User | null;
  identity: AuthenticatedIdentity | null;
}

export const buildContext = async ({ req }: any): Promise<GraphQLContext> => {
  if (process.env.NODE_ENV === "test") {
    return {
      req,
      user: {
        id: "test-id",
        role: "ADMIN",
        email: "test@test.com",
      } as User,
      identity: {
        sub: "test-sub",
        email: "test@test.com",
        name: "Test User",
        emailVerified: true,
        provider: "COGNITO",
      },
    };
  }

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return {
      req,
      user: null,
      identity: null,
    };
  }

  try {
    const token = authHeader.slice("Bearer ".length).trim();
    const decoded = await verifyToken(token);

    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOne({
      where: {
        cognitoSub: decoded.sub,
      },
    });

    const identities = parseCognitoIdentities(decoded.identities);

    return {
      req,
      user,
      identity: {
        sub: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        emailVerified:
          decoded.email_verified === true || decoded.email_verified === "true",
        provider: identities.some(
          (identity) => identity.providerName === "Google",
        )
          ? "GOOGLE"
          : "COGNITO",
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);

    return {
      req,
      user: null,
      identity: null,
    };
  }
};

interface CognitoIdentity {
  userId?: string;
  providerName?: string;
  providerType?: string;
  issuer?: string | null;
  primary?: boolean;
  dateCreated?: string;
}

const parseCognitoIdentities = (identities: unknown): CognitoIdentity[] => {
  if (!identities) return [];

  if (Array.isArray(identities)) {
    return identities;
  }

  if (typeof identities !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(identities);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
