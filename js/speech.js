const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function pickEnglishVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  return (
    voices.find((voice) => /en-US/i.test(voice.lang) && /google|aria|jenny|neural/i.test(voice.name)) ||
    voices.find((voice) => /^en[-_]/i.test(voice.lang)) ||
    null
  );
}

export function canSpeak() {
  return "speechSynthesis" in window;
}

export function canListen() {
  return Boolean(SpeechRecognition) && window.isSecureContext;
}

export function speakEnglish(text) {
  return new Promise((resolve, reject) => {
    if (!canSpeak()) {
      reject(new Error("Este navegador não lê em voz alta."));
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    const voice = pickEnglishVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("Não consegui reproduzir o áudio."));
    window.speechSynthesis.speak(utterance);
  });
}

export function listenOnce({ lang = "en-US", timeoutMs = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!canListen()) {
      reject(
        new Error(
          "Para treinar a fala, abra o app no Chrome ou Edge pelo endereço local (não pelo arquivo)."
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
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };

    const timer = setTimeout(() => {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      finish(reject, new Error("Não ouvi nada. Fale mais perto do microfone."));
    }, timeoutMs);

    recognition.onresult = (event) => {
      const result = event.results[0];
      const text = result?.[0]?.transcript?.trim() || "";
      finish(resolve, text);
    };

    recognition.onerror = (event) => {
      const messages = {
        "not-allowed": "Permita o microfone no navegador para treinar a fala.",
        "no-speech": "Não ouvi nada. Tente de novo, um pouco mais alto.",
        "audio-capture": "Não encontrei um microfone.",
        network: "O reconhecimento de voz precisa de internet neste navegador.",
      };
      finish(reject, new Error(messages[event.error] || "Não consegui ouvir. Tente outra vez."));
    };

    recognition.onend = () => {
      finish(reject, new Error("Não ouvi uma frase completa. Tente de novo."));
    };

    try {
      recognition.start();
    } catch {
      finish(reject, new Error("O microfone já está em uso. Espere um segundo e tente de novo."));
    }
  });
}

if (canSpeak()) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", pickEnglishVoice);
}
