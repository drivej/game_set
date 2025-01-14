export function formatDuration(seconds?: number | null): string {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  const secs = Math.floor(seconds);
  const h = Math.floor(secs / (60 * 60));
  const m = Math.floor(secs / 60 - h * 60);
  const s = secs % 60;
  return `${h > 0 ? h + ':' : ''}${h > 0 ? pad(m) : m}:${pad(s)}`;
}
