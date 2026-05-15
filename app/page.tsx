'use client'

import { useState, useEffect } from 'react'
import AppMockup from './components/AppMockup'
import ThemeToggle from './components/ThemeToggle'

export default function Home() {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    import('./lib/supabase').then(({ supabase }) => {
      supabase.auth.onAuthStateChange((event, session) => {
        if (session) window.location.href = '/dashboard'
      })
    })
  }, [])

  async function handleGitHub() {
    setLoading(true)
    const { supabase } = await import('./lib/supabase')
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: 'https://www.miroki.app/auth/callback' }
    })
  }

  async function handleGoogle() {
    setLoading(true)
    const { supabase } = await import('./lib/supabase')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://www.miroki.app/auth/callback' }
    })
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--m-bg)' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '0.5px solid var(--m-border)' }}>
        <div className="flex justify-between items-center px-6 py-5 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <span style={{ color: 'var(--m-accent)', fontSize: 18 }}>✦</span>
            <span className="font-semibold tracking-tight" style={{ color: 'var(--m-text-primary)' }}>Miroki</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleGitHub}
              className="text-sm px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 max-w-2xl mx-auto text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-8"
          style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)', color: 'var(--m-accent)' }}
        >
          <span>✦</span>
          <span>From idea to shipped — calmly</span>
        </div>

        <h1 className="text-5xl font-semibold tracking-tight leading-tight mb-6" style={{ color: 'var(--m-text-primary)' }}>
          Stop starting.<br />
          <span style={{ color: 'var(--m-accent)' }}>Start shipping.</span>
        </h1>

        <p className="text-lg leading-relaxed mb-4 max-w-lg mx-auto" style={{ color: 'var(--m-text-secondary)' }}>
          Miroki breaks your idea into a clear, locked track — phase by phase, step by step.
        </p>
        <p className="text-base leading-relaxed mb-12 max-w-md mx-auto" style={{ color: 'var(--m-text-muted)' }}>
          No more half-finished projects collecting dust.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={handleGitHub}
            disabled={loading}
            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: 'var(--m-text-primary)', color: 'var(--m-bg)' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-primary)' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>
          No password needed. No credit card. Free to start.
        </p>
      </section>

      {/* Mockup */}
      <section style={{ borderTop: '0.5px solid var(--m-border)', borderBottom: '0.5px solid var(--m-border)' }}>
        <AppMockup />
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-2xl mx-auto">
        <div className="flex flex-col gap-12">

          <div className="flex gap-6 items-start">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--m-accent)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--m-text-primary)' }}>Lock your track</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--m-text-secondary)' }}>
                Answer five questions. Get a personalized path from idea to live product. Stack is locked. Scope is locked. No more switching halfway through.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--m-accent)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--m-text-primary)' }}>Phase by phase</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--m-text-secondary)' }}>
                Six phases — Clarify, Plan, Stack, Build, Launch, Track. Each phase unlocks only when the previous is done. No skipping. No shortcuts.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--m-accent)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--m-text-primary)' }}>Ship for real</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--m-text-secondary)' }}>
                Only free tools. Literal step-by-step instructions — from creating your Supabase account to connecting your domain. Your only job is to follow the steps.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-24 max-w-2xl mx-auto text-center">
        <div style={{ borderTop: '0.5px solid var(--m-border)' }} className="mb-16" />
        <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--m-text-primary)' }}>
          Ready to ship?
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--m-text-secondary)' }}>
          Start your track today. It is free.
        </p>
        <button
          onClick={handleGitHub}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: 'var(--m-accent)', color: 'white' }}
        >
          Start your track →
        </button>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 max-w-4xl mx-auto flex justify-between items-center"
        style={{ borderTop: '0.5px solid var(--m-border)' }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: 'var(--m-accent)' }}>✦</span>
          <span className="text-sm" style={{ color: 'var(--m-text-muted)' }}>Miroki</span>
        </div>
        <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Ship calm. Step by step.</p>
      </footer>

    </main>
  )
}