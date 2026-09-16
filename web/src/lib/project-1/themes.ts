import type { RoleId } from "../roles";
import type { SpeakItem, WriteItem } from "../work-units";

export type SprintTheme = {
  sprint: number;
  label: string;
  feature: string;
  story: string;
  demo: string;
  next: string;
  blocker: string;
  well: string;
  improve: string;
  action: string;
};

export const JOIN_ROLES: RoleId[] = ["developer", "product-owner", "manager"];
export const LEAD_ROLES: RoleId[] = ["tech-lead", "scrum-master"];
export const PLANNING_ROLES: RoleId[] = ["developer", "tech-lead", "scrum-master", "product-owner"];
export const REVIEW_ROLES: RoleId[] = ["tech-lead", "product-owner", "developer"];
export const RETRO_ROLES: RoleId[] = ["developer", "tech-lead", "scrum-master", "product-owner", "manager"];
export const REFINEMENT_ROLES: RoleId[] = ["developer", "tech-lead", "product-owner", "scrum-master"];
export const ONE_ON_ONE_ROLES: RoleId[] = ["tech-lead", "manager"];
export const CLIENT_ROLES: RoleId[] = ["tech-lead", "product-owner", "manager"];
export const SLACK_ROLES: RoleId[] = ["developer", "tech-lead"];

export const SPRINT_THEMES: SprintTheme[] = [
  {
    sprint: 1,
    label: "Login e API",
    feature: "login",
    story: "login story",
    demo: "the new login",
    next: "dashboard",
    blocker: "review",
    well: "communication",
    improve: "too many meetings",
    action: "update Jira",
  },
  {
    sprint: 2,
    label: "Dashboard",
    feature: "dashboard",
    story: "dashboard story",
    demo: "the new dashboard",
    next: "search",
    blocker: "design",
    well: "pairing",
    improve: "unclear tickets",
    action: "write better tickets",
  },
  {
    sprint: 3,
    label: "Busca",
    feature: "search",
    story: "search story",
    demo: "the search results",
    next: "notifications",
    blocker: "index",
    well: "focus",
    improve: "context switching",
    action: "protect focus time",
  },
  {
    sprint: 4,
    label: "Notificações",
    feature: "notifications",
    story: "notifications story",
    demo: "the notifications",
    next: "payments",
    blocker: "email provider",
    well: "testing",
    improve: "late reviews",
    action: "review PRs in the morning",
  },
  {
    sprint: 5,
    label: "Pagamentos",
    feature: "payments",
    story: "payments story",
    demo: "the checkout flow",
    next: "onboarding",
    blocker: "fraud check",
    well: "incident response",
    improve: "missing alerts",
    action: "add a monitoring checklist",
  },
  {
    sprint: 6,
    label: "Onboarding",
    feature: "onboarding",
    story: "onboarding story",
    demo: "the new onboarding",
    next: "reports",
    blocker: "copy",
    well: "collaboration with design",
    improve: "scope creep",
    action: "cut one extra request",
  },
  {
    sprint: 7,
    label: "Relatórios",
    feature: "reports",
    story: "reports story",
    demo: "the weekly report",
    next: "settings",
    blocker: "data warehouse",
    well: "documentation",
    improve: "slow feedback",
    action: "schedule a weekly demo",
  },
  {
    sprint: 8,
    label: "Configurações",
    feature: "settings",
    story: "settings story",
    demo: "the account settings",
    next: "integrations",
    blocker: "permissions",
    well: "small pull requests",
    improve: "big branches",
    action: "split work earlier",
  },
  {
    sprint: 9,
    label: "Integrações",
    feature: "integrations",
    story: "integrations story",
    demo: "the new integration",
    next: "performance",
    blocker: "partner API",
    well: "clear ownership",
    improve: "handoffs",
    action: "write the handoff notes",
  },
  {
    sprint: 10,
    label: "Performance",
    feature: "performance",
    story: "performance story",
    demo: "the faster load time",
    next: "the next project",
    blocker: "profiling data",
    well: "shipping steadily",
    improve: "last-minute changes",
    action: "freeze scope two days before review",
  },
];

export function writeItem(prompt: string, hint: string, answers: string[], tip: string): WriteItem {
  return { prompt, hint, answers, tip };
}

export function speak(en: string, pt: string, when?: string): SpeakItem {
  return when ? { en, pt, when } : { en, pt };
}
