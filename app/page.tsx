'use client'

import { useState, useEffect } from 'react'
import AppMockup from './components/AppMockup'
import ThemeToggle from './components/ThemeToggle'
import SoundFamiliar from './components/SoundFamiliar'
import { supabase } from './lib/supabase'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [waitlistStatus, setWaitlistStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) window.location.href = '/dashboard'
    })
  }, [])

  async function handleGitHub() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: 'https://www.miroki.app/auth/callback' }
    })
  }

  async function handleGoogle() {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'https://www.miroki.app/auth/callback' }
    })
  }

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setWaitlistStatus('loading')
    const { error } = await supabase.from('waitlist').insert([{ email }])
    if (error) {
      if (error.code === '23505') {
        setWaitlistStatus('success')
      } else {
        setWaitlistStatus('error')
      }
    } else {
      setWaitlistStatus('success')
    }
  }

  const howSteps = [
    {
      num: '01',
      title: 'Answer five questions',
      body: 'Define your problem, your differentiator, your MVP. Miroki turns your answers into a locked track you cannot deviate from.',
      done: true,
      extra: null,
    },
    {
      num: '02',
      title: 'Follow the phases',
      body: 'Six phases. Each one unlocks only when the previous is done. No skipping. No shortcuts. Every step has a concrete task.',
      done: true,
      extra: (
        <div className="flex gap-2 flex-wrap mt-4">
          {['Clarify', 'Plan', 'Stack', 'Build', 'Launch', 'Track'].map((p, i) => (
            <span
              key={p}
              className="text-xs px-2.5 py-1 rounded-lg"
              style={i < 2
                ? { background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)', color: 'var(--m-accent)' }
                : { background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-muted)' }
              }
            >
              {p}
            </span>
          ))}
        </div>
      ),
    },
    {
      num: '03',
      title: 'Ship. Then grow.',
      body: 'When all steps are done your project goes live. Track users, revenue and social growth directly from your dashboard.',
      done: false,
      extra: null,
    },
  ]

  return (
    <main className="min-h-screen" style={{ background: 'var(--m-bg)' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '0.5px solid var(--m-border)' }}>
        <div className="flex justify-between items-center px-6 py-5 max-w-2xl mx-auto">
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
      <section className="px-6 py-20 max-w-2xl mx-auto">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-8"
          style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)', color: 'var(--m-accent)' }}
        >
          <span>✦</span>
          <span>From idea to shipped, calmly</span>
        </div>

        <h1 className="text-5xl font-semibold tracking-tight leading-tight mb-6" style={{ color: 'var(--m-text-primary)' }}>
          Stop starting.<br />
          <span style={{ color: 'var(--m-accent)' }}>Start shipping.</span>
        </h1>

        <p className="text-lg leading-relaxed mb-12 max-w-lg" style={{ color: 'var(--m-text-secondary)' }}>
          Most builders never ship. Not because they lack ideas or skills. Because they drift. <strong style={{ color: 'var(--m-text-primary)', fontWeight: 500 }}>Miroki</strong> locks you in and walks you through, phase by phase.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
          No password. No credit card. Free to start.
        </p>
      </section>

      {/* Mockup */}
      <section style={{ borderTop: '0.5px solid var(--m-border)', borderBottom: '0.5px solid var(--m-border)' }}>
        <AppMockup />
      </section>

      {/* Sound familiar */}
      <div style={{ borderBottom: '0.5px solid var(--m-border)' }}>
        <SoundFamiliar />
      </div>

      {/* How it works */}
      <section>
        <div className="px-6 py-20 max-w-2xl mx-auto">
          <p className="text-xs font-medium uppercase tracking-widest mb-10" style={{ color: 'var(--m-text-muted)' }}>
            How it works
          </p>

          <div className="flex flex-col">
            {howSteps.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center" style={{ width: 32, flexShrink: 0 }}>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={step.done
                      ? { background: 'var(--m-accent)', color: 'white' }
                      : { background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-muted)' }
                    }
                  >
                    {step.done
                      ? <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                      : step.num
                    }
                  </div>
                  {i < howSteps.length - 1 && (
                    <div
                      className="w-0.5 flex-1 my-1"
                      style={{
                        background: i < 1 ? 'var(--m-accent)' : 'var(--m-border)',
                        minHeight: 40,
                      }}
                    />
                  )}
                </div>

                <div className="pb-10 flex-1 min-w-0">
                  <p
                    className="text-lg font-semibold mb-2 leading-snug"
                    style={{ color: step.done ? 'var(--m-text-primary)' : 'var(--m-text-muted)' }}
                  >
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--m-text-muted)' }}>{step.body}</p>
                  {step.extra}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section style={{ borderTop: '0.5px solid var(--m-border)' }}>
        <div className="px-6 py-20 max-w-2xl mx-auto">
          <div
            className="rounded-2xl p-10"
            style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}
          >
            <p className="text-2xl font-semibold mb-3 leading-snug" style={{ color: 'var(--m-text-primary)' }}>
              <strong style={{ fontWeight: 500 }}>Miroki</strong> is early.<br />Follow the build.
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--m-text-muted)' }}>
              Get updates on new features, improvements and the story behind building <strong style={{ color: 'var(--m-text-primary)', fontWeight: 500 }}>Miroki</strong> in public.
            </p>

            {waitlistStatus === 'success' ? (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)' }}
              >
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <p className="text-sm font-medium" style={{ color: 'var(--m-accent)' }}>You are on the list. We will be in touch.</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlist}>
                <div className="flex gap-2 mb-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    style={{
                      background: 'var(--m-surface-2)',
                      border: '0.5px solid var(--m-border)',
                      color: 'var(--m-text-primary)',
                      caretColor: 'var(--m-accent)',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={waitlistStatus === 'loading'}
                    className="rounded-xl px-5 py-3 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50 whitespace-nowrap"
                    style={{ background: 'var(--m-accent)', color: 'white' }}
                  >
                    {waitlistStatus === 'loading' ? 'Saving...' : 'Stay updated →'}
                  </button>
                </div>
                {waitlistStatus === 'error' && (
                  <p className="text-xs mb-2" style={{ color: 'var(--m-danger)' }}>Something went wrong. Try again.</p>
                )}
                <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>No spam. Unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 max-w-2xl mx-auto flex justify-between items-center"
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