import { AppDataSource } from "@/database/data-source";
import { User } from "@/database/entities/user/user.entity";

export const getUserById = async (id: string): Promise<User | null> => {
  const userRepo = AppDataSource.getRepository(User);
  return await userRepo.findOneBy({ id });
};
