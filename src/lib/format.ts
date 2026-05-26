// Estonian-style long date, e.g. "26 May 2026"
export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${formatDate(date)}, ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

// For <time dateTime="..."> attributes
export function isoDate(d: Date | string): string {
  return (typeof d === "string" ? new Date(d) : d).toISOString();
}
