import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Emotion } from "./emotion.entity";

@Entity("sub_emotions")
export class SubEmotion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  icon!: string;

  @ManyToOne(() => Emotion, (emotion) => emotion.subEmotions, {
    onDelete: "CASCADE",
  })
  emotion!: Emotion;
}
