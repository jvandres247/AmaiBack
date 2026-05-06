import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Plant } from "../plants/plants.entity";

@Entity("plant_stages")
export class PlantStage {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  imageUrl!: string;

  @Column()
  requiredPoints!: number;

  @ManyToOne(() => Plant, (plant) => plant.stages, {
    onDelete: "CASCADE",
  })
  plant!: Plant;
}
