import { HELP_ARTICLES, type HelpArticle, type SupportedLocale } from "@/content/help";

/**
 * Deterministic on-device answer from the same verified help corpus the API
 * uses. The public assistant must still reply when the function is down.
 */

type AssistantSource = { id: string; question: string; to?: string; label?: string };

function normaliseText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/[\u0622\u0623\u0625\u0627]/g, "\u0627")
    .replace(/\u0649/g, "\u064A")
    .replace(/\u0629/g, "\u0647");
}

const STOPWORDS = new Set([
  "في", "من", "على", "الي", "عن", "مع", "هل", "ما", "ماذا", "كيف", "متي", "اين", "لماذا",
  "هو", "هي", "هما", "ان", "إن", "اذا", "لكن", "او", "أو", "ثم", "قد", "لا", "لم", "لن",
  "انا", "انت", "انتم", "نحن", "كل", "بعد", "قبل", "عند", "هنا", "هناك", "يوم", "الان",
  "اريد", "أريد", "ممكن", "لو", "لقد", "به", "لها", "له", "هذا", "هذه", "ذلك",
  "the", "a", "an", "is", "are", "am", "do", "does", "did", "how", "what", "when", "where",
  "why", "who", "i", "you", "my", "your", "we", "our", "to", "of", "in", "on", "for", "with",
  "and", "or", "it", "its", "this", "that", "can", "will", "would", "should", "if", "at",
  "be", "been", "was", "were", "have", "has", "get", "got", "me", "about", "from", "by",
]);

function stemToken(token: string): string {
  if (/[\u0600-\u06FF]/.test(token)) {
    return token.length > 3 && token.startsWith("\u0627\u0644") ? token.slice(2) : token;
  }
  if (token.length <= 3) return token;
  if (token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.endsWith("ing")) return token.slice(0, -3);
  if (token.endsWith("es")) return token.slice(0, -2);
  if (token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  if (token.endsWith("e")) return token.slice(0, -1);
  return token;
}

function tokenize(text: string): string[] {
  return normaliseText(text)
    .split(/[^\p{L}\p{N}#]+/u)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
    .map(stemToken);
}

function scoreArticle(article: HelpArticle, messageTokens: string[]): number {
  if (messageTokens.length === 0) return 0;
  const questionTokens = new Set([...tokenize(article.question.ar), ...tokenize(article.question.en)]);
  const answerTokens = new Set([...tokenize(article.answer.ar), ...tokenize(article.answer.en)]);
  let score = 0;
  for (const token of messageTokens) {
    if (questionTokens.has(token)) score += 3;
    else if (answerTokens.has(token)) score += 1;
  }
  return score / Math.sqrt(messageTokens.length);
}

const FALLBACK_POINTER: Record<SupportedLocale, string> = {
  ar: "لم أجد إجابة موثقة لسؤالك في محتوى المساعدة. راسلنا على واتساب أو من نموذج «ابدأ مشروعك» وسيرد عليك إنسان خلال يوم عمل واحد.",
  en: "I could not find a documented answer to your question in the help content. Message us on WhatsApp or through the “Start a project” form and a human will reply within one business day.",
};

const CLOSING: Record<SupportedLocale, string> = {
  ar: "إن لم يكن هذا سؤالك بالضبط، راسلنا على واتساب وسيرد عليك إنسان خلال يوم عمل واحد.",
  en: "If this is not exactly your question, message us on WhatsApp and a human will reply within one business day.",
};

function sourceEntry(article: HelpArticle, locale: SupportedLocale): AssistantSource {
  return {
    id: article.id,
    question: article.question[locale],
    to: article.link?.to,
    label: article.link?.label[locale],
  };
}

/** Same shape the API returns — quote matching help articles, or the documented pointer. */
export function localAssistantReply(
  message: string,
  locale: SupportedLocale,
): { answer: string; sources: AssistantSource[] } {
  const tokens = tokenize(message);
  const matches = HELP_ARTICLES.map((article) => ({ article, score: scoreArticle(article, tokens) }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  if (matches.length === 0) {
    return { answer: FALLBACK_POINTER[locale], sources: [] };
  }

  const parts = matches.map((match) => `${match.article.question[locale]}\n${match.article.answer[locale]}`);
  return {
    answer: [...parts, CLOSING[locale]].join("\n\n"),
    sources: matches.map((match) => sourceEntry(match.article, locale)),
  };
}
