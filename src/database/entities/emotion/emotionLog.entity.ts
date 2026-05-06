import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from "typeorm";

import { User } from "../user/user.entity";
import { Emotion } from "./emotion.entity";
import { SubEmotion } from "./subEmotion.entity";
import { EmotionCause } from "./emotionCause.entity";
import { EncryptionTransformerInstance } from "@/database/transformers/encryption.transformer";

@Entity("emotion_logs")
export class EmotionLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => Emotion)
  emotion!: Emotion;

  @ManyToMany(() => SubEmotion)
  @JoinTable({
    name: "emotion_log_sub_emotions",
  })
  subEmotions!: SubEmotion[];

  @ManyToMany(() => EmotionCause)
  @JoinTable({
    name: "emotion_log_causes",
  })
  causes!: EmotionCause[];

  @Column({
    type: "text",
    nullable: true,
    transformer: EncryptionTransformerInstance,
  })
  notes!: string | null;

  @Column({ type: "int", default: 0 })
  pointsEarned!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: "date" })
  loggedAt!: Date;
}
