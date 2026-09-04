import type { RoleId } from "./roles";

export type SpeakItem = { en: string; pt: string; when?: string };
export type WriteItem = { prompt: string; hint: string; answers: string[]; tip: string };

export type Unit = {
  id: string;
  title: string;
  blurb: string;
  track: "work" | "fundamentals";
  scene: string;
  roles: RoleId[];
  speak: SpeakItem[];
  write: WriteItem[];
};

export const workUnits: Unit[] = [
  {
    id: "daily-dev",
    title: "Daily (participar)",
    blurb: "Yesterday, today e blockers.",
    track: "work",
    scene: "daily",
    roles: ["developer"],
    speak: [
      { en: "Yesterday I finished the API.", pt: "Ontem eu terminei a API.", when: "O que você fez ontem." },
      { en: "Today I will work on the tests.", pt: "Hoje vou trabalhar nos testes." },
      { en: "I have no blockers.", pt: "Não tenho impedimentos." },
      { en: "I am blocked by the review.", pt: "Estou bloqueado pela review." },
      { en: "I need help with the database.", pt: "Preciso de ajuda com o banco." },
      { en: "I will be done today.", pt: "Vou terminar isso hoje." },
    ],
    write: [
      {
        prompt: "Na daily, diga que ontem você terminou a API.",
        hint: "Yesterday I finished ...",
        answers: ["yesterday i finished the api", "yesterday i finished the api."],
        tip: "Yesterday = ontem. Finished = terminei.",
      },
      {
        prompt: "Diga que hoje você vai trabalhar nos testes.",
        hint: "Today I will work on ...",
        answers: ["today i will work on the tests", "today i'll work on the tests"],
        tip: "Today = hoje. Will = vou / futuro.",
      },
      {
        prompt: "Diga que você não tem impedimentos.",
        hint: "I have no ...",
        answers: ["i have no blockers", "i don't have any blockers", "no blockers"],
        tip: "Blockers = impedimentos. Muito usado na daily.",
      },
      {
        prompt: "Peça ajuda com o banco.",
        hint: "I need help with ...",
        answers: ["i need help with the database", "i need help with the db"],
        tip: "Need help with = preciso de ajuda com.",
      },
    ],
  },
  {
    id: "daily-facilitate",
    title: "Daily (facilitar)",
    blurb: "Abrir a daily, round e blockers.",
    track: "work",
    scene: "daily",
    roles: ["tech-lead", "scrum-master"],
    speak: [
      { en: "Let's start the daily.", pt: "Vamos começar a daily." },
      { en: "Let's go around.", pt: "Vamos passar um por um." },
      { en: "Any blockers?", pt: "Algum impedimento?" },
      { en: "Please keep it short.", pt: "Por favor, seja breve." },
      { en: "We can take this offline.", pt: "Podemos falar isso depois da daily." },
      { en: "Thanks everyone.", pt: "Obrigado a todos." },
    ],
    write: [
      {
        prompt: "Abra a daily.",
        hint: "Let's start ...",
        answers: ["let's start the daily", "lets start the daily", "let us start the daily"],
        tip: "Let's start = vamos começar.",
      },
      {
        prompt: "Pergunte se há impedimentos.",
        hint: "Any blockers?",
        answers: ["any blockers", "are there any blockers", "any blockers?"],
        tip: "Any blockers? é a pergunta clássica da daily.",
      },
      {
        prompt: "Peça para ser breve.",
        hint: "Please keep it ...",
        answers: ["please keep it short", "please keep it brief"],
        tip: "Keep it short = seja breve. Bom para timebox.",
      },
      {
        prompt: "Diga que isso pode ficar para depois da daily.",
        hint: "We can take this ...",
        answers: ["we can take this offline", "let's take this offline"],
        tip: "Take it offline = não resolver agora na cerimônia.",
      },
    ],
  },
  {
    id: "planning",
    title: "Sprint planning",
    blurb: "Capacidade, história e compromisso.",
    track: "work",
    scene: "planning",
    roles: ["developer", "tech-lead", "scrum-master", "product-owner"],
    speak: [
      { en: "What is the goal of this sprint?", pt: "Qual é o objetivo desta sprint?" },
      { en: "This story is too big.", pt: "Essa história está grande demais." },
      { en: "We can split this story.", pt: "Podemos quebrar essa história." },
      { en: "I can take this task.", pt: "Eu posso ficar com essa tarefa." },
      { en: "What is the definition of done?", pt: "Qual é a definition of done?" },
      { en: "This is our sprint goal.", pt: "Este é o objetivo da sprint." },
    ],
    write: [
      {
        prompt: "Pergunte o objetivo da sprint.",
        hint: "What is the goal ...",
        answers: ["what is the goal of this sprint", "what's the sprint goal"],
        tip: "Sprint goal = objetivo da sprint.",
      },
      {
        prompt: "Diga que a história está grande demais.",
        hint: "This story is too ...",
        answers: ["this story is too big", "this user story is too big"],
        tip: "Story = história. Too big = grande demais.",
      },
      {
        prompt: "Ofereça-se para pegar a tarefa.",
        hint: "I can take ...",
        answers: ["i can take this task", "i can take this one"],
        tip: "Take this task = ficar com essa tarefa.",
      },
      {
        prompt: "Pergunte a definition of done.",
        hint: "What is the definition ...",
        answers: ["what is the definition of done", "what's the definition of done"],
        tip: "Definition of done = critério para considerar pronto.",
      },
    ],
  },
  {
    id: "refinement",
    title: "Refinement",
    blurb: "Dúvida, critério de aceite e estimativa.",
    track: "work",
    scene: "refinement",
    roles: ["developer", "tech-lead", "product-owner", "scrum-master"],
    speak: [
      { en: "Can you clarify the acceptance criteria?", pt: "Pode esclarecer os critérios de aceite?" },
      { en: "Who is the user?", pt: "Quem é o usuário?" },
      { en: "What happens if this fails?", pt: "O que acontece se isso falhar?" },
      { en: "I need more details.", pt: "Preciso de mais detalhes." },
      { en: "This depends on another team.", pt: "Isso depende de outro time." },
      { en: "I estimate this as five points.", pt: "Eu estimo isso em cinco pontos." },
    ],
    write: [
      {
        prompt: "Peça para esclarecer os critérios de aceite.",
        hint: "Can you clarify ...",
        answers: ["can you clarify the acceptance criteria", "could you clarify the acceptance criteria"],
        tip: "Acceptance criteria = critérios de aceite.",
      },
      {
        prompt: "Diga que precisa de mais detalhes.",
        hint: "I need more ...",
        answers: ["i need more details", "i need more information"],
        tip: "Details = detalhes. Information = informação.",
      },
      {
        prompt: "Diga que isso depende de outro time.",
        hint: "This depends on ...",
        answers: ["this depends on another team", "this depends on a different team"],
        tip: "Depends on = depende de.",
      },
      {
        prompt: "Estime a história em cinco pontos.",
        hint: "I estimate this as ...",
        answers: ["i estimate this as five points", "i estimate five points"],
        tip: "Estimate = estimar. Points = pontos da história.",
      },
    ],
  },
  {
    id: "review-client",
    title: "Review / demo",
    blurb: "Mostrar o que foi entregue ao cliente.",
    track: "work",
    scene: "review",
    roles: ["tech-lead", "product-owner", "developer"],
    speak: [
      { en: "Welcome, everyone.", pt: "Bem-vindos, pessoal." },
      { en: "Today I will show the new login.", pt: "Hoje vou mostrar o novo login." },
      { en: "We delivered this feature.", pt: "Nós entregamos esta funcionalidade." },
      { en: "The next step is the dashboard.", pt: "O próximo passo é o dashboard." },
      { en: "Do you have any questions?", pt: "Vocês têm alguma pergunta?" },
      { en: "Thank you for your feedback.", pt: "Obrigado pelo seu feedback." },
    ],
    write: [
      {
        prompt: "Diga que hoje você vai mostrar o novo login.",
        hint: "Today I will show ...",
        answers: ["today i will show the new login", "today i'll show the new login"],
        tip: "Show = mostrar. New = novo.",
      },
      {
        prompt: "Diga que vocês entregaram esta funcionalidade.",
        hint: "We delivered ...",
        answers: ["we delivered this feature", "we delivered this functionality"],
        tip: "Delivered = entregamos. Feature = funcionalidade.",
      },
      {
        prompt: "Diga que o próximo passo é o dashboard.",
        hint: "The next step is ...",
        answers: ["the next step is the dashboard", "next step is the dashboard"],
        tip: "Next step = próximo passo.",
      },
      {
        prompt: "Pergunte se há dúvidas.",
        hint: "Do you have any ...",
        answers: ["do you have any questions", "any questions"],
        tip: "Any questions? = alguma pergunta?",
      },
    ],
  },
  {
    id: "retro",
    title: "Retrospectiva",
    blurb: "O que foi bem, o que melhorar, ação.",
    track: "work",
    scene: "retro",
    roles: ["developer", "tech-lead", "scrum-master", "product-owner", "manager"],
    speak: [
      { en: "What went well?", pt: "O que foi bem?" },
      { en: "What can we improve?", pt: "O que podemos melhorar?" },
      { en: "I liked the communication this sprint.", pt: "Gostei da comunicação nesta sprint." },
      { en: "We had too many meetings.", pt: "Tivemos reuniões demais." },
      { en: "Let's pick one action item.", pt: "Vamos escolher uma ação." },
      { en: "I will own this action.", pt: "Eu fico responsável por esta ação." },
    ],
    write: [
      {
        prompt: "Pergunte o que foi bem.",
        hint: "What went ...",
        answers: ["what went well", "what went well?"],
        tip: "Went well = foi bem.",
      },
      {
        prompt: "Pergunte o que podem melhorar.",
        hint: "What can we ...",
        answers: ["what can we improve", "what can we do better"],
        tip: "Improve = melhorar.",
      },
      {
        prompt: "Proponha escolher uma ação.",
        hint: "Let's pick one ...",
        answers: ["let's pick one action item", "lets pick one action item", "let's choose one action"],
        tip: "Action item = ação da retro.",
      },
      {
        prompt: "Assuma a ação.",
        hint: "I will own ...",
        answers: ["i will own this action", "i'll own this action", "i will take this action"],
        tip: "Own this action = ficar responsável.",
      },
    ],
  },
  {
    id: "one-on-one",
    title: "1:1",
    blurb: "Como está, apoio e próximo passo.",
    track: "work",
    scene: "oneOnOne",
    roles: ["tech-lead", "manager"],
    speak: [
      { en: "How are you feeling this week?", pt: "Como você está se sentindo nesta semana?" },
      { en: "What is going well?", pt: "O que está indo bem?" },
      { en: "What support do you need?", pt: "De que apoio você precisa?" },
      { en: "Is the workload okay?", pt: "A carga de trabalho está ok?" },
      { en: "Let's talk about your growth.", pt: "Vamos falar sobre o seu crescimento." },
      { en: "I am here to help.", pt: "Estou aqui para ajudar." },
    ],
    write: [
      {
        prompt: "Pergunte como a pessoa está nesta semana.",
        hint: "How are you feeling ...",
        answers: ["how are you feeling this week", "how are you this week"],
        tip: "Feeling = sentindo. This week = nesta semana.",
      },
      {
        prompt: "Pergunte de que apoio a pessoa precisa.",
        hint: "What support ...",
        answers: ["what support do you need", "what support do you need?"],
        tip: "Support = apoio. Need = precisar.",
      },
      {
        prompt: "Pergunte se a carga está ok.",
        hint: "Is the workload ...",
        answers: ["is the workload okay", "is the workload ok", "is your workload okay"],
        tip: "Workload = carga de trabalho.",
      },
      {
        prompt: "Diga que você está ali para ajudar.",
        hint: "I am here ...",
        answers: ["i am here to help", "i'm here to help"],
        tip: "I am here to help = estou aqui para ajudar.",
      },
    ],
  },
  {
    id: "client-call",
    title: "Call com cliente",
    blurb: "Status, atraso e próximo passo.",
    track: "work",
    scene: "client",
    roles: ["tech-lead", "product-owner", "manager"],
    speak: [
      { en: "Thank you for joining.", pt: "Obrigado por participar." },
      { en: "Here is a quick status.", pt: "Aqui vai um status rápido." },
      { en: "We are on track.", pt: "Estamos no prazo." },
      { en: "We have a delay of two days.", pt: "Temos um atraso de dois dias." },
      { en: "The risk is the integration.", pt: "O risco é a integração." },
      { en: "I will send the notes after the call.", pt: "Vou enviar as notas depois da call." },
    ],
    write: [
      {
        prompt: "Diga que estão no prazo.",
        hint: "We are on ...",
        answers: ["we are on track", "we're on track"],
        tip: "On track = no prazo / no caminho certo.",
      },
      {
        prompt: "Avise um atraso de dois dias.",
        hint: "We have a delay ...",
        answers: ["we have a delay of two days", "we are delayed by two days"],
        tip: "Delay = atraso.",
      },
      {
        prompt: "Diga que o risco é a integração.",
        hint: "The risk is ...",
        answers: ["the risk is the integration", "the main risk is the integration"],
        tip: "Risk = risco. Integration = integração.",
      },
      {
        prompt: "Diga que vai enviar as notas depois da call.",
        hint: "I will send the notes ...",
        answers: ["i will send the notes after the call", "i'll send the notes after the call"],
        tip: "Notes = anotações. After the call = depois da call.",
      },
    ],
  },
  {
    id: "slack-tech",
    title: "Slack / status técnico",
    blurb: "PR, deploy, incidente e ETA.",
    track: "work",
    scene: "slack",
    roles: ["developer", "tech-lead"],
    speak: [
      { en: "The pull request is ready for review.", pt: "O pull request está pronto para review." },
      { en: "I deployed to staging.", pt: "Eu fiz o deploy no staging." },
      { en: "Production looks stable.", pt: "A produção parece estável." },
      { en: "We have an incident.", pt: "Temos um incidente." },
      { en: "I am investigating now.", pt: "Estou investigando agora." },
      { en: "ETA is 20 minutes.", pt: "O prazo estimado é 20 minutos." },
    ],
    write: [
      {
        prompt: "Avise que o PR está pronto para review.",
        hint: "The pull request is ready ...",
        answers: ["the pull request is ready for review", "the pr is ready for review"],
        tip: "Pull request / PR = pedido de revisão do código.",
      },
      {
        prompt: "Diga que fez deploy no staging.",
        hint: "I deployed to ...",
        answers: ["i deployed to staging", "i deployed on staging"],
        tip: "Deployed = fiz o deploy. Staging = ambiente de teste.",
      },
      {
        prompt: "Avise que há um incidente.",
        hint: "We have an ...",
        answers: ["we have an incident", "there is an incident"],
        tip: "Incident = incidente. Grave, mas comum em tech.",
      },
      {
        prompt: "Diga que o ETA é 20 minutos.",
        hint: "ETA is ...",
        answers: ["eta is 20 minutes", "the eta is 20 minutes"],
        tip: "ETA = estimated time of arrival, prazo estimado.",
      },
    ],
  },
];
