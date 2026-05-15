export function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return (localStorage.getItem('miroki-theme') as 'light' | 'dark') ?? 'dark'
}

export function setTheme(theme: 'light' | 'dark') {
  localStorage.setItem('miroki-theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
}

export function initTheme() {
  const theme = getTheme()
  document.documentElement.setAttribute('data-theme', theme)
}