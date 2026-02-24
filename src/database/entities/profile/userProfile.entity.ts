import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { User } from "@db/entities/user/user.entity";
import { AgeRange, Gender, ReminderPreference } from "./userProfile.enum";
import { EmotionalGoal } from "@db/entities/emotionalGoal/emotionalGoal.entity";
import { EmotionProcessingStyle } from "@db/entities/emotionProcessingStyle/emotionProcessingStyle.entity";

@Entity("user_profiles")
export class UserProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @Column({
    type: "enum",
    enum: AgeRange,
  })
  ageRange!: AgeRange;

  @Column({
    type: "enum",
    enum: Gender,
  })
  gender!: Gender;

  @Column({
    type: "enum",
    enum: ReminderPreference,
  })
  reminderPreference!: ReminderPreference;

  @ManyToMany(() => EmotionalGoal)
  @JoinTable()
  goals!: EmotionalGoal[];

  @ManyToMany(() => EmotionProcessingStyle)
  @JoinTable()
  processingStyles!: EmotionProcessingStyle[];
}
