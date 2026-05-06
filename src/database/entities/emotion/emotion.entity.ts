import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SubEmotion } from "./subEmotion.entity";
import { EmotionCause } from "./emotionCause.entity";

@Entity("emotions")
export class Emotion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  icon!: string;

  @OneToMany(() => SubEmotion, (subEmotion) => subEmotion.emotion)
  subEmotions!: SubEmotion[];

  @OneToMany(() => EmotionCause, (cause) => cause.emotion)
  causes!: EmotionCause[];
}
