import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "@db/entities/user/user.entity";
import { Plant } from "@db/entities/plants/plants.entity";

@Entity("user_plants")
export class UserPlant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => Plant)
  plant!: Plant;

  @Column()
  startedAt!: Date;

  @Column({ nullable: true })
  endedAt!: Date;

  @Column({ type: "int", default: 0 })
  progressPercentage!: number;
}
