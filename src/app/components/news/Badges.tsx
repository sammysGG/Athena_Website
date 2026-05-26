import { kindLabel, topicColor, topicLabel } from "@/lib/taxonomy";

export function TopicBadge({ topic }: { topic?: string | null }) {
  const label = topicLabel(topic);
  if (!label) return null;
  return (
    <span
      className="inline-block text-[0.7rem] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-sm text-white"
      style={{ backgroundColor: topicColor(topic) }}
    >
      {label}
    </span>
  );
}

export function KindBadge({ kind }: { kind?: string | null }) {
  return (
    <span className="inline-block text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
      {kindLabel(kind)}
    </span>
  );
}
