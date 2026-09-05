import { EntitySchema } from "typeorm";

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
    createdAt: { name: "created_at", type: "timestamptz", createDate: true },
    updatedAt: { name: "updated_at", type: "timestamptz", updateDate: true },
  },
});
