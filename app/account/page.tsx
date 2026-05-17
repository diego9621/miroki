'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ThemeToggle from '../components/ThemeToggle'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState<string>('free')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { window.location.href = '/'; return }
      setEmail(session.user.email ?? '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', session.user.id)
        .single()

      setPlan(profile?.plan ?? 'free')
      setLoading(false)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--m-bg)' }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--m-border-hover)' }} />
    </main>
  )

  const initials = email.slice(0, 2).toUpperCase()
  const isPro = plan === 'pro'

  return (
    <main className="min-h-screen" style={{ background: 'var(--m-bg)' }}>
      <Header />

      <div className="px-6 py-10 max-w-lg mx-auto">

        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-medium"
            style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}>
            {initials}
          </div>
          <div>
            <h1 className="font-semibold" style={{ color: 'var(--m-text-primary)' }}>Account</h1>
            <p className="text-sm" style={{ color: 'var(--m-text-secondary)' }}>{email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">

          {/* Profile */}
          <div className="rounded-xl p-5" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
            <h2 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--m-text-muted)' }}>Profile</h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'var(--m-text-secondary)' }}>Email</span>
                <span className="text-sm" style={{ color: 'var(--m-text-primary)' }}>{email}</span>
              </div>
              <div className="flex justify-between items-center pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}>
                <span className="text-sm" style={{ color: 'var(--m-text-secondary)' }}>Avatar</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}>
                  {initials}
                </div>
              </div>
            </div>
          </div>

          {/* Plan */}
          <div
            className="rounded-xl p-5"
            style={{
              background: 'var(--m-surface-1)',
              border: isPro ? '0.5px solid var(--m-accent-border)' : '0.5px solid var(--m-border)'
            }}
          >
            <h2 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--m-text-muted)' }}>Plan</h2>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isPro ? 'var(--m-accent-subtle)' : 'var(--m-surface-2)',
                    border: isPro ? '0.5px solid var(--m-accent-border)' : '0.5px solid var(--m-border)',
                  }}
                >
                  {isPro ? (
                    <svg className="w-4 h-4" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" style={{ color: 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--m-text-primary)' }}>
                    {isPro ? 'Pro' : 'Free'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>
                    {isPro ? 'Unlimited projects' : '3 projects included'}
                  </p>
                </div>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-lg"
                style={isPro
                  ? { background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)', color: 'var(--m-accent)' }
                  : { background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-muted)' }
                }
              >
                {isPro ? 'Active' : 'Free plan'}
              </span>
            </div>

            {!isPro && (
              <>
                <div style={{ borderTop: '0.5px solid var(--m-border)' }} className="pt-4 mb-4">
                  <div className="flex flex-col gap-2">
                    {[
                      'Unlimited projects',
                      'Early access to new features',
                      'Priority support',
                    ].map(f => (
                      <div key={f} className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                        <span className="text-xs" style={{ color: 'var(--m-text-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="w-full rounded-xl py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ background: 'var(--m-accent)', color: 'white' }}
                >
                  Upgrade to Pro — €9/month →
                </button>
              </>
            )}

            {isPro && (
              <div style={{ borderTop: '0.5px solid var(--m-border)' }} className="pt-4">
                <button
                  className="text-xs hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--m-text-muted)' }}
                >
                  Manage subscription →
                </button>
              </div>
            )}
          </div>

          {/* Appearance */}
          <div className="rounded-xl p-5" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
            <h2 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--m-text-muted)' }}>Appearance</h2>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: 'var(--m-text-secondary)' }}>Theme</span>
              <ThemeToggle />
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity px-1"
            style={{ color: 'var(--m-text-muted)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign out
          </button>

        </div>
      </div>

      <Footer />
    </main>
  )
}