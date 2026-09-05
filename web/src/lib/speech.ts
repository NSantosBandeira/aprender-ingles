type SpeechRec = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript?: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

const SpeechRecognition: (new () => SpeechRec) | undefined =
  typeof window === "undefined"
    ? undefined
    : (window as Window & { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec })
        .SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: new () => SpeechRec }).webkitSpeechRecognition;

function voiceScore(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  if (name.includes("google")) return 5;
  if (name.includes("natural") || name.includes("neural") || name.includes("online")) return 4;
  if (name.includes("aria") || name.includes("jenny") || name.includes("guy")) return 3;
  if (name.includes("microsoft")) return 1;
  return 2;
}

function pickEnglishVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const english = voices.filter((voice: SpeechSynthesisVoice) => /^en[-_]/i.test(voice.lang));
  return [...english].sort((a, b) => voiceScore(b) - voiceScore(a))[0] || null;
}

export const SPEAK_RATES = [
  { id: "very-slow", label: "Bem lenta", hint: "palavra por palavra", rate: 0.5, pitch: 0.92, pauseMs: 380 },
  { id: "slow", label: "Lenta", hint: "pausada", rate: 0.62, pitch: 0.96, pauseMs: 0 },
  { id: "normal", label: "Normal", hint: "conversa", rate: 0.88, pitch: 1, pauseMs: 0 },
  { id: "fast", label: "Rápida", hint: "mais fluente", rate: 1.2, pitch: 1.04, pauseMs: 0 },
];

export function rateById(id?: string) {
  return SPEAK_RATES.find((item) => item.id === id) || SPEAK_RATES[0];
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

let speakToken = 0;

function speakOnce(text: string, rate: number, pitch = 1) {
  return new Promise<void>((resolve, reject) => {
    if (!canSpeak()) {
      reject(new Error("Este navegador não lê em voz alta."));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    const voice = pickEnglishVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("Não consegui reproduzir o áudio."));
    window.speechSynthesis.speak(utterance);
  });
}

export function canSpeak() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function canListen() {
  return typeof window !== "undefined" && Boolean(SpeechRecognition) && window.isSecureContext;
}

export async function speakEnglish(text: string, options: { rateId?: string } = {}) {
  const preset = rateById(options.rateId);
  const token = (speakToken += 1);
  window.speechSynthesis?.cancel();
  await wait(50);
  if (token !== speakToken) return;

  if (preset.pauseMs) {
    const parts = text.split(/\s+/).filter(Boolean);
    for (let i = 0; i < parts.length; i += 1) {
      if (token !== speakToken) return;
      await speakOnce(parts[i].replace(/[.,!?;:]+$/g, ""), preset.rate, preset.pitch);
      if (i < parts.length - 1) await wait(preset.pauseMs);
    }
    return;
  }

  if (token !== speakToken) return;
  await speakOnce(text, preset.rate, preset.pitch);
}

export function listenOnce({ lang = "en-US", timeoutMs = 8000 }: { lang?: string; timeoutMs?: number } = {}) {
  return new Promise<string>((resolve, reject) => {
    if (!canListen() || !SpeechRecognition) {
      reject(
        new Error(
          "Para treinar a fala, abra o app no Chrome ou Edge e permita o microfone."
        )
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.continuous = false;

    let settled = false;
    const doneOk = (text: string) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(text);
    };
    const doneErr = (error: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    };

    const timer = setTimeout(() => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      doneErr(new Error("Não ouvi nada. Fale mais perto do microfone."));
    }, timeoutMs);

    recognition.onresult = (event) => {
      const result = event.results[0];
      const text = result?.[0]?.transcript?.trim() || "";
      doneOk(text);
    };

    recognition.onerror = (event) => {
      const messages: Record<string, string> = {
        "not-allowed": "Permita o microfone no navegador para treinar a fala.",
        "no-speech": "Não ouvi nada. Tente de novo, um pouco mais alto.",
        "audio-capture": "Não encontrei um microfone.",
        network: "O reconhecimento de voz precisa de internet neste navegador.",
      };
      doneErr(new Error(messages[event.error] || "Não consegui ouvir. Tente outra vez."));
    };

    recognition.onend = () => {
      doneErr(new Error("Não ouvi uma frase completa. Tente de novo."));
    };

    try {
      recognition.start();
    } catch {
      doneErr(new Error("O microfone já está em uso. Espere um segundo e tente de novo."));
    }
  });
}

if (typeof window !== "undefined" && canSpeak()) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", pickEnglishVoice);
}
