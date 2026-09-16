import { EntitySchema } from "typeorm";
import type { ProjectSetup } from "../projects";

export type UserRow = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  roles: string[];
  voiceRate: string;
  xp: number;
  scores: Record<string, number>;
  lastUnit: string | null;
  lastMode: string | null;
  completedAt: Record<string, string>;
  passwordHash: string | null;
  currentProject: number;
  projectSetups: ProjectSetup[];
  createdAt: Date;
  updatedAt: Date;
};

export const User = new EntitySchema<UserRow>({
  name: "User",
  tableName: "users",
  columns: {
    id: { type: "text", primary: true },
    email: { type: "text", unique: true },
    name: { type: "text", nullable: true },
    image: { type: "text", nullable: true },
    roles: { type: "text", array: true },
    voiceRate: { name: "voice_rate", type: "text" },
    xp: { type: "int" },
    scores: { type: "jsonb" },
    lastUnit: { name: "last_unit", type: "text", nullable: true },
    lastMode: { name: "last_mode", type: "text", nullable: true },
    completedAt: { name: "completed_at", type: "jsonb" },
    passwordHash: { name: "password_hash", type: "text", nullable: true },
    currentProject: { name: "current_project", type: "int", default: 1 },
    projectSetups: { name: "project_setups", type: "jsonb", default: [] },
    createdAt: { name: "created_at", type: "timestamptz", createDate: true },
    updatedAt: { name: "updated_at", type: "timestamptz", updateDate: true },
  },
});
