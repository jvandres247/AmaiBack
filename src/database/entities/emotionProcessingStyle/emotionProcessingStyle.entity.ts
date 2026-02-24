import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("emotion_processing_styles")
export class EmotionProcessingStyle {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  title!: string;
}
