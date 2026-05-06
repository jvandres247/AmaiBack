import { AppDataSource } from "@db/data-source";
import { User } from "@db/entities/user/user.entity";
import {
  registerUser,
  confirmUser,
  loginUser,
  refreshSession,
  logoutUser,
  forgotPassword,
  confirmForgotPassword,
} from "@modules/auth/cognito.service";
import { UserRole } from "@db/entities/user/user-role.enum";
import jwt from "jsonwebtoken";

export const userResolvers = {
  Query: {
    users: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const repo = AppDataSource.getRepository(User);
      return repo.find();
    },
  },

  Mutation: {
    register: async (_: any, { name, email, password }: any) => {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const existing = await queryRunner.manager.findOne(User, {
          where: { email },
        });

        if (existing) {
          throw new Error("User already exists");
        }

        await registerUser(email, password);

        const user = queryRunner.manager.create(User, {
          name,
          email,
          role: UserRole.USER,
          emailConfirmed: false,
        });

        await queryRunner.manager.save(user);

        await queryRunner.commitTransaction();
        return true;
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    },
    confirmEmail: async (_: any, { email, code }: any) => {
      await confirmUser(email, code);

      const repo = AppDataSource.getRepository(User);

      await repo.update({ email }, { emailConfirmed: true });

      return true;
    },
    login: async (_: any, { email, password }: any) => {
      const repo = AppDataSource.getRepository(User);

      const user = await repo.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }

      const tokens = await loginUser(email, password);

      const decoded: any = jwt.decode(tokens.idToken || "");

      if (!decoded.email_verified || !tokens) {
        throw new Error("Email not confirmed");
      }

      if (!user.cognitoSub) {
        await repo.update(
          { email },
          { emailConfirmed: true, cognitoSub: decoded.sub },
        );
        user.emailConfirmed = true;
      }

      return {
        ...tokens,
        user,
      };
    },
    refresh: async (_: any, { refreshToken }: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");
      return await refreshSession(context.user.cognitoSub, refreshToken);
    },
    logout: async (_: any, __: any, context: any) => {
      if (!context.user) throw new Error("Unauthorized");

      const token = context.req.headers.authorization.replace("Bearer ", "");
      return logoutUser(token);
    },
    forgotPassword: async (_: any, { email }: any) => {
      await forgotPassword(email);
      return true;
    },
    resetPassword: async (_: any, { email, code, newPassword }: any) => {
      await confirmForgotPassword(email, code, newPassword);
      return true;
    },
  },
};
