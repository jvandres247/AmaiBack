import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("emotional_goals")
export class EmotionalGoal {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  title!: string;
}
