/**
 * Format a timestamp into a short, human-friendly "relative" string.
 * e.g. "just now", "3m ago", "2h ago", "yesterday", "Mar 14".
 */
export function timeAgo(input: Date | string | number): string {
  const d = typeof input === 'string' || typeof input === 'number' ? new Date(input) : input
  const diff = Date.now() - d.getTime()
  const sec = Math.round(diff / 1000)

  if (sec < 5) return 'just now'
  if (sec < 60) return `${sec}s ago`
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.round(hr / 24)
  if (day === 1) return 'yesterday'
  if (day < 7) return `${day}d ago`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' })
}
