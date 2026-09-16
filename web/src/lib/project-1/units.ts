import type { Unit } from "../work-units";
import {
  CLIENT_ROLES,
  JOIN_ROLES,
  LEAD_ROLES,
  ONE_ON_ONE_ROLES,
  PLANNING_ROLES,
  REFINEMENT_ROLES,
  RETRO_ROLES,
  REVIEW_ROLES,
  SLACK_ROLES,
  SPRINT_THEMES,
  speak,
  writeItem,
  type SprintTheme,
} from "./themes";

function joinDaily(theme: SprintTheme, day: number): Pick<Unit, "blurb" | "speak" | "write"> {
  const f = theme.feature;
  const b = theme.blocker;
  const days: Array<Pick<Unit, "blurb" | "speak" | "write">> = [
    {
      blurb: `Yesterday, today e blockers no ${theme.label}.`,
      speak: [
        speak(`Yesterday I finished the ${f} API.`, `Ontem eu terminei a API de ${f}.`, "O que você fez ontem."),
        speak(`Today I will work on the ${f} tests.`, `Hoje vou trabalhar nos testes de ${f}.`),
        speak("I have no blockers.", "Não tenho impedimentos."),
        speak(`I am blocked by the ${b}.`, `Estou bloqueado pelo ${b}.`),
        speak(`I need help with ${f}.`, `Preciso de ajuda com ${f}.`),
        speak("I will be done today.", "Vou terminar isso hoje."),
      ],
      write: [
        writeItem(`Na daily, diga que ontem você terminou a API de ${f}.`, "Yesterday I finished ...", [`yesterday i finished the ${f} api`], "Finished = terminei."),
        writeItem(`Diga que hoje você vai trabalhar nos testes de ${f}.`, "Today I will work on ...", [`today i will work on the ${f} tests`, `today i'll work on the ${f} tests`], "Will = vou / futuro."),
        writeItem("Diga que você não tem impedimentos.", "I have no ...", ["i have no blockers", "i don't have any blockers", "no blockers"], "Blockers = impedimentos."),
        writeItem(`Peça ajuda com ${f}.`, "I need help with ...", [`i need help with ${f}`], "Need help with = preciso de ajuda com."),
      ],
    },
    {
      blurb: `PR, teste e espera no ${theme.label}.`,
      speak: [
        speak(`Yesterday I opened the ${f} pull request.`, `Ontem eu abri o pull request de ${f}.`),
        speak(`Today I will write the ${f} tests.`, `Hoje vou escrever os testes de ${f}.`),
        speak(`I am waiting on the ${b}.`, `Estou esperando o ${b}.`),
        speak("I can pair with you after the daily.", "Posso fazer pair com você depois da daily."),
        speak("No blockers on my side.", "Sem impedimentos do meu lado."),
        speak(`I should finish ${f} today.`, `Devo terminar ${f} hoje.`),
      ],
      write: [
        writeItem(`Diga que ontem você abriu o pull request de ${f}.`, "Yesterday I opened ...", [`yesterday i opened the ${f} pull request`, `yesterday i opened the ${f} pr`], "Opened = abri."),
        writeItem(`Diga que hoje você vai escrever os testes de ${f}.`, "Today I will write ...", [`today i will write the ${f} tests`, `today i'll write the ${f} tests`], "Write the tests = escrever os testes."),
        writeItem(`Diga que está esperando o ${b}.`, "I am waiting on ...", [`i am waiting on the ${b}`, `i'm waiting on the ${b}`], "Waiting on = esperando."),
        writeItem("Diga que não tem impedimentos do seu lado.", "No blockers ...", ["no blockers on my side", "i have no blockers on my side"], "On my side = do meu lado."),
      ],
    },
    {
      blurb: `Bug, reunião e ${f}.`,
      speak: [
        speak(`Yesterday I fixed a bug in ${f}.`, `Ontem eu corrigi um bug em ${f}.`),
        speak("Today I have a meeting with the client.", "Hoje tenho reunião com o cliente."),
        speak(`I am blocked by the ${b}.`, `Estou bloqueado pelo ${b}.`),
        speak(`Can someone review my ${f} pull request?`, `Alguém pode revisar o meu pull request de ${f}?`),
        speak("I will continue after lunch.", "Vou continuar depois do almoço."),
        speak("I need 30 more minutes.", "Preciso de mais 30 minutos."),
      ],
      write: [
        writeItem(`Diga que ontem você corrigiu um bug em ${f}.`, "Yesterday I fixed ...", [`yesterday i fixed a bug in ${f}`], "Fixed a bug = corrigi um bug."),
        writeItem("Diga que hoje tem reunião com o cliente.", "Today I have a meeting ...", ["today i have a meeting with the client", "today i have a client meeting"], "Meeting with the client = reunião com o cliente."),
        writeItem(`Peça para alguém revisar o PR de ${f}.`, "Can someone review ...", [`can someone review my ${f} pull request`, `can someone review my ${f} pr`], "Review my pull request = revisar o meu PR."),
        writeItem("Diga que precisa de mais 30 minutos.", "I need 30 ...", ["i need 30 more minutes", "i need another 30 minutes"], "More minutes = mais minutos."),
      ],
    },
    {
      blurb: `Deploy e estabilidade de ${f}.`,
      speak: [
        speak(`Yesterday I deployed ${f} to staging.`, `Ontem eu fiz deploy de ${f} no staging.`),
        speak(`Today I will watch ${f} in production.`, `Hoje vou acompanhar ${f} em produção.`),
        speak("We had a small incident this morning.", "Tivemos um incidente pequeno esta manhã."),
        speak("It is stable now.", "Agora está estável."),
        speak("I will share the notes in Slack.", "Vou compartilhar as notas no Slack."),
        speak("ETA is one hour.", "O prazo estimado é uma hora."),
      ],
      write: [
        writeItem(`Diga que ontem você fez deploy de ${f} no staging.`, "Yesterday I deployed ...", [`yesterday i deployed ${f} to staging`], "Deployed to staging = fiz deploy no staging."),
        writeItem("Avise que houve um incidente pequeno esta manhã.", "We had a small incident ...", ["we had a small incident this morning"], "Incident = incidente."),
        writeItem("Diga que agora está estável.", "It is stable ...", ["it is stable now", "it's stable now"], "Stable = estável."),
        writeItem("Diga que o ETA é uma hora.", "ETA is ...", ["eta is one hour", "the eta is one hour", "eta is 1 hour"], "ETA = prazo estimado."),
      ],
    },
    {
      blurb: `Fechar a história de ${f}.`,
      speak: [
        speak("Yesterday I helped a teammate.", "Ontem eu ajudei um colega."),
        speak(`Today I will close the ${theme.story}.`, `Hoje vou fechar a ${theme.story}.`),
        speak("I have no blockers.", "Não tenho impedimentos."),
        speak("I can take one more task if needed.", "Posso pegar mais uma tarefa se precisar."),
        speak("Let's sync after the daily.", "Vamos alinhar depois da daily."),
        speak("I am free this afternoon.", "Estou livre nesta tarde."),
      ],
      write: [
        writeItem("Diga que ontem você ajudou um colega.", "Yesterday I helped ...", ["yesterday i helped a teammate", "yesterday i helped a colleague"], "Teammate = colega de time."),
        writeItem(`Diga que hoje vai fechar a ${theme.story}.`, "Today I will close ...", [`today i will close the ${theme.story}`, `today i'll close the ${theme.story}`], "Close this story = fechar esta história."),
        writeItem("Ofereça pegar mais uma tarefa se precisar.", "I can take one more ...", ["i can take one more task if needed", "i can take another task if needed"], "If needed = se precisar."),
        writeItem("Diga que está livre nesta tarde.", "I am free ...", ["i am free this afternoon", "i'm free this afternoon"], "Free = livre."),
      ],
    },
    {
      blurb: `Refatorar e documentar ${f}.`,
      speak: [
        speak(`Yesterday I refactored the ${f} module.`, `Ontem eu refatorei o módulo de ${f}.`),
        speak(`Today I will document ${f}.`, `Hoje vou documentar ${f}.`),
        speak(`I am waiting on the ${b}.`, `Estou esperando o ${b}.`),
        speak("I will share an update in Slack.", "Vou compartilhar um update no Slack."),
        speak("I should be done before lunch.", "Devo terminar antes do almoço."),
        speak("I need a review this afternoon.", "Preciso de uma review nesta tarde."),
      ],
      write: [
        writeItem(`Diga que ontem você refatorou o módulo de ${f}.`, "Yesterday I refactored ...", [`yesterday i refactored the ${f} module`], "Refactored = refatorei."),
        writeItem(`Diga que hoje você vai documentar ${f}.`, "Today I will document ...", [`today i will document ${f}`, `today i'll document ${f}`], "Document = documentar."),
        writeItem("Diga que vai compartilhar um update no Slack.", "I will share an update ...", ["i will share an update in slack", "i'll share an update in slack"], "Share an update = compartilhar um update."),
        writeItem("Diga que precisa de uma review nesta tarde.", "I need a review ...", ["i need a review this afternoon"], "This afternoon = nesta tarde."),
      ],
    },
    {
      blurb: `Testes e merge de ${f}.`,
      speak: [
        speak(`Yesterday I wrote tests for ${f}.`, `Ontem eu escrevi testes para ${f}.`),
        speak(`Today I will merge the ${f} branch.`, `Hoje vou fazer merge do branch de ${f}.`),
        speak("The tests are flaky.", "Os testes estão instáveis."),
        speak("I need help with the pipeline.", "Preciso de ajuda com o pipeline."),
        speak("I will continue after standup.", "Vou continuar depois do standup."),
        speak(`I am almost done with ${f}.`, `Estou quase terminando ${f}.`),
      ],
      write: [
        writeItem(`Diga que ontem você escreveu testes para ${f}.`, "Yesterday I wrote tests ...", [`yesterday i wrote tests for ${f}`], "Wrote tests = escrevi testes."),
        writeItem(`Diga que hoje vai fazer merge do branch de ${f}.`, "Today I will merge ...", [`today i will merge the ${f} branch`, `today i'll merge the ${f} branch`], "Merge = integrar o branch."),
        writeItem("Diga que os testes estão instáveis.", "The tests are ...", ["the tests are flaky"], "Flaky = instável / que falha às vezes."),
        writeItem("Diga que precisa de ajuda com o pipeline.", "I need help with ...", ["i need help with the pipeline"], "Pipeline = esteira de CI."),
      ],
    },
    {
      blurb: `Polir ${f} para a demo.`,
      speak: [
        speak(`Yesterday I prepared the ${f} demo.`, `Ontem eu preparei a demo de ${f}.`),
        speak(`Today I will polish the ${f} UI.`, `Hoje vou polir a interface de ${f}.`),
        speak(`I am blocked by the ${b}.`, `Estou bloqueado pelo ${b}.`),
        speak("I can take this task.", "Eu posso ficar com essa tarefa."),
        speak("I can pair after this.", "Posso fazer pair depois disso."),
        speak(`We can ship ${f} today.`, `Podemos entregar ${f} hoje.`),
      ],
      write: [
        writeItem(`Diga que ontem você preparou a demo de ${f}.`, "Yesterday I prepared ...", [`yesterday i prepared the ${f} demo`], "Prepared = preparei."),
        writeItem(`Diga que hoje vai polir a interface de ${f}.`, "Today I will polish ...", [`today i will polish the ${f} ui`, `today i'll polish the ${f} ui`], "Polish = polir / melhorar detalhes."),
        writeItem("Diga que pode ficar com essa tarefa.", "I can take ...", ["i can take this task", "i can take this one"], "Take this task = ficar com essa tarefa."),
        writeItem(`Diga que podem entregar ${f} hoje.`, "We can ship ...", [`we can ship ${f} today`], "Ship = entregar."),
      ],
    },
    {
      blurb: `Feedback e QA de ${f}.`,
      speak: [
        speak(`Yesterday I addressed feedback on ${f}.`, `Ontem eu tratei o feedback de ${f}.`),
        speak("Today I will fix the nits.", "Hoje vou corrigir os nits."),
        speak("I am waiting on QA.", "Estou esperando o QA."),
        speak("I have no blockers.", "Não tenho impedimentos."),
        speak("ETA is two hours.", "O prazo estimado é duas horas."),
        speak("I will close the remaining tasks.", "Vou fechar as tarefas que restam."),
      ],
      write: [
        writeItem(`Diga que ontem você tratou o feedback de ${f}.`, "Yesterday I addressed ...", [`yesterday i addressed feedback on ${f}`], "Addressed feedback = tratei o feedback."),
        writeItem("Diga que hoje vai corrigir os nits.", "Today I will fix ...", ["today i will fix the nits", "today i'll fix the nits"], "Nits = detalhes pequenos da review."),
        writeItem("Diga que está esperando o QA.", "I am waiting on ...", ["i am waiting on qa", "i'm waiting on qa"], "QA = qualidade / testes."),
        writeItem("Diga que o ETA é duas horas.", "ETA is ...", ["eta is two hours", "the eta is two hours"], "ETA = prazo estimado."),
      ],
    },
    {
      blurb: `Fechar ${f} e apoiar o release.`,
      speak: [
        speak(`Yesterday I wrapped up ${f}.`, `Ontem eu fechei ${f}.`),
        speak("Today I will support the release.", "Hoje vou apoiar o release."),
        speak("I have no blockers.", "Não tenho impedimentos."),
        speak("I can help others after this.", "Posso ajudar os outros depois disso."),
        speak("We are ready for the review.", "Estamos prontos para o review."),
        speak("It was a good sprint.", "Foi uma boa sprint."),
      ],
      write: [
        writeItem(`Diga que ontem você fechou ${f}.`, "Yesterday I wrapped up ...", [`yesterday i wrapped up ${f}`], "Wrapped up = fechei / concluí."),
        writeItem("Diga que hoje vai apoiar o release.", "Today I will support ...", ["today i will support the release", "today i'll support the release"], "Support the release = apoiar o release."),
        writeItem("Diga que pode ajudar os outros depois disso.", "I can help others ...", ["i can help others after this"], "Help others = ajudar os outros."),
        writeItem("Diga que estão prontos para o review.", "We are ready ...", ["we are ready for the review", "we're ready for the review"], "Ready for the review = prontos para o review."),
      ],
    },
  ];
  return days[day - 1];
}

function leadDaily(theme: SprintTheme, day: number): Pick<Unit, "blurb" | "speak" | "write"> {
  const f = theme.feature;
  const days: Array<Pick<Unit, "blurb" | "speak" | "write">> = [
    {
      blurb: `Abrir a daily do ${theme.label}.`,
      speak: [
        speak("Let's start the daily.", "Vamos começar a daily."),
        speak("Let's go around.", "Vamos passar um por um."),
        speak("Any blockers?", "Algum impedimento?"),
        speak("Please keep it short.", "Por favor, seja breve."),
        speak("We can take this offline.", "Podemos falar isso depois da daily."),
        speak("Thanks everyone.", "Obrigado a todos."),
      ],
      write: [
        writeItem("Abra a daily.", "Let's start ...", ["let's start the daily", "lets start the daily", "let us start the daily"], "Let's start = vamos começar."),
        writeItem("Pergunte se há impedimentos.", "Any blockers?", ["any blockers", "are there any blockers"], "Any blockers? é a pergunta clássica da daily."),
        writeItem("Peça para ser breve.", "Please keep it ...", ["please keep it short", "please keep it brief"], "Keep it short = seja breve."),
        writeItem("Diga que isso pode ficar para depois da daily.", "We can take this ...", ["we can take this offline", "let's take this offline"], "Take it offline = não resolver agora."),
      ],
    },
    {
      blurb: `Timebox e parking lot no ${theme.label}.`,
      speak: [
        speak("We are starting two minutes late.", "Estamos começando dois minutos atrasados."),
        speak("Please keep updates to one minute.", "Por favor, deixe o update em um minuto."),
        speak("Let's put this in the parking lot.", "Vamos deixar isso no parking lot."),
        speak("Who is blocked today?", "Quem está bloqueado hoje?"),
        speak("We can follow up after this.", "Podemos continuar isso depois."),
        speak("Thanks, let's have a good day.", "Obrigado, tenham um bom dia."),
      ],
      write: [
        writeItem("Peça para o update ficar em um minuto.", "Please keep updates ...", ["please keep updates to one minute", "please keep the updates to one minute"], "Timebox do update."),
        writeItem("Sugira deixar o assunto no parking lot.", "Let's put this in ...", ["let's put this in the parking lot", "lets put this in the parking lot"], "Parking lot = assunto para depois."),
        writeItem("Pergunte quem está bloqueado hoje.", "Who is blocked ...", ["who is blocked today"], "Blocked = bloqueado."),
        writeItem("Diga que podem continuar isso depois.", "We can follow up ...", ["we can follow up after this", "we can follow up after the daily"], "Follow up = continuar depois."),
      ],
    },
    {
      blurb: `Foco e blockers de ${f}.`,
      speak: [
        speak("Let's focus on yesterday, today, and blockers.", "Vamos focar em ontem, hoje e blockers."),
        speak("Please go first.", "Por favor, comece você."),
        speak("I hear two people with the same blocker.", "Ouço duas pessoas com o mesmo impedimento."),
        speak("Can you two sync after the daily?", "Vocês dois podem alinhar depois da daily?"),
        speak("We are on time.", "Estamos no horário."),
        speak("Great, we are done.", "Ótimo, terminamos."),
      ],
      write: [
        writeItem("Peça para a pessoa começar.", "Please go ...", ["please go first"], "Go first = comece você."),
        writeItem("Peça para os dois alinharem depois da daily.", "Can you two sync ...", ["can you two sync after the daily", "can you both sync after the daily"], "Sync = alinhar."),
        writeItem("Diga que estão no horário.", "We are on ...", ["we are on time", "we're on time"], "On time = no horário."),
        writeItem("Encerre a daily.", "Great, we are ...", ["great we are done", "great, we are done", "we are done"], "We are done = terminamos."),
      ],
    },
    {
      blurb: `Daily remota do ${theme.label}.`,
      speak: [
        speak("Can you unmute, please?", "Pode ligar o microfone, por favor?"),
        speak("We cannot hear you well.", "Não estamos ouvindo bem."),
        speak("Please use the chat if needed.", "Use o chat se precisar."),
        speak("Let's wait 10 seconds for people to join.", "Vamos esperar 10 segundos para o pessoal entrar."),
        speak("Quick reminder: update Jira after this.", "Lembrete rápido: atualizem o Jira depois disso."),
        speak("See you at the refinement.", "Até o refinement."),
      ],
      write: [
        writeItem("Peça para ligar o microfone.", "Can you unmute ...", ["can you unmute please", "can you unmute, please?"], "Unmute = ligar o microfone."),
        writeItem("Diga que não estão ouvindo bem.", "We cannot hear ...", ["we cannot hear you well", "we can't hear you well"], "Hear you well = ouvir bem."),
        writeItem("Peça para atualizar o Jira depois.", "Quick reminder: update ...", ["quick reminder update jira after this", "quick reminder: update jira after this"], "Reminder = lembrete."),
        writeItem("Despeça-se até o refinement.", "See you at ...", ["see you at the refinement", "see you in the refinement"], "See you at = até o encontro."),
      ],
    },
    {
      blurb: `Reconhecer o progresso em ${f}.`,
      speak: [
        speak(`Nice progress on ${f}, team.`, `Bom progresso em ${f}, time.`),
        speak("Does anyone need help after this?", "Alguém precisa de ajuda depois disso?"),
        speak("I will stay on the call if you want.", "Eu fico na call se vocês quiserem."),
        speak("Please be on time tomorrow.", "Por favor, cheguem no horário amanhã."),
        speak("Our next ceremony is the review.", "Nossa próxima cerimônia é o review."),
        speak("Thanks everyone, have a good one.", "Obrigado a todos, tenham um bom dia."),
      ],
      write: [
        writeItem(`Reconheça o progresso do time em ${f}.`, "Nice progress on ...", [`nice progress on ${f} team`, `nice progress on ${f}, team`], "Nice progress = bom progresso."),
        writeItem("Pergunte se alguém precisa de ajuda depois.", "Does anyone need help ...", ["does anyone need help after this", "does anybody need help after this"], "Need help = precisar de ajuda."),
        writeItem("Peça para chegarem no horário amanhã.", "Please be on time ...", ["please be on time tomorrow"], "On time tomorrow = no horário amanhã."),
        writeItem("Agradeça e deseje um bom dia.", "Thanks everyone ...", ["thanks everyone have a good one", "thanks everyone, have a good one"], "Have a good one = tenham um bom dia."),
      ],
    },
    {
      blurb: `Riscos de ${f} na daily.`,
      speak: [
        speak("Let's keep this to 15 minutes.", "Vamos manter isso em 15 minutos."),
        speak(`What is the risk on ${f} today?`, `Qual é o risco em ${f} hoje?`),
        speak("Please flag blockers early.", "Por favor, sinalizem os blockers cedo."),
        speak("We can swarm on this after the daily.", "Podemos fazer swarm nisso depois da daily."),
        speak("I will capture the actions.", "Vou anotar as ações."),
        speak("Thanks, that was clear.", "Obrigado, ficou claro."),
      ],
      write: [
        writeItem("Peça para manter a daily em 15 minutos.", "Let's keep this ...", ["let's keep this to 15 minutes", "lets keep this to 15 minutes"], "Keep this to = manter em."),
        writeItem(`Pergunte o risco em ${f} hoje.`, "What is the risk ...", [`what is the risk on ${f} today`, `what's the risk on ${f} today`], "Risk = risco."),
        writeItem("Peça para sinalizar blockers cedo.", "Please flag blockers ...", ["please flag blockers early"], "Flag = sinalizar."),
        writeItem("Diga que vai anotar as ações.", "I will capture ...", ["i will capture the actions", "i'll capture the actions"], "Capture the actions = anotar as ações."),
      ],
    },
    {
      blurb: `Dependências de ${f}.`,
      speak: [
        speak("Let's start with blockers first.", "Vamos começar pelos blockers."),
        speak(`Is anyone waiting on ${f}?`, `Alguém está esperando ${f}?`),
        speak("Please be specific.", "Por favor, seja específico."),
        speak("We can take design offline.", "Podemos falar de design depois."),
        speak("I will follow up with the other team.", "Vou falar com o outro time depois."),
        speak("Nice and short today. Thanks.", "Ótimo e curto hoje. Obrigado."),
      ],
      write: [
        writeItem("Peça para começar pelos blockers.", "Let's start with ...", ["let's start with blockers first", "lets start with blockers first"], "Blockers first = blockers primeiro."),
        writeItem(`Pergunte se alguém está esperando ${f}.`, "Is anyone waiting ...", [`is anyone waiting on ${f}`], "Waiting on = esperando."),
        writeItem("Peça para ser específico.", "Please be ...", ["please be specific"], "Specific = específico."),
        writeItem("Diga que vai falar com o outro time.", "I will follow up ...", ["i will follow up with the other team", "i'll follow up with the other team"], "Follow up with = falar com depois."),
      ],
    },
    {
      blurb: `Demo e ajuda em ${f}.`,
      speak: [
        speak(`Who needs help with ${f} today?`, `Quem precisa de ajuda com ${f} hoje?`),
        speak("Please keep cameras on if you can.", "Por favor, deixem a câmera ligada se puderem."),
        speak("Let's not solve it here.", "Não vamos resolver isso aqui."),
        speak("I can stay after the daily.", "Eu posso ficar depois da daily."),
        speak("Remember the demo is tomorrow.", "Lembrete: a demo é amanhã."),
        speak("Thanks, see you at the review.", "Obrigado, até o review."),
      ],
      write: [
        writeItem(`Pergunte quem precisa de ajuda com ${f} hoje.`, "Who needs help ...", [`who needs help with ${f} today`], "Need help with = precisar de ajuda com."),
        writeItem("Diga para não resolver isso aqui.", "Let's not solve ...", ["let's not solve it here", "lets not solve it here"], "Not solve it here = não resolver na daily."),
        writeItem("Diga que pode ficar depois da daily.", "I can stay ...", ["i can stay after the daily"], "Stay after = ficar depois."),
        writeItem("Lembre que a demo é amanhã.", "Remember the demo ...", ["remember the demo is tomorrow"], "Demo = apresentação / review."),
      ],
    },
    {
      blurb: `Fechamento da sprint de ${f}.`,
      speak: [
        speak("Let's go in board order today.", "Vamos na ordem do board hoje."),
        speak(`Are we still on track for ${f}?`, `Ainda estamos no prazo para ${f}?`),
        speak("Please update the board after this.", "Por favor, atualizem o board depois disso."),
        speak("I will ping the people who are blocked.", "Vou chamar quem está bloqueado."),
        speak("Great energy today.", "Ótima energia hoje."),
        speak("We are done. Have a good one.", "Terminamos. Tenham um bom dia."),
      ],
      write: [
        writeItem("Peça para ir na ordem do board.", "Let's go in ...", ["let's go in board order today", "lets go in board order today"], "Board order = ordem do board."),
        writeItem(`Pergunte se ainda estão no prazo para ${f}.`, "Are we still on track ...", [`are we still on track for ${f}`], "On track = no prazo."),
        writeItem("Peça para atualizar o board depois.", "Please update the board ...", ["please update the board after this"], "Update the board = atualizar o board."),
        writeItem("Encerre e deseje um bom dia.", "We are done ...", ["we are done have a good one", "we are done. have a good one"], "Have a good one = tenham um bom dia."),
      ],
    },
    {
      blurb: `Última daily da sprint de ${f}.`,
      speak: [
        speak("This is our last daily this sprint.", "Esta é a última daily desta sprint."),
        speak(`Nice work on ${f}.`, `Bom trabalho em ${f}.`),
        speak("Please be ready for the review.", "Por favor, fiquem prontos para o review."),
        speak("I will send the agenda after this.", "Vou enviar a pauta depois disso."),
        speak("Bring your questions to the retro.", "Tragam as perguntas para a retro."),
        speak("Thanks everyone, see you at the review.", "Obrigado a todos, até o review."),
      ],
      write: [
        writeItem("Diga que esta é a última daily da sprint.", "This is our last ...", ["this is our last daily this sprint"], "Last daily = última daily."),
        writeItem(`Reconheça o trabalho em ${f}.`, "Nice work on ...", [`nice work on ${f}`], "Nice work = bom trabalho."),
        writeItem("Peça para ficarem prontos para o review.", "Please be ready ...", ["please be ready for the review"], "Ready for the review = prontos para o review."),
        writeItem("Despeça-se até o review.", "Thanks everyone, see you ...", ["thanks everyone see you at the review", "thanks everyone, see you at the review"], "See you at the review = até o review."),
      ],
    },
  ];
  return days[day - 1];
}

function planningUnit(theme: SprintTheme, id: string): Unit {
  return {
    id,
    title: "Sprint planning",
    blurb: `Capacidade e meta: ${theme.label}.`,
    track: "work",
    scene: "planning",
    project: 1,
    sprint: theme.sprint,
    phase: "planning",
    roles: PLANNING_ROLES,
    speak: [
      speak("What is the goal of this sprint?", "Qual é o objetivo desta sprint?"),
      speak(`This ${theme.story} is too big.`, `Essa ${theme.story} está grande demais.`),
      speak("We can split this story.", "Podemos quebrar essa história."),
      speak(`I can take the ${theme.feature} task.`, `Eu posso ficar com a tarefa de ${theme.feature}.`),
      speak("What is the definition of done?", "Qual é a definition of done?"),
      speak(`This is our sprint goal: ${theme.feature}.`, `Este é o objetivo da sprint: ${theme.feature}.`),
    ],
    write: [
      writeItem("Pergunte o objetivo da sprint.", "What is the goal ...", ["what is the goal of this sprint", "what's the sprint goal"], "Sprint goal = objetivo da sprint."),
      writeItem(`Diga que a ${theme.story} está grande demais.`, "This story is too ...", [`this ${theme.story} is too big`, "this story is too big"], "Too big = grande demais."),
      writeItem(`Ofereça-se para pegar a tarefa de ${theme.feature}.`, "I can take ...", [`i can take the ${theme.feature} task`, "i can take this task"], "Take this task = ficar com essa tarefa."),
      writeItem("Pergunte a definition of done.", "What is the definition ...", ["what is the definition of done", "what's the definition of done"], "Definition of done = critério para considerar pronto."),
    ],
  };
}

function reviewUnit(theme: SprintTheme, id: string): Unit {
  return {
    id,
    title: "Review / demo",
    blurb: `Mostrar ${theme.demo}.`,
    track: "work",
    scene: "review",
    project: 1,
    sprint: theme.sprint,
    phase: "review",
    roles: REVIEW_ROLES,
    speak: [
      speak("Welcome, everyone.", "Bem-vindos, pessoal."),
      speak(`Today I will show ${theme.demo}.`, `Hoje vou mostrar ${theme.demo}.`),
      speak(`We delivered ${theme.feature}.`, `Nós entregamos ${theme.feature}.`),
      speak(`The next step is ${theme.next}.`, `O próximo passo é ${theme.next}.`),
      speak("Do you have any questions?", "Vocês têm alguma pergunta?"),
      speak("Thank you for your feedback.", "Obrigado pelo seu feedback."),
    ],
    write: [
      writeItem(`Diga que hoje você vai mostrar ${theme.demo}.`, "Today I will show ...", [`today i will show ${theme.demo}`, `today i'll show ${theme.demo}`], "Show = mostrar."),
      writeItem(`Diga que vocês entregaram ${theme.feature}.`, "We delivered ...", [`we delivered ${theme.feature}`], "Delivered = entregamos."),
      writeItem(`Diga que o próximo passo é ${theme.next}.`, "The next step is ...", [`the next step is ${theme.next}`], "Next step = próximo passo."),
      writeItem("Pergunte se há dúvidas.", "Do you have any ...", ["do you have any questions", "any questions"], "Any questions? = alguma pergunta?"),
    ],
  };
}

function retroUnit(theme: SprintTheme, id: string): Unit {
  return {
    id,
    title: "Retrospectiva",
    blurb: `O que foi bem em ${theme.label}.`,
    track: "work",
    scene: "retro",
    project: 1,
    sprint: theme.sprint,
    phase: "retro",
    roles: RETRO_ROLES,
    speak: [
      speak("What went well?", "O que foi bem?"),
      speak("What can we improve?", "O que podemos melhorar?"),
      speak(`I liked the ${theme.well} this sprint.`, `Gostei de ${theme.well} nesta sprint.`),
      speak(`We had ${theme.improve}.`, `Tivemos ${theme.improve}.`),
      speak("Let's pick one action item.", "Vamos escolher uma ação."),
      speak(`I will own this action: ${theme.action}.`, `Eu fico responsável por esta ação: ${theme.action}.`),
    ],
    write: [
      writeItem("Pergunte o que foi bem.", "What went ...", ["what went well"], "Went well = foi bem."),
      writeItem("Pergunte o que podem melhorar.", "What can we ...", ["what can we improve", "what can we do better"], "Improve = melhorar."),
      writeItem("Proponha escolher uma ação.", "Let's pick one ...", ["let's pick one action item", "lets pick one action item", "let's choose one action"], "Action item = ação da retro."),
      writeItem(`Assuma a ação: ${theme.action}.`, "I will own ...", [`i will own this action: ${theme.action}`, "i will own this action", "i'll own this action"], "Own this action = ficar responsável."),
    ],
  };
}

function midUnits(theme: SprintTheme): Unit[] {
  const s = theme.sprint;
  const f = theme.feature;
  return [
    {
      id: `p1-s${s}-refinement`,
      title: "Refinement",
      blurb: `Critérios de ${f}.`,
      track: "work",
      scene: "refinement",
      project: 1,
      sprint: s,
      phase: "mid",
      roles: REFINEMENT_ROLES,
      speak: [
        speak(`Can you clarify the acceptance criteria for ${f}?`, `Pode esclarecer os critérios de aceite de ${f}?`),
        speak("Who is the user?", "Quem é o usuário?"),
        speak("What happens if this fails?", "O que acontece se isso falhar?"),
        speak("I need more details.", "Preciso de mais detalhes."),
        speak("This depends on another team.", "Isso depende de outro time."),
        speak("I estimate this as five points.", "Eu estimo isso em cinco pontos."),
      ],
      write: [
        writeItem(`Peça para esclarecer os critérios de aceite de ${f}.`, "Can you clarify ...", [`can you clarify the acceptance criteria for ${f}`, "can you clarify the acceptance criteria"], "Acceptance criteria = critérios de aceite."),
        writeItem("Diga que precisa de mais detalhes.", "I need more ...", ["i need more details", "i need more information"], "Details = detalhes."),
        writeItem("Diga que isso depende de outro time.", "This depends on ...", ["this depends on another team", "this depends on a different team"], "Depends on = depende de."),
        writeItem("Estime a história em cinco pontos.", "I estimate this as ...", ["i estimate this as five points", "i estimate five points"], "Estimate = estimar."),
      ],
    },
    {
      id: `p1-s${s}-one-on-one`,
      title: "1:1",
      blurb: `Apoio na sprint de ${f}.`,
      track: "work",
      scene: "oneOnOne",
      project: 1,
      sprint: s,
      phase: "mid",
      roles: ONE_ON_ONE_ROLES,
      speak: [
        speak("How are you feeling this week?", "Como você está se sentindo nesta semana?"),
        speak("What is going well?", "O que está indo bem?"),
        speak("What support do you need?", "De que apoio você precisa?"),
        speak("Is the workload okay?", "A carga de trabalho está ok?"),
        speak(`Let's talk about your growth on ${f}.`, `Vamos falar sobre o seu crescimento em ${f}.`),
        speak("I am here to help.", "Estou aqui para ajudar."),
      ],
      write: [
        writeItem("Pergunte como a pessoa está nesta semana.", "How are you feeling ...", ["how are you feeling this week", "how are you this week"], "This week = nesta semana."),
        writeItem("Pergunte de que apoio a pessoa precisa.", "What support ...", ["what support do you need"], "Support = apoio."),
        writeItem("Pergunte se a carga está ok.", "Is the workload ...", ["is the workload okay", "is the workload ok", "is your workload okay"], "Workload = carga de trabalho."),
        writeItem("Diga que você está ali para ajudar.", "I am here ...", ["i am here to help", "i'm here to help"], "I am here to help = estou aqui para ajudar."),
      ],
    },
    {
      id: `p1-s${s}-client-call`,
      title: "Call com cliente",
      blurb: `Status de ${f}.`,
      track: "work",
      scene: "client",
      project: 1,
      sprint: s,
      phase: "mid",
      roles: CLIENT_ROLES,
      speak: [
        speak("Thank you for joining.", "Obrigado por participar."),
        speak(`Here is a quick status on ${f}.`, `Aqui vai um status rápido de ${f}.`),
        speak("We are on track.", "Estamos no prazo."),
        speak("We have a delay of two days.", "Temos um atraso de dois dias."),
        speak(`The risk is the ${theme.blocker}.`, `O risco é o ${theme.blocker}.`),
        speak("I will send the notes after the call.", "Vou enviar as notas depois da call."),
      ],
      write: [
        writeItem("Diga que estão no prazo.", "We are on ...", ["we are on track", "we're on track"], "On track = no prazo."),
        writeItem("Avise um atraso de dois dias.", "We have a delay ...", ["we have a delay of two days", "we are delayed by two days"], "Delay = atraso."),
        writeItem(`Diga que o risco é o ${theme.blocker}.`, "The risk is ...", [`the risk is the ${theme.blocker}`], "Risk = risco."),
        writeItem("Diga que vai enviar as notas depois da call.", "I will send the notes ...", ["i will send the notes after the call", "i'll send the notes after the call"], "Notes = anotações."),
      ],
    },
    {
      id: `p1-s${s}-slack-tech`,
      title: "Slack / status técnico",
      blurb: `PR e deploy de ${f}.`,
      track: "work",
      scene: "slack",
      project: 1,
      sprint: s,
      phase: "mid",
      roles: SLACK_ROLES,
      speak: [
        speak(`The ${f} pull request is ready for review.`, `O pull request de ${f} está pronto para review.`),
        speak(`I deployed ${f} to staging.`, `Eu fiz o deploy de ${f} no staging.`),
        speak("Production looks stable.", "A produção parece estável."),
        speak("We have an incident.", "Temos um incidente."),
        speak("I am investigating now.", "Estou investigando agora."),
        speak("ETA is 20 minutes.", "O prazo estimado é 20 minutos."),
      ],
      write: [
        writeItem(`Avise que o PR de ${f} está pronto para review.`, "The pull request is ready ...", [`the ${f} pull request is ready for review`, `the ${f} pr is ready for review`], "Pull request / PR = pedido de revisão."),
        writeItem(`Diga que fez deploy de ${f} no staging.`, "I deployed ...", [`i deployed ${f} to staging`], "Deployed = fiz o deploy."),
        writeItem("Avise que há um incidente.", "We have an ...", ["we have an incident", "there is an incident"], "Incident = incidente."),
        writeItem("Diga que o ETA é 20 minutos.", "ETA is ...", ["eta is 20 minutes", "the eta is 20 minutes"], "ETA = prazo estimado."),
      ],
    },
  ];
}

function dailyUnit(theme: SprintTheme, day: number, track: "join" | "lead"): Unit {
  const pack = track === "join" ? joinDaily(theme, day) : leadDaily(theme, day);
  const existingSprint1 = theme.sprint === 1;
  const id =
    existingSprint1 && track === "join"
      ? day === 1
        ? "daily-dev"
        : `daily-dev-${day}`
      : existingSprint1
        ? day === 1
          ? "daily-facilitate"
          : `daily-facilitate-${day}`
        : track === "join"
          ? `p1-s${theme.sprint}-daily-dev-${day}`
          : `p1-s${theme.sprint}-daily-facilitate-${day}`;
  return {
    id,
    title: `Daily ${day}`,
    blurb: pack.blurb,
    track: "work",
    scene: "daily",
    journey: day,
    project: 1,
    sprint: theme.sprint,
    phase: "daily",
    day,
    roles: track === "join" ? JOIN_ROLES : LEAD_ROLES,
    speak: pack.speak,
    write: pack.write,
  };
}

export const BASE_UNIT_META: Record<string, Pick<Unit, "project" | "sprint" | "phase" | "day">> = {
  "daily-dev": { project: 1, sprint: 1, phase: "daily", day: 1 },
  "daily-facilitate": { project: 1, sprint: 1, phase: "daily", day: 1 },
  "daily-dev-2": { project: 1, sprint: 1, phase: "daily", day: 2 },
  "daily-dev-3": { project: 1, sprint: 1, phase: "daily", day: 3 },
  "daily-dev-4": { project: 1, sprint: 1, phase: "daily", day: 4 },
  "daily-dev-5": { project: 1, sprint: 1, phase: "daily", day: 5 },
  "daily-facilitate-2": { project: 1, sprint: 1, phase: "daily", day: 2 },
  "daily-facilitate-3": { project: 1, sprint: 1, phase: "daily", day: 3 },
  "daily-facilitate-4": { project: 1, sprint: 1, phase: "daily", day: 4 },
  "daily-facilitate-5": { project: 1, sprint: 1, phase: "daily", day: 5 },
  planning: { project: 1, sprint: 1, phase: "planning" },
  "review-client": { project: 1, sprint: 1, phase: "review" },
  retro: { project: 1, sprint: 1, phase: "retro" },
  refinement: { project: 1, sprint: 1, phase: "mid" },
  "one-on-one": { project: 1, sprint: 1, phase: "mid" },
  "client-call": { project: 1, sprint: 1, phase: "mid" },
  "slack-tech": { project: 1, sprint: 1, phase: "mid" },
};

export function applySprintMeta(unit: Unit): Unit {
  const meta = BASE_UNIT_META[unit.id];
  return meta ? { ...unit, ...meta, journey: unit.journey ?? meta.day } : unit;
}

export function project1ExtraUnits(): Unit[] {
  const extra: Unit[] = [];
  for (const theme of SPRINT_THEMES) {
    for (let day = 1; day <= 10; day += 1) {
      const skipExisting = theme.sprint === 1 && day <= 5;
      if (!skipExisting) {
        extra.push(dailyUnit(theme, day, "join"));
        extra.push(dailyUnit(theme, day, "lead"));
      }
    }
    if (theme.sprint === 1) continue;
    extra.push(planningUnit(theme, `p1-s${theme.sprint}-planning`));
    extra.push(reviewUnit(theme, `p1-s${theme.sprint}-review`));
    extra.push(retroUnit(theme, `p1-s${theme.sprint}-retro`));
    extra.push(...midUnits(theme));
  }
  return extra;
}
