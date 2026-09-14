import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router";
import { Globe, Mic, MicOff, Send, Sparkles, X } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { usePreferences } from "@/providers/preferences";
import { track, trackOnce } from "@/lib/analytics";
import { SITE_CONFIG } from "@/config/site";
import { HELP_ARTICLES } from "@/content/help";
import { greetingAudioUrl } from "./greeting-audio";
import { localAssistantReply } from "./local-answer";
import {
  browserVoiceSupported,
  recognitionConstructor,
  speakBrowser,
  voiceLanguage,
  type VoiceRecognition,
  type VoiceRecognitionErrorEvent,
  type VoiceRecognitionEvent,
} from "./voice";

/**
 * LENA Assistant — the visitor help bot.
 *
 * The assistant answers from the verified help corpus only (see
 * AI_FEATURE_SYSTEM.md §11). The API keys are server-side; this widget knows
 * nothing about Gemini and works identically in both modes (generative and
 * deterministic fallback) — the mode is an operational detail, not a UI state.
 *
 * All tRPC hooks live inside the panel component, which mounts only when the
 * visitor opens the assistant: the FAB stays provider-free, and pages rendered
 * outside the app's TRPCProvider (isolated route tests, embeds) never touch it.
 */

const COPY = {
  ar: {
    fabLabel: "افتح مساعد لينا",
    closeLabel: "أغلق مساعد لينا",
    title: "مساعد لينا",
    subtitle: "يجيب من صفحات المساعدة الموثقة",
    greetingTime: { morning: "صباح الخير ☀️", afternoon: "مساء الخير 👋", evening: "مساء الخير 🌙" },
    greeting:
      "أنا مساعد لينا الآلي، ويسعدني وجودك هنا. اسألني عن طريقة البدء، التكلفة، موعد الرد، أو بياناتك — وسأجيبك من المحتوى الموثق. جرّب أحد الأسئلة التالية أو اكتب سؤالك:",
    teaser: "أهلًا بك في LENA 👋\nاسأل عن أنظمتنا.",
    teaserClose: "إخفاء الترحيب",
    inputLabel: "اكتب سؤالك",
    inputPlaceholder: "اكتب سؤالك هنا…",
    send: "إرسال",
    disclosure: "مساعد آلي — الصوت يستخدم ميكروفون المتصفح، وللرد المؤكد من إنسان تواصل عبر واتساب.",
    whatsapp: "واتساب",
    rateLimited: "وصلت إلى الحد المؤقت للمحادثة. تواصل معنا على واتساب مباشرة وسنرد فورًا.",
    error: "تعذّر إرسال الرسالة الآن. أعد المحاولة أو تواصل معنا على واتساب.",
    voiceStart: "ابدأ المحادثة الصوتية",
    voiceStop: "أوقف المحادثة الصوتية",
    voiceListening: "أستمع إليك…",
    voiceThinking: "أجهز الإجابة…",
    voiceSpeaking: "أتحدث الآن…",
    voiceUnsupported: "المتصفح لا يدعم المحادثة الصوتية. يمكنك استخدام الكتابة أو تجربة Chrome أو Safari.",
    voicePermission: "اسمح باستخدام الميكروفون من إعدادات المتصفح ثم حاول مرة أخرى.",
    voiceError: "تعذّر تشغيل الميكروفون الآن. جرّب مرة أخرى أو استخدم الكتابة.",
    sourceLabel: "من المساعدة:",
  },
  en: {
    fabLabel: "Open the LENA assistant",
    closeLabel: "Close the LENA assistant",
    title: "LENA assistant",
    subtitle: "Answers from the verified help pages",
    greetingTime: { morning: "Good morning ☀️", afternoon: "Good afternoon 👋", evening: "Good evening 🌙" },
    greeting:
      "I am LENA's automated assistant, and I am glad you are here. Ask me about getting started, cost, reply times, or your data — I answer from the verified content. Try one of these or write your own question:",
    teaser: "Welcome to LENA 👋\nAsk about our systems.",
    teaserClose: "Dismiss the welcome",
    inputLabel: "Write your question",
    inputPlaceholder: "Type your question…",
    send: "Send",
    disclosure: "Automated assistant — voice uses your browser microphone; for a confirmed human reply, reach us on WhatsApp.",
    whatsapp: "WhatsApp",
    rateLimited: "You have reached the temporary conversation limit. Message us on WhatsApp and we will reply right away.",
    error: "The message could not be sent right now. Try again or reach us on WhatsApp.",
    voiceStart: "Start voice chat",
    voiceStop: "Stop voice chat",
    voiceListening: "Listening…",
    voiceThinking: "Preparing an answer…",
    voiceSpeaking: "Speaking now…",
    voiceUnsupported: "This browser does not support voice chat. You can type instead, or try Chrome or Safari.",
    voicePermission: "Allow microphone access in your browser settings, then try again.",
    voiceError: "The microphone could not start. Try again or use text chat.",
    sourceLabel: "From the help pages:",
  },
} as const;

/** Time-of-day opening line — the visitor's local clock: morning / afternoon / evening. */
function greetingTime(copy: (typeof COPY)["ar" | "en"]): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return copy.greetingTime.morning;
  if (hour >= 12 && hour < 17) return copy.greetingTime.afternoon;
  return copy.greetingTime.evening;
}

/** Welcome teaser: once per browser session, a few seconds after arrival. */
const TEASER_DELAY_MS = 4_200;
const TEASER_SESSION_KEY = "lena-digital-house.assistant-teaser";

/** Spoken welcome: also once per session, at the same moment as the teaser. */
const GREETING_SESSION_KEY = "lena-digital-house.assistant-greeting";

function sessionFlagged(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function setSessionFlag(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* storage unavailable — the greeting may replay on the next visit */
  }
}

/** Curated starter questions — the ones the help page organises its answers around. */
const SUGGESTED_IDS = ["systems-overview", "malek-system", "assistant-voice-chat", "evidence-status", "how-to-start"] as const;

type AssistantSource = { id: string; question: string; to?: string; label?: string };

type ChatMessage = {
  role: "visitor" | "assistant";
  text: string;
  sources?: AssistantSource[];
};

type VoiceStatus = "idle" | "listening" | "thinking" | "speaking" | "error";

export default function LenaAssistant() {
  const { locale } = usePreferences();
  const { pathname } = useLocation();
  const copy = COPY[locale];
  const [open, setOpen] = useState(false);
  const [teaserVisible, setTeaserVisible] = useState(false);

  // Spoken welcome: the assistant greets the visitor out loud as soon as the
  // browser allows. Autoplay policies block sound before the visitor's first
  // interaction, so a refused attempt arms one-shot fallback listeners — the
  // greeting then plays on the visitor's very first tap or key press. Either
  // way it happens at most once per session.
  useEffect(() => {
    if (typeof window.Audio !== "function") return;
    if (sessionFlagged(GREETING_SESSION_KEY)) return;

    let cancelled = false;
    let audio: HTMLAudioElement | null = null;
    let played = false;
    let blocked = false;

    const removeInteractionListeners = () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };

    const play = () => {
      if (cancelled || played || sessionFlagged(GREETING_SESSION_KEY)) return;
      audio ??= new Audio(greetingAudioUrl(locale));
      const attempt = audio.play();
      if (!attempt) {
        blocked = true;
        return;
      }
      attempt.then(
        () => {
          if (cancelled) {
            audio?.pause();
            return;
          }
          played = true;
          removeInteractionListeners();
          setSessionFlag(GREETING_SESSION_KEY);
          track("assistant_greeting_played", { locale, outcome: "success" });
        },
        () => {
          blocked = true;
        },
      );
    };

    const onFirstInteraction = () => {
      if (!blocked) return;
      blocked = false;
      play();
    };

    const timer = setTimeout(() => {
      if (cancelled) return;
      play();
      window.addEventListener("pointerdown", onFirstInteraction);
      window.addEventListener("keydown", onFirstInteraction);
    }, TEASER_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      removeInteractionListeners();
      audio?.pause();
    };
  }, [locale]);

  // Proactive welcome bubble: a short, dismissible greeting at the same
  // moment as the spoken one — once per browser session, never while the
  // panel is open.
  useEffect(() => {
    setTeaserVisible(false);
    if (sessionFlagged(TEASER_SESSION_KEY)) return;

    // On a narrow viewport the teaser competes with the actual product proof.
    // Keep the assistant discoverable through its FAB, but reserve the first
    // screen for the Hero, systems, and contact actions. The same applies to
    // tablet widths where the Rose Engine takes the full row.
    if (window.matchMedia("(max-width: 1050px)").matches) {
      setSessionFlag(TEASER_SESSION_KEY);
      return;
    }

    // World is already a dense evidence register; its fixed teaser would sit
    // over the ledger plates. The FAB remains available, and the welcome can
    // still appear later if the visitor returns to a calmer public surface.
    if (/\/world(?:\/|$)/.test(pathname)) return;

    const timer = setTimeout(() => {
      setTeaserVisible(true);
      trackOnce("assistant_teaser_shown", "assistant_teaser_shown", { locale });
    }, TEASER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [locale, pathname]);

  function dismissTeaser() {
    setTeaserVisible(false);
    setSessionFlag(TEASER_SESSION_KEY);
  }

  function openPanel() {
    setOpen(true);
    dismissTeaser();
  }

  return (
    <>
      <button
        type="button"
        className="lena-assistant-fab"
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label={open ? copy.closeLabel : copy.fabLabel}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Sparkles size={20} />}
      </button>
      {!open && teaserVisible && (
        <div className="lena-assistant-teaser" dir={locale === "ar" ? "rtl" : "ltr"} role="status">
          <button type="button" className="lena-assistant-teaser-close" onClick={dismissTeaser} aria-label={copy.teaserClose}>
            <X size={13} />
          </button>
          <button type="button" className="lena-assistant-teaser-body" onClick={openPanel}>
            {copy.teaser}
          </button>
        </div>
      )}
      {open && <AssistantPanel locale={locale} onClose={() => setOpen(false)} />}
    </>
  );
}

function AssistantPanel({ locale, onClose }: { locale: "ar" | "en"; onClose: () => void }) {
  const copy = COPY[locale];
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: `${greetingTime(copy)} ${copy.greeting}` },
  ]);
  const [draft, setDraft] = useState("");
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>("idle");
  const [voiceError, setVoiceError] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<VoiceRecognition | null>(null);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelSpeechRef = useRef<(() => void) | null>(null);
  const voiceModeRef = useRef(false);
  const waitingForAnswerRef = useRef(false);
  const sendRef = useRef<(text: string, source: "text" | "voice") => void>(() => undefined);
  const [voiceSupported] = useState(() => browserVoiceSupported());

  const suggestions = useMemo(
    () =>
      SUGGESTED_IDS.map((id) => HELP_ARTICLES.find((article) => article.id === id)).filter(
        (article) => article !== undefined,
      ),
    [],
  );

  const status = trpc.assistant.status.useQuery(undefined, { staleTime: 60_000 });
  const ask = trpc.assistant.ask.useMutation();

  useEffect(() => {
    trackOnceOpened();
    function trackOnceOpened() {
      track("assistant_opened", { locale });
    }
  }, [locale]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, ask.isPending]);

  function clearRestartTimer() {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }

  function scheduleListening(delayMs = 180) {
    clearRestartTimer();
    if (!voiceModeRef.current || waitingForAnswerRef.current) return;

    restartTimerRef.current = setTimeout(() => {
      restartTimerRef.current = null;
      if (!voiceModeRef.current || waitingForAnswerRef.current) return;
      const recognition = recognitionRef.current;
      if (!recognition) return;
      try {
        recognition.start();
      } catch {
        // Browsers can briefly report "already started" between onend and the
        // next turn. The active recogniser will emit onstart in that case.
      }
    }, delayMs);
  }

  function ensureRecognition(): VoiceRecognition | null {
    if (recognitionRef.current) return recognitionRef.current;
    const Constructor = recognitionConstructor();
    if (!Constructor) return null;

    let recognition: VoiceRecognition;
    try {
      recognition = new Constructor();
    } catch {
      return null;
    }
    recognition.lang = voiceLanguage(locale);
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      if (voiceModeRef.current && !waitingForAnswerRef.current) {
        setVoiceStatus("listening");
        setVoiceError("");
      }
    };
    recognition.onresult = (event: VoiceRecognitionEvent) => {
      let interim = "";
      let finalText = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]?.[0];
        if (!result) continue;
        if (event.results[index]?.isFinal) finalText += result.transcript;
        else interim += result.transcript;
      }

      if (interim.trim()) setDraft(interim.trim());
      if (!finalText.trim() || waitingForAnswerRef.current) return;

      const question = finalText.trim();
      waitingForAnswerRef.current = true;
      setDraft(question);
      setVoiceStatus("thinking");
      try {
        recognition.stop();
      } catch {
        /* the recogniser may already be ending */
      }
      sendRef.current(question, "voice");
    };
    recognition.onerror = (event: VoiceRecognitionErrorEvent) => {
      if (!voiceModeRef.current || event.error === "aborted") return;
      if (event.error === "no-speech") {
        scheduleListening();
        return;
      }

      waitingForAnswerRef.current = false;
      voiceModeRef.current = false;
      setVoiceMode(false);
      setVoiceStatus("error");
      setVoiceError(event.error === "not-allowed" || event.error === "service-not-allowed" ? copy.voicePermission : copy.voiceError);
    };
    recognition.onend = () => {
      if (voiceModeRef.current && !waitingForAnswerRef.current) scheduleListening();
    };
    recognitionRef.current = recognition;
    return recognition;
  }

  function listenAgain() {
    waitingForAnswerRef.current = false;
    if (!voiceModeRef.current) return;
    setVoiceStatus("listening");
    scheduleListening();
  }

  function speakAnswer(answer: string) {
    if (!voiceModeRef.current) return;
    cancelSpeechRef.current?.();
    cancelSpeechRef.current = null;
    setVoiceStatus("speaking");
    const cancellation = speakBrowser(answer, locale, {
      onEnd: () => {
        cancelSpeechRef.current = null;
        listenAgain();
      },
      onError: () => {
        cancelSpeechRef.current = null;
        listenAgain();
      },
    });
    cancelSpeechRef.current = cancellation;
    if (!cancellation) listenAgain();
  }

  function stopVoice() {
    voiceModeRef.current = false;
    waitingForAnswerRef.current = false;
    clearRestartTimer();
    try {
      recognitionRef.current?.abort();
    } catch {
      /* microphone already released */
    }
    recognitionRef.current = null;
    cancelSpeechRef.current?.();
    cancelSpeechRef.current = null;
    setVoiceMode(false);
    setVoiceStatus("idle");
    setVoiceError("");
  }

  function startVoice() {
    if (!voiceSupported) {
      setVoiceStatus("error");
      setVoiceError(copy.voiceUnsupported);
      return;
    }

    const recognition = ensureRecognition();
    if (!recognition) {
      setVoiceStatus("error");
      setVoiceError(copy.voiceUnsupported);
      return;
    }

    setVoiceError("");
    setDraft("");
    voiceModeRef.current = true;
    waitingForAnswerRef.current = false;
    setVoiceMode(true);
    setVoiceStatus("listening");
    try {
      recognition.start();
    } catch {
      // A double click can hit the short transition between recogniser turns.
      scheduleListening(300);
    }
  }

  function toggleVoice() {
    if (voiceMode) stopVoice();
    else startVoice();
  }

  function send(text: string, source: "text" | "voice" = "text") {
    const trimmed = text.trim();
    if (!trimmed || ask.isPending) return;
    const history = messages.slice(-6).map((message) => ({ role: message.role, content: message.text }));
    const shouldSpeak = source === "voice";
    if (shouldSpeak) {
      waitingForAnswerRef.current = true;
      setVoiceStatus("thinking");
      try {
        recognitionRef.current?.stop();
      } catch {
        /* the recogniser may already be ending */
      }
    }
    setMessages((current) => [...current, { role: "visitor", text: trimmed }]);
    setDraft("");
    ask.mutate(
      { message: trimmed, locale, history },
      {
        onSuccess: (data) => {
          setMessages((current) => [...current, { role: "assistant", text: data.answer, sources: data.sources }]);
          track("assistant_asked", { locale, query_length: trimmed.length, outcome: "success", context: data.mode });
          if (shouldSpeak) speakAnswer(data.answer);
        },
        onError: (error) => {
          const rateLimited = error.data?.code === "TOO_MANY_REQUESTS";
          if (rateLimited) {
            setMessages((current) => [...current, { role: "assistant", text: copy.rateLimited }]);
            track("assistant_asked", {
              locale,
              query_length: trimmed.length,
              outcome: "failure",
              reason: "rate_limited",
            });
            if (shouldSpeak) stopVoice();
            return;
          }
          const local = localAssistantReply(trimmed, locale);
          setMessages((current) => [
            ...current,
            { role: "assistant", text: local.answer, sources: local.sources },
          ]);
          track("assistant_asked", {
            locale,
            query_length: trimmed.length,
            outcome: "success",
            context: "client_fallback",
          });
          if (shouldSpeak) speakAnswer(local.answer);
        },
      },
    );
  }

  sendRef.current = send;

  useEffect(() => {
    return () => {
      voiceModeRef.current = false;
      waitingForAnswerRef.current = false;
      clearRestartTimer();
      try {
        recognitionRef.current?.abort();
      } catch {
        /* component is unmounting */
      }
      cancelSpeechRef.current?.();
      recognitionRef.current = null;
      cancelSpeechRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (voiceModeRef.current) stopVoice();
  }, [locale]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    send(draft, voiceModeRef.current ? "voice" : "text");
  }

  return (
    <section className="lena-assistant-panel" dir={locale === "ar" ? "rtl" : "ltr"} aria-label={copy.title}>
      <header className="lena-assistant-head">
        <span className="lena-assistant-orb" aria-hidden="true">
          <Sparkles size={16} />
        </span>
        <div className="lena-assistant-titles">
          <strong>{copy.title}</strong>
          <small>
            {status.data?.model ? (
              <>
                <Globe size={10} /> {copy.subtitle}
              </>
            ) : (
              copy.subtitle
            )}
          </small>
        </div>
        <button type="button" className="lena-assistant-close" onClick={onClose} aria-label={copy.closeLabel}>
          <X size={16} />
        </button>
      </header>

      <div className="lena-assistant-log" ref={logRef}>
        {messages.map((message, index) => (
          <div key={index} className={`lena-assistant-msg ${message.role === "visitor" ? "is-visitor" : "is-assistant"}`}>
            <p>{message.text}</p>
            {message.sources && message.sources.length > 0 && (
              <div className="lena-assistant-sources">
                <small>{copy.sourceLabel}</small>
                {message.sources.slice(0, 2).map((source) =>
                  source.to && source.label ? (
                    <Link key={source.id} to={source.to}>
                      {source.label}
                    </Link>
                  ) : (
                    <span key={source.id}>{source.question}</span>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
        {ask.isPending && (
          <div className="lena-assistant-msg is-assistant is-pending">
            <p>…</p>
          </div>
        )}
        {messages.length <= 1 && (
          <div className="lena-assistant-chips">
            {suggestions.map((article) => (
              <button key={article.id} type="button" onClick={() => send(article.question[locale])}>
                {article.question[locale]}
              </button>
            ))}
          </div>
        )}
      </div>

      {(voiceMode || voiceError) && (
        <div className={`lena-assistant-voice-status ${voiceError ? "is-error" : ""}`} role="status" aria-live="polite">
          <span className="lena-assistant-voice-dot" aria-hidden="true" />
          {voiceError ||
            (voiceStatus === "listening"
              ? copy.voiceListening
              : voiceStatus === "thinking"
                ? copy.voiceThinking
                : copy.voiceSpeaking)}
        </div>
      )}

      <form className="lena-assistant-input" onSubmit={onSubmit}>
        <label className="lena-assistant-sr" htmlFor="lena-assistant-field">
          {copy.inputLabel}
        </label>
        <input
          id="lena-assistant-field"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={voiceMode ? copy.voiceListening : copy.inputPlaceholder}
          maxLength={800}
          autoComplete="off"
        />
        <button
          type="button"
          className={`lena-assistant-mic ${voiceMode ? "is-active" : ""}`}
          onClick={toggleVoice}
          aria-label={voiceMode ? copy.voiceStop : copy.voiceStart}
          aria-pressed={voiceMode}
          title={voiceMode ? copy.voiceStop : copy.voiceStart}
        >
          {voiceMode ? <MicOff size={17} /> : <Mic size={17} />}
        </button>
        <button type="submit" disabled={ask.isPending || draft.trim().length === 0} aria-label={copy.send}>
          <Send size={16} />
        </button>
      </form>

      <footer className="lena-assistant-note">
        <small>{copy.disclosure}</small>
        <a
          href={SITE_CONFIG.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("contact_channel_opened", { channel: "whatsapp", surface: "assistant" })}
        >
          {copy.whatsapp}
        </a>
      </footer>
    </section>
  );
}
