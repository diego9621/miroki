'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Logo from '../../components/Logo'
import ThemeToggle from '../../components/ThemeToggle'

export default function UpgradePage() {
  const [loading, setLoading] = useState(false)
  const [userLoading, setUserLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) { window.location.href = '/'; return }
      setEmail(session.user.email ?? '')
      setUserId(session.user.id)
      setUserLoading(false)
    })
  }, [])

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email }),
    })
    const { url, error } = await res.json()
    if (error) { alert(error); setLoading(false); return }
    window.location.href = url
  }

  if (userLoading) return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--m-bg)' }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--m-border-hover)' }} />
    </main>
  )

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

      <section className="px-6 py-20 max-w-sm mx-auto">
        <button
          onClick={() => window.location.href = '/account'}
          className="flex items-center gap-1.5 text-sm mb-10 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--m-text-secondary)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>

        <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--m-accent)' }}>
          Pro
        </p>
        <h1 className="text-3xl font-semibold tracking-tight mb-3" style={{ color: 'var(--m-text-primary)' }}>
          Upgrade to Pro
        </h1>
        <p className="text-sm leading-relaxed mb-10" style={{ color: 'var(--m-text-secondary)' }}>
          Unlimited projects. Ship everything you have in mind.
        </p>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-accent-border)' }}
        >
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-semibold" style={{ color: 'var(--m-text-primary)' }}>€9</span>
            <span className="text-sm" style={{ color: 'var(--m-text-muted)' }}>/month</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              'Unlimited projects',
              'All 6 phases and 24 steps',
              'Stack selector',
              'Growth tracking dashboard',
              'Early access to new features',
              'Priority support',
            ].map(f => (
              <div key={f} className="flex items-center gap-2.5">
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span className="text-sm" style={{ color: 'var(--m-text-secondary)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full rounded-xl py-3.5 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'var(--m-accent)', color: 'white' }}
        >
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {loading ? 'Redirecting to Stripe...' : 'Upgrade to Pro →'}
        </button>

        <p className="text-xs text-center mt-4" style={{ color: 'var(--m-text-muted)' }}>
          Cancel anytime. No hidden fees.
        </p>
      </section>

    </main>
  )
}