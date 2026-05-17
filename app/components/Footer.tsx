import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer style={{ borderTop: '0.5px solid var(--m-border)' }}>
      <div className="px-6 py-8 max-w-2xl mx-auto flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

        <Link href="/" className="transition-opacity hover:opacity-80 self-start">
          <Logo />
        </Link>

        <div className="flex flex-col gap-4 sm:items-end">

          <div className="flex items-center gap-5">
            <Link
              href="/how-it-works"
              className="text-xs transition-opacity hover:opacity-70"
              style={{ color: 'var(--m-text-muted)' }}
            >
              How it works
            </Link>
            <Link
              href="/pricing"
              className="text-xs transition-opacity hover:opacity-70"
              style={{ color: 'var(--m-text-muted)' }}
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://x.com/miroki_app"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}
              aria-label="X / Twitter"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--m-text-secondary)' }}>
                <path d="M17.5 4h2.5l-5.5 6.3L21 20h-5l-3.7-4.8L8 20H5.5l5.8-6.6L4 4h5.1l3.4 4.4L17.5 4zm-.9 14.4h1.4L7.5 5.4H6z"/>
              </svg>
            </a>

            <a
              href="https://www.producthunt.com/products/miroki"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}
              aria-label="Product Hunt"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--m-text-secondary)' }}>
                <path d="M13.5 9H10V12H13.5C14.3 12 15 11.3 15 10.5C15 9.7 14.3 9 13.5 9Z"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 7H13.5C15.43 7 17 8.57 17 10.5C17 12.43 15.43 14 13.5 14H10V17H8V7Z"/>
              </svg>
            </a>

            <a
              href="https://github.com/diego9621/miroki"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}
              aria-label="GitHub"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--m-text-secondary)' }}>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          </div>

          <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>
            © 2025 Miroki
          </p>
        </div>

      </div>
    </footer>
  )
}