'use client'

import Logo from './components/Logo'
import ThemeToggle from './components/ThemeToggle'

export default function NotFound() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--m-bg)' }}>

      <nav style={{ borderBottom: '0.5px solid var(--m-border)' }}>
        <div className="flex justify-between items-center px-6 py-5 max-w-2xl mx-auto">
          <button onClick={() => window.location.href = '/'} className="transition-opacity hover:opacity-80">
            <Logo />
          </button>
          <ThemeToggle />
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center px-6 py-32 max-w-2xl mx-auto text-center">
        <div
          className="flex items-center justify-center w-14 h-14 rounded-2xl mb-8"
          style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}
        >
          <svg className="w-6 h-6" style={{ color: 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </div>

        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--m-text-muted)' }}>
          404
        </p>

        <h1 className="text-3xl font-semibold tracking-tight mb-4" style={{ color: 'var(--m-text-primary)' }}>
          This page does not exist.
        </h1>

        <p className="text-base leading-relaxed mb-10 max-w-sm" style={{ color: 'var(--m-text-secondary)' }}>
          The path you followed leads nowhere. Much like a project without a track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: 'var(--m-accent)', color: 'white' }}
          >
            Go to dashboard
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}
          >
            Back to home
          </button>
        </div>
      </div>

      <footer
        className="px-6 py-8 max-w-2xl mx-auto flex justify-between items-center"
        style={{ borderTop: '0.5px solid var(--m-border)' }}
      >
        <Logo />
        <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Ship calm. Step by step.</p>
      </footer>

    </main>
  )
}