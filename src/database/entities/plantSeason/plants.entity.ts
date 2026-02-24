import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Plant } from "../plants/plants.entity";

@Entity("plant_seasons")
export class PlantSeason {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Plant)
  plant!: Plant;

  @Column({ type: "date" })
  startDate!: Date;

  @Column({ type: "date" })
  endDate!: Date;

  @Column({ default: true })
  isActive!: boolean;
}
