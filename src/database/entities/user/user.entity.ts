import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

import { UserRole } from "./user-role.enum";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, nullable: true })
  cognitoSub?: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ default: false })
  emailConfirmed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
