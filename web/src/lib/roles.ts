export const ROLES = [
  {
    id: "developer",
    title: "Desenvolvedor",
    blurb: "Daily, blocker, update no Slack e código.",
  },
  {
    id: "tech-lead",
    title: "Tech lead",
    blurb: "Alinhamento técnico, 1:1 e call com cliente.",
  },
  {
    id: "scrum-master",
    title: "Scrum Master",
    blurb: "Facilitar cerimônias, timebox e retro.",
  },
  {
    id: "product-owner",
    title: "Product Owner",
    blurb: "Prioridade, refinement e demo.",
  },
  {
    id: "manager",
    title: "Gestor",
    blurb: "1:1, feedback e apoio ao time.",
  },
] as const;

export type RoleId = (typeof ROLES)[number]["id"];

export const ALL_ROLES: RoleId[] = ROLES.map((role) => role.id);
