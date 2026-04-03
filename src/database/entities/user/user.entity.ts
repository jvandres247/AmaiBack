import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

import { UserRole } from "./user-role.enum";
import { EmotionLog } from "../emotion/emotionLog.entity";

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

  @OneToMany(() => EmotionLog, (log) => log.user)
  emotionLogs!: EmotionLog[];
}
