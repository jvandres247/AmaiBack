import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PlantStage } from "../plantStage/plantStage.entity";

@Entity("plants")
export class Plant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column()
  represents!: string;

  @OneToMany(() => PlantStage, (stage) => stage.plant)
  stages!: PlantStage[];
}
