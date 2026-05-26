// Topic and article-kind metadata shared across the UI.

export const TOPICS: Record<string, { label: string; color: string }> = {
  security: { label: "National security", color: "#0072ce" },
  defence: { label: "Defence", color: "#1f6f3f" },
  cyber: { label: "Cyber", color: "#6b3fa0" },
  "foreign-affairs": { label: "Foreign affairs", color: "#0a558c" },
  economy: { label: "Economy", color: "#b06e00" },
  domestic: { label: "Domestic", color: "#5a6470" },
  eu: { label: "EU & NATO", color: "#13328a" },
};

export const TOPIC_KEYS = Object.keys(TOPICS);

export function topicLabel(topic?: string | null): string | null {
  if (!topic) return null;
  return TOPICS[topic]?.label ?? topic;
}

export function topicColor(topic?: string | null): string {
  if (!topic) return "#5a6470";
  return TOPICS[topic]?.color ?? "#5a6470";
}

export const KINDS: Record<string, string> = {
  "press-release": "Press release",
  statement: "Statement",
  news: "News",
  decision: "Government decision",
  speech: "Speech",
};

export const KIND_KEYS = Object.keys(KINDS);

export function kindLabel(kind?: string | null): string {
  if (!kind) return "News";
  return KINDS[kind] ?? kind;
}
