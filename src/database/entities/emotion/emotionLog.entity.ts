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

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
