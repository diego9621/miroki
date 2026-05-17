export function generatePublicId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const random = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `mrk_${random}`
}