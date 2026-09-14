/**
 * Browser voice bridge for the assistant.
 *
 * This deliberately uses the browser's Web Speech APIs instead of adding a
 * second paid provider or sending microphone bytes through our server. The
 * assistant still receives only the recognised transcript through the same
 * grounded text endpoint. Browsers differ in support, so callers must handle a
 * missing recogniser and keep the typed chat path available.
 */

export type VoiceRecognitionResult = {
  isFinal: boolean;
  transcript: string;
};

export type VoiceRecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: VoiceRecognitionResult }>;
};

export type VoiceRecognitionErrorEvent = {
  error: string;
};

export type VoiceRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((event: VoiceRecognitionEvent) => void) | null;
  onerror: ((event: VoiceRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type VoiceRecognitionConstructor = new () => VoiceRecognition;

type SpeechWindow = Window & {
  SpeechRecognition?: VoiceRecognitionConstructor;
  webkitSpeechRecognition?: VoiceRecognitionConstructor;
};

export function recognitionConstructor(): VoiceRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const speechWindow = window as SpeechWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
}

export function browserVoiceSupported(): boolean {
  return Boolean(recognitionConstructor()) &&
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    typeof SpeechSynthesisUtterance === "function";
}

export function voiceLanguage(locale: "ar" | "en"): string {
  // Keep the site locale region-neutral; the browser selects the best voice
  // available for the visitor's own language settings.
  return locale;
}

/** Keep browser speech from reading URL syntax and line-break punctuation aloud. */
export function spokenText(text: string): string {
  return text
    .replace(/https?:\/\/\S+/gi, "")
    .replace(/[\u0000-\u001F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

type SpeechCallbacks = {
  onEnd: () => void;
  onError: () => void;
};

/**
 * Speak one assistant answer. Returns a cancellation function, or null when
 * speech output is unavailable. The caller owns the voice-mode state.
 */
export function speakBrowser(
  text: string,
  locale: "ar" | "en",
  callbacks: SpeechCallbacks,
): (() => void) | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance !== "function") {
    callbacks.onError();
    return null;
  }

  const synthesis = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(spokenText(text));
  utterance.lang = voiceLanguage(locale);
  utterance.rate = locale === "ar" ? 0.94 : 0.98;
  utterance.pitch = 1;

  const voice = synthesis
    .getVoices()
    .find((candidate) => candidate.lang.toLowerCase().startsWith(locale));
  if (voice) utterance.voice = voice;

  let cancelled = false;
  utterance.onend = () => {
    if (!cancelled) callbacks.onEnd();
  };
  utterance.onerror = () => {
    if (!cancelled) callbacks.onError();
  };

  try {
    synthesis.cancel();
    synthesis.speak(utterance);
  } catch {
    callbacks.onError();
    return null;
  }

  return () => {
    cancelled = true;
    utterance.onend = null;
    utterance.onerror = null;
    synthesis.cancel();
  };
}
