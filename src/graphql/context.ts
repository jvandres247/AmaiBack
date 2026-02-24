import { verifyToken } from "@/utils/verifyToken";
import { AppDataSource } from "@db/data-source";
import { User } from "@db/entities/user/user.entity";

export const buildContext = async ({ req }: any) => {
  if (process.env.NODE_ENV === "test") {
    return {
      req,
      user: {
        id: "test-id",
        role: "ADMIN",
        email: "test@test.com",
      },
    };
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return { req, user: null };

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded: any = await verifyToken(token);

    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOne({
      where: { cognitoSub: decoded.sub },
    });

    if (!user) return { req, user: null };

    return { req, user };
  } catch {
    return { req, user: null };
  }
};
