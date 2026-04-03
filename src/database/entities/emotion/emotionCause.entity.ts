import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Emotion } from "./emotion.entity";

@Entity("emotion_causes")
export class EmotionCause {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  icon!: string;

  @ManyToOne(() => Emotion, (emotion) => emotion.causes, {
    onDelete: "CASCADE",
  })
  emotion!: Emotion;
}
