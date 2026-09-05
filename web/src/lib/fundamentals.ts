import type { SpeakItem, WriteItem } from "./work-units";

type FundamentalUnit = {
  id: string;
  title: string;
  blurb: string;
  speak: SpeakItem[];
  write: WriteItem[];
};

export const units: FundamentalUnit[] = [
  {
    id: "hello",
    title: "Cumprimentos",
    blurb: "Bom dia, como vai, até logo.",
    speak: [
      {
        en: "Good morning.",
        pt: "Bom dia.",
        when: "Ao chegar no escritório.",
      },
      {
        en: "Good afternoon.",
        pt: "Boa tarde.",
        when: "Depois do meio-dia.",
      },
      {
        en: "How are you?",
        pt: "Como vai?",
        when: "Para um colega no corredor.",
      },
      {
        en: "I'm good, thanks. And you?",
        pt: "Estou bem, obrigado. E você?",
        when: "Resposta clássica e educada.",
      },
      {
        en: "Nice to meet you.",
        pt: "Prazer em te conhecer.",
        when: "Primeira vez com alguém.",
      },
      {
        en: "Have a good day.",
        pt: "Tenha um bom dia.",
        when: "Ao se despedir de manhã ou à tarde.",
      },
      {
        en: "See you tomorrow.",
        pt: "Até amanhã.",
        when: "No fim do expediente.",
      },
    ],
    write: [
      {
        prompt: "Escreva: Bom dia.",
        hint: "Duas palavras. Começa com Good.",
        answers: ["good morning", "good morning."],
        tip: "Morning = manhã. Afternoon = tarde. Evening = começo da noite.",
      },
      {
        prompt: "Um colega pergunta: How are you? Responda que você está bem e devolva a pergunta.",
        hint: "I'm good, thanks. And you?",
        answers: [
          "i'm good thanks and you",
          "i am good thanks and you",
          "i'm good thank you and you",
          "i'm fine thanks and you",
          "i am fine thanks and you",
        ],
        tip: "I'm = I am. Fine e good servem os dois.",
      },
      {
        prompt: "Escreva: Prazer em te conhecer.",
        hint: "Nice to ...",
        answers: ["nice to meet you", "pleased to meet you"],
        tip: "Meet = conhecer / encontrar.",
      },
      {
        prompt: "Escreva: Até amanhã.",
        hint: "See you ...",
        answers: ["see you tomorrow", "see you tomorrow."],
        tip: "Tomorrow = amanhã. Yesterday = ontem.",
      },
    ],
  },
  {
    id: "intro",
    title: "Se apresentar",
    blurb: "Nome, cargo e o que você faz.",
    speak: [
      {
        en: "Hello, my name is Ana.",
        pt: "Olá, meu nome é Ana.",
        when: "Troque Ana pelo seu nome quando for falar de verdade.",
      },
      {
        en: "I work in an office.",
        pt: "Eu trabalho em um escritório.",
      },
      {
        en: "I work with computers.",
        pt: "Eu trabalho com computadores.",
      },
      {
        en: "I am a developer.",
        pt: "Eu sou desenvolvedor(a).",
      },
      {
        en: "I am new here.",
        pt: "Eu sou novo(a) aqui.",
      },
      {
        en: "I am learning English.",
        pt: "Estou aprendendo inglês.",
      },
      {
        en: "Nice to work with you.",
        pt: "Prazer em trabalhar com você.",
      },
    ],
    write: [
      {
        prompt: "Escreva: Meu nome é Ana.",
        hint: "My name is ...",
        answers: ["my name is ana", "my name's ana"],
        tip: "My name is = meu nome é. Depois vem o nome com letra maiúscula.",
      },
      {
        prompt: "Escreva: Eu trabalho em um escritório.",
        hint: "I work in an ...",
        answers: ["i work in an office", "i work in an office."],
        tip: "In an office (em um escritório). Work with = trabalhar com pessoas ou ferramentas.",
      },
      {
        prompt: "Escreva: Eu sou desenvolvedor.",
        hint: "I am a ...",
        answers: [
          "i am a developer",
          "i'm a developer",
          "i am a software developer",
          "i'm a software developer",
        ],
        tip: "Use a antes de profissão: I am a teacher, I am a developer.",
      },
      {
        prompt: "Escreva: Estou aprendendo inglês.",
        hint: "I am learning ...",
        answers: ["i am learning english", "i'm learning english"],
        tip: "Learning = aprendendo. English com E maiúsculo.",
      },
      {
        prompt: "Escreva: Eu sou novo aqui.",
        hint: "I am new ...",
        answers: ["i am new here", "i'm new here"],
        tip: "Here = aqui. There = lá.",
      },
    ],
  },
  {
    id: "help",
    title: "Pedir ajuda",
    blurb: "Quando você não entende ou precisa de alguém.",
    speak: [
      {
        en: "Can you help me, please?",
        pt: "Pode me ajudar, por favor?",
      },
      {
        en: "I don't understand.",
        pt: "Eu não entendi.",
      },
      {
        en: "Can you repeat, please?",
        pt: "Pode repetir, por favor?",
      },
      {
        en: "Can you speak slowly, please?",
        pt: "Pode falar devagar, por favor?",
      },
      {
        en: "What does this mean?",
        pt: "O que isso significa?",
      },
      {
        en: "Just a moment, please.",
        pt: "Um momento, por favor.",
      },
      {
        en: "Thank you for your help.",
        pt: "Obrigado pela sua ajuda.",
      },
    ],
    write: [
      {
        prompt: "Escreva: Pode me ajudar, por favor?",
        hint: "Can you help me, please?",
        answers: ["can you help me please", "could you help me please"],
        tip: "Can you + verbo. Please deixa o pedido educado.",
      },
      {
        prompt: "Escreva: Eu não entendi.",
        hint: "I don't ...",
        answers: ["i don't understand", "i do not understand", "i didn't understand", "i did not understand"],
        tip: "Don't = do not. Understand = entender.",
      },
      {
        prompt: "Escreva: Pode repetir, por favor?",
        hint: "Can you repeat ...",
        answers: ["can you repeat please", "can you repeat that please", "could you repeat please"],
        tip: "Repeat = repetir. That = isso.",
      },
      {
        prompt: "Escreva: O que isso significa?",
        hint: "What does this ...",
        answers: ["what does this mean", "what does that mean"],
        tip: "Mean = significar. This = isto (perto). That = isso (mais longe).",
      },
      {
        prompt: "Escreva: Obrigado pela sua ajuda.",
        hint: "Thank you for ...",
        answers: ["thank you for your help", "thanks for your help"],
        tip: "Thank you for + substantivo. Your = sua/seu.",
      },
    ],
  },
  {
    id: "meeting",
    title: "Em reunião",
    blurb: "Frases curtas para call e reunião.",
    speak: [
      {
        en: "Let's start.",
        pt: "Vamos começar.",
      },
      {
        en: "I am here.",
        pt: "Estou aqui. (presente na call)",
      },
      {
        en: "Can you hear me?",
        pt: "Você está me ouvindo?",
      },
      {
        en: "I am on mute.",
        pt: "Estou no mudo.",
      },
      {
        en: "Sorry, I am late.",
        pt: "Desculpa, estou atrasado(a).",
      },
      {
        en: "I agree.",
        pt: "Eu concordo.",
      },
      {
        en: "I have a question.",
        pt: "Eu tenho uma pergunta.",
      },
      {
        en: "Let's talk tomorrow.",
        pt: "Vamos conversar amanhã.",
      },
    ],
    write: [
      {
        prompt: "Escreva: Vamos começar.",
        hint: "Let's ...",
        answers: ["let's start", "lets start", "let us start"],
        tip: "Let's = let us = vamos.",
      },
      {
        prompt: "Na call, pergunte se a pessoa está te ouvindo.",
        hint: "Can you hear me?",
        answers: ["can you hear me", "can you hear me?"],
        tip: "Hear = ouvir. Listen = prestar atenção ao som.",
      },
      {
        prompt: "Escreva: Desculpa, estou atrasado.",
        hint: "Sorry, I am ...",
        answers: ["sorry i am late", "sorry i'm late", "i am sorry i am late", "i'm sorry i'm late"],
        tip: "Late = atrasado. Early = adiantado.",
      },
      {
        prompt: "Escreva: Eu concordo.",
        hint: "I a...",
        answers: ["i agree", "i agree."],
        tip: "Agree = concordar. I don't agree = eu não concordo.",
      },
      {
        prompt: "Escreva: Eu tenho uma pergunta.",
        hint: "I have a ...",
        answers: ["i have a question", "i've got a question"],
        tip: "Have = ter. Question = pergunta. Answer = resposta.",
      },
    ],
  },
  {
    id: "messages",
    title: "Mensagens curtas",
    blurb: "Slack, e-mail e recados do dia.",
    speak: [
      {
        en: "I will send it today.",
        pt: "Vou enviar isso hoje.",
      },
      {
        en: "Please send me the file.",
        pt: "Por favor, me envie o arquivo.",
      },
      {
        en: "I am busy right now.",
        pt: "Estou ocupado(a) agora.",
      },
      {
        en: "I am in a meeting.",
        pt: "Estou em uma reunião.",
      },
      {
        en: "I will check and reply.",
        pt: "Vou verificar e responder.",
      },
      {
        en: "Can we talk later?",
        pt: "Podemos falar mais tarde?",
      },
      {
        en: "The meeting is at 10.",
        pt: "A reunião é às 10.",
      },
    ],
    write: [
      {
        prompt: "Escreva: Vou enviar isso hoje.",
        hint: "I will send it ...",
        answers: ["i will send it today", "i'll send it today", "i will send this today", "i'll send this today"],
        tip: "Will = futuro. Today = hoje. Tomorrow = amanhã.",
      },
      {
        prompt: "Escreva: Estou em uma reunião.",
        hint: "I am in a ...",
        answers: ["i am in a meeting", "i'm in a meeting"],
        tip: "In a meeting = em reunião.",
      },
      {
        prompt: "Escreva: Estou ocupado agora.",
        hint: "I am busy ...",
        answers: ["i am busy right now", "i'm busy right now", "i am busy now", "i'm busy now"],
        tip: "Busy = ocupado. Right now = agora neste momento.",
      },
      {
        prompt: "Peça para conversar mais tarde.",
        hint: "Can we talk later?",
        answers: ["can we talk later", "can we speak later", "can we talk later please"],
        tip: "Later = mais tarde. Talk e speak funcionam aqui.",
      },
      {
        prompt: "Escreva: Por favor, me envie o arquivo.",
        hint: "Please send me ...",
        answers: ["please send me the file", "please send me the file.", "can you send me the file please"],
        tip: "Send me = me envie. File = arquivo.",
      },
    ],
  },
  {
    id: "day",
    title: "No dia a dia",
    blurb: "Café, pausa, tarefa feita e até logo.",
    speak: [
      {
        en: "Would you like some coffee?",
        pt: "Você quer um café?",
      },
      {
        en: "I need a break.",
        pt: "Preciso de uma pausa.",
      },
      {
        en: "I finished the task.",
        pt: "Eu terminei a tarefa.",
      },
      {
        en: "I can do it.",
        pt: "Eu consigo fazer isso.",
      },
      {
        en: "I need more time.",
        pt: "Eu preciso de mais tempo.",
      },
      {
        en: "Have a good weekend.",
        pt: "Tenha um bom fim de semana.",
      },
      {
        en: "See you on Monday.",
        pt: "Até segunda-feira.",
      },
    ],
    write: [
      {
        prompt: "Escreva: Preciso de uma pausa.",
        hint: "I need a ...",
        answers: ["i need a break", "i need a break."],
        tip: "Need = precisar. Break = pausa.",
      },
      {
        prompt: "Escreva: Eu terminei a tarefa.",
        hint: "I finished ...",
        answers: ["i finished the task", "i have finished the task", "i've finished the task", "i finished the job"],
        tip: "Finished = terminei. Task = tarefa.",
      },
      {
        prompt: "Escreva: Eu preciso de mais tempo.",
        hint: "I need more ...",
        answers: ["i need more time", "i need more time."],
        tip: "More = mais. Time = tempo.",
      },
      {
        prompt: "Escreva: Eu consigo fazer isso.",
        hint: "I can do ...",
        answers: ["i can do it", "i can do that", "i can do this"],
        tip: "Can = conseguir / poder. Do it = fazer isso.",
      },
      {
        prompt: "Despeça-se no fim da sexta: tenha um bom fim de semana.",
        hint: "Have a good ...",
        answers: ["have a good weekend", "have a nice weekend", "have a great weekend"],
        tip: "Weekend = fim de semana. Week = semana.",
      },
    ],
  },
  {
    id: "time",
    title: "Hora e agenda",
    blurb: "Que horas, hoje, amanhã e a reunião.",
    speak: [
      { en: "What time is it?", pt: "Que horas são?", when: "Para checar o horário." },
      { en: "The meeting is at 9.", pt: "A reunião é às 9.", when: "Para marcar um horário." },
      { en: "I am free at 3.", pt: "Estou livre às 3.", when: "Quando podem te chamar." },
      { en: "I am not free today.", pt: "Não estou livre hoje." },
      { en: "Can we meet tomorrow?", pt: "Podemos nos reunir amanhã?" },
      { en: "See you at 2.", pt: "Te vejo às 2." },
      { en: "It is Monday today.", pt: "Hoje é segunda-feira." },
      { en: "I work from 9 to 6.", pt: "Eu trabalho das 9 às 6." },
    ],
    write: [
      {
        prompt: "Escreva: Que horas são?",
        hint: "What time ...",
        answers: ["what time is it", "what's the time"],
        tip: "What time is it? = que horas são?",
      },
      {
        prompt: "Escreva: A reunião é às 9.",
        hint: "The meeting is at ...",
        answers: ["the meeting is at 9", "the meeting is at nine"],
        tip: "At + hora: at 9, at 10, at 3.",
      },
      {
        prompt: "Escreva: Estou livre às 3.",
        hint: "I am free at ...",
        answers: ["i am free at 3", "i'm free at 3", "i am free at three", "i'm free at three"],
        tip: "Free = livre. Busy = ocupado.",
      },
      {
        prompt: "Convide para se reunir amanhã.",
        hint: "Can we meet tomorrow?",
        answers: ["can we meet tomorrow", "can we meet tomorrow?"],
        tip: "Meet = se reunir / encontrar.",
      },
      {
        prompt: "Escreva: Eu trabalho das 9 às 6.",
        hint: "I work from 9 to 6.",
        answers: ["i work from 9 to 6", "i work from nine to six"],
        tip: "From ... to ... = de ... até ...",
      },
    ],
  },
  {
    id: "phone",
    title: "Telefone e call",
    blurb: "Atender, esperar e a ligação caiu.",
    speak: [
      { en: "Hello, this is Ana.", pt: "Alô, aqui é a Ana.", when: "Ao atender ou se apresentar na call." },
      { en: "Can I speak to John, please?", pt: "Posso falar com o John, por favor?" },
      { en: "Please hold.", pt: "Por favor, aguarde." },
      { en: "I will call you back.", pt: "Eu te ligo de volta." },
      { en: "The line is bad.", pt: "A linha está ruim." },
      { en: "Can you call me later?", pt: "Pode me ligar mais tarde?" },
      { en: "Sorry, I missed your call.", pt: "Desculpa, perdi a sua ligação." },
      { en: "I am joining the call now.", pt: "Estou entrando na call agora." },
    ],
    write: [
      {
        prompt: "Escreva: Eu te ligo de volta.",
        hint: "I will call you ...",
        answers: ["i will call you back", "i'll call you back"],
        tip: "Call back = ligar de volta.",
      },
      {
        prompt: "Peça para a pessoa te ligar mais tarde.",
        hint: "Can you call me later?",
        answers: ["can you call me later", "can you call me later please"],
        tip: "Call me = me ligue.",
      },
      {
        prompt: "Escreva: A linha está ruim.",
        hint: "The line is ...",
        answers: ["the line is bad", "the connection is bad"],
        tip: "Line = linha. Connection = conexão.",
      },
      {
        prompt: "Escreva: Desculpa, perdi a sua ligação.",
        hint: "Sorry, I missed ...",
        answers: ["sorry i missed your call", "sorry i missed your call.", "i missed your call sorry"],
        tip: "Missed = perdi / não atendi.",
      },
      {
        prompt: "Escreva: Estou entrando na call agora.",
        hint: "I am joining ...",
        answers: ["i am joining the call now", "i'm joining the call now", "i am joining the meeting now", "i'm joining the meeting now"],
        tip: "Join = entrar / participar.",
      },
    ],
  },
  {
    id: "email",
    title: "E-mail",
    blurb: "Assunto, anexo, por favor e obrigado.",
    speak: [
      { en: "Please see the email.", pt: "Por favor, veja o e-mail." },
      { en: "I sent the email.", pt: "Eu enviei o e-mail." },
      { en: "Did you get my email?", pt: "Você recebeu o meu e-mail?" },
      { en: "Please find the file attached.", pt: "O arquivo vai em anexo." },
      { en: "I will reply soon.", pt: "Vou responder em breve." },
      { en: "Thank you for your email.", pt: "Obrigado pelo seu e-mail." },
      { en: "Please let me know.", pt: "Por favor, me avise." },
    ],
    write: [
      {
        prompt: "Pergunte se a pessoa recebeu o seu e-mail.",
        hint: "Did you get ...",
        answers: ["did you get my email", "did you receive my email", "have you got my email"],
        tip: "Get = receber, neste contexto.",
      },
      {
        prompt: "Escreva: Eu enviei o e-mail.",
        hint: "I sent ...",
        answers: ["i sent the email", "i sent an email", "i have sent the email", "i've sent the email"],
        tip: "Sent = enviei. Send = enviar.",
      },
      {
        prompt: "Escreva: Vou responder em breve.",
        hint: "I will reply ...",
        answers: ["i will reply soon", "i'll reply soon", "i will reply shortly", "i'll reply shortly"],
        tip: "Reply = responder. Soon = em breve.",
      },
      {
        prompt: "Peça para a pessoa te avisar.",
        hint: "Please let me know.",
        answers: ["please let me know", "let me know please", "please let me know."],
        tip: "Let me know = me avise / me diga.",
      },
      {
        prompt: "Escreva: Obrigado pelo seu e-mail.",
        hint: "Thank you for ...",
        answers: ["thank you for your email", "thanks for your email"],
        tip: "Thank you for + coisa recebida.",
      },
    ],
  },
  {
    id: "polite",
    title: "Pedidos educados",
    blurb: "Could you, please e no problem.",
    speak: [
      { en: "Could you help me?", pt: "Você poderia me ajudar?" },
      { en: "Could you send this today?", pt: "Você poderia enviar isso hoje?" },
      { en: "Is it possible?", pt: "É possível?" },
      { en: "No problem.", pt: "Sem problema." },
      { en: "Of course.", pt: "Claro." },
      { en: "That is fine.", pt: "Está tudo bem / pode ser." },
      { en: "I would like to ask something.", pt: "Eu gostaria de perguntar uma coisa." },
      { en: "When you have time, please.", pt: "Quando você tiver tempo, por favor." },
    ],
    write: [
      {
        prompt: "Peça, de forma educada, para a pessoa te ajudar.",
        hint: "Could you help me?",
        answers: ["could you help me", "could you help me please", "can you help me please"],
        tip: "Could you é mais educado que Can you.",
      },
      {
        prompt: "Escreva: Sem problema.",
        hint: "No p...",
        answers: ["no problem", "no problem.", "that's no problem"],
        tip: "No problem = sem problema. You're welcome = de nada.",
      },
      {
        prompt: "Escreva: Claro.",
        hint: "Of c...",
        answers: ["of course", "of course.", "sure"],
        tip: "Of course e sure = claro.",
      },
      {
        prompt: "Escreva: É possível?",
        hint: "Is it ...",
        answers: ["is it possible", "is that possible"],
        tip: "Possible = possível.",
      },
      {
        prompt: "Escreva: Eu gostaria de perguntar uma coisa.",
        hint: "I would like to ask ...",
        answers: ["i would like to ask something", "i'd like to ask something", "i would like to ask a question"],
        tip: "I would like to = eu gostaria de. Mais educado que I want.",
      },
    ],
  },
  {
    id: "problems",
    title: "Problema e atraso",
    blurb: "Desculpa, não funciona, vou resolver.",
    speak: [
      { en: "There is a problem.", pt: "Tem um problema." },
      { en: "It is not working.", pt: "Não está funcionando." },
      { en: "I cannot open the file.", pt: "Não consigo abrir o arquivo." },
      { en: "Sorry for the delay.", pt: "Desculpa pelo atraso." },
      { en: "I will fix it.", pt: "Eu vou resolver / consertar." },
      { en: "Can you wait, please?", pt: "Pode esperar, por favor?" },
      { en: "I made a mistake.", pt: "Eu cometi um erro." },
      { en: "Let me check.", pt: "Deixa eu verificar." },
    ],
    write: [
      {
        prompt: "Escreva: Tem um problema.",
        hint: "There is a ...",
        answers: ["there is a problem", "there's a problem", "we have a problem"],
        tip: "There is = tem / existe.",
      },
      {
        prompt: "Escreva: Não está funcionando.",
        hint: "It is not ...",
        answers: ["it is not working", "it's not working", "it isn't working"],
        tip: "Working = funcionando.",
      },
      {
        prompt: "Escreva: Desculpa pelo atraso.",
        hint: "Sorry for the ...",
        answers: ["sorry for the delay", "sorry for the delay.", "i am sorry for the delay", "i'm sorry for the delay"],
        tip: "Delay = atraso.",
      },
      {
        prompt: "Escreva: Eu vou resolver.",
        hint: "I will fix ...",
        answers: ["i will fix it", "i'll fix it", "i will solve it", "i'll solve it"],
        tip: "Fix = consertar / resolver. Solve = resolver.",
      },
      {
        prompt: "Escreva: Eu cometi um erro.",
        hint: "I made a ...",
        answers: ["i made a mistake", "i made a mistake."],
        tip: "Made a mistake = cometi um erro.",
      },
    ],
  },
  {
    id: "status",
    title: "Andamento",
    blurb: "Feito, em progresso, ainda não.",
    speak: [
      { en: "It is done.", pt: "Está feito / pronto." },
      { en: "I am working on it.", pt: "Estou trabalhando nisso." },
      { en: "It is in progress.", pt: "Está em andamento." },
      { en: "Not yet.", pt: "Ainda não." },
      { en: "I need your feedback.", pt: "Preciso do seu retorno." },
      { en: "The deadline is Friday.", pt: "O prazo é sexta-feira." },
      { en: "I can start today.", pt: "Posso começar hoje." },
      { en: "Who is responsible?", pt: "Quem é o responsável?" },
    ],
    write: [
      {
        prompt: "Escreva: Está feito.",
        hint: "It is ...",
        answers: ["it is done", "it's done", "it is finished", "it's finished"],
        tip: "Done = feito / pronto.",
      },
      {
        prompt: "Escreva: Estou trabalhando nisso.",
        hint: "I am working ...",
        answers: ["i am working on it", "i'm working on it"],
        tip: "Work on it = trabalhar nisso.",
      },
      {
        prompt: "Escreva: Ainda não.",
        hint: "Not ...",
        answers: ["not yet", "not yet."],
        tip: "Not yet = ainda não. Already = já.",
      },
      {
        prompt: "Escreva: O prazo é sexta-feira.",
        hint: "The deadline is ...",
        answers: ["the deadline is friday", "the deadline is on friday"],
        tip: "Deadline = prazo final.",
      },
      {
        prompt: "Escreva: Preciso do seu retorno.",
        hint: "I need your ...",
        answers: ["i need your feedback", "i need your reply", "i need your response"],
        tip: "Feedback = retorno / opinião. Reply = resposta.",
      },
    ],
  },
  {
    id: "clarify",
    title: "Confirmar",
    blurb: "Certo, pode repetir, está claro.",
    speak: [
      { en: "Is that correct?", pt: "Isso está correto?" },
      { en: "Yes, that is right.", pt: "Sim, isso está certo." },
      { en: "No, that is wrong.", pt: "Não, isso está errado." },
      { en: "What do you mean?", pt: "O que você quer dizer?" },
      { en: "Can you explain, please?", pt: "Pode explicar, por favor?" },
      { en: "I understand now.", pt: "Agora eu entendi." },
      { en: "So, just to confirm.", pt: "Então, só para confirmar." },
      { en: "Got it.", pt: "Entendi. / Combinado." },
    ],
    write: [
      {
        prompt: "Pergunte se isso está correto.",
        hint: "Is that ...",
        answers: ["is that correct", "is this correct", "is that right"],
        tip: "Correct e right = correto / certo.",
      },
      {
        prompt: "Escreva: O que você quer dizer?",
        hint: "What do you ...",
        answers: ["what do you mean", "what do you mean?"],
        tip: "Mean = querer dizer / significar.",
      },
      {
        prompt: "Peça uma explicação, com educação.",
        hint: "Can you explain, please?",
        answers: ["can you explain please", "could you explain please", "can you explain that please"],
        tip: "Explain = explicar.",
      },
      {
        prompt: "Escreva: Agora eu entendi.",
        hint: "I understand ...",
        answers: ["i understand now", "i understand now.", "now i understand"],
        tip: "Understand = entender. Now = agora.",
      },
      {
        prompt: "Escreva de forma curta: Entendi.",
        hint: "Got ...",
        answers: ["got it", "got it.", "i got it"],
        tip: "Got it é muito comum no trabalho. Informal, mas ok no chat.",
      },
    ],
  },
  {
    id: "people",
    title: "Com pessoas",
    blurb: "Cliente, time, obrigado e desculpa.",
    speak: [
      { en: "This is my colleague.", pt: "Este é o meu colega." },
      { en: "This is my team.", pt: "Este é o meu time." },
      { en: "The client is waiting.", pt: "O cliente está esperando." },
      { en: "I will talk to the team.", pt: "Vou falar com o time." },
      { en: "You are welcome.", pt: "De nada." },
      { en: "Excuse me.", pt: "Com licença. / Desculpa." },
      { en: "Can I ask a question?", pt: "Posso fazer uma pergunta?" },
      { en: "Have a good lunch.", pt: "Tenha um bom almoço." },
    ],
    write: [
      {
        prompt: "Escreva: Este é o meu colega.",
        hint: "This is my ...",
        answers: ["this is my colleague", "this is my coworker", "this is my co worker"],
        tip: "Colleague e coworker = colega de trabalho.",
      },
      {
        prompt: "Escreva: O cliente está esperando.",
        hint: "The client is ...",
        answers: ["the client is waiting", "the customer is waiting"],
        tip: "Client e customer = cliente. Waiting = esperando.",
      },
      {
        prompt: "Escreva: Vou falar com o time.",
        hint: "I will talk to ...",
        answers: ["i will talk to the team", "i'll talk to the team", "i will speak to the team", "i'll speak to the team"],
        tip: "Talk to / speak to = falar com.",
      },
      {
        prompt: "Responda a um obrigado: De nada.",
        hint: "You are ...",
        answers: ["you are welcome", "you're welcome", "you are welcome."],
        tip: "You're welcome = de nada. Depois de Thank you.",
      },
      {
        prompt: "Peça licença para falar.",
        hint: "Excuse ...",
        answers: ["excuse me", "excuse me.", "excuse me please"],
        tip: "Excuse me = com licença, para chamar atenção com educação.",
      },
    ],
  },
];
