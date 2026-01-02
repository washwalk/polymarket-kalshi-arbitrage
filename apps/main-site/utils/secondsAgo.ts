export function secondsAgo(updatedAt: number): string {
  const delta = Math.max(0, Math.floor(Date.now() / 1000 - updatedAt))

  if (delta < 5) return "just now"
  if (delta < 60) return `${delta}s ago`
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`
  return `${Math.floor(delta / 3600)}h ago`
}