import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";

import { UserRole } from "./user-role.enum";
import { EmotionLog } from "../emotion/emotionLog.entity";
import { EncryptionTransformerInstance } from "@/database/transformers/encryption.transformer";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, nullable: true })
  cognitoSub?: string;

  @Column({ unique: true, transformer: EncryptionTransformerInstance })
  email!: string;

  @Column({ transformer: EncryptionTransformerInstance })
  name!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ default: false })
  emailConfirmed!: boolean;

  @Column({ default: false })
  hasProfile!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => EmotionLog, (log) => log.user)
  emotionLogs!: EmotionLog[];
}
