import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryColumn({ type: "text" })
  id!: string;

  @Column({ type: "text", unique: true })
  email!: string;

  @Column({ type: "text", nullable: true })
  name!: string | null;

  @Column({ type: "text", nullable: true })
  image!: string | null;

  @Column({ type: "text", array: true, default: {} })
  roles!: string[];

  @Column({ name: "voice_rate", type: "text", default: "very-slow" })
  voiceRate!: string;

  @Column({ type: "int", default: 0 })
  xp!: number;

  @Column({ type: "jsonb", default: {} })
  scores!: Record<string, number>;

  @Column({ name: "last_unit", type: "text", nullable: true })
  lastUnit!: string | null;

  @Column({ name: "last_mode", type: "text", nullable: true })
  lastMode!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
