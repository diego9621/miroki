'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

export default function Pricing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user)
    })
  }, [])

  const free = [
    '3 projects',
    'All 6 phases',
    'All 24 steps per project',
    'Stack selector',
    'Growth tracking dashboard',
  ]

  const pro = [
    'Unlimited projects',
    'All 6 phases',
    'All 24 steps per project',
    'Stack selector',
    'Growth tracking dashboard',
    'Early access to new features',
    'Priority support',
  ]

  return (
    <main className="min-h-screen" style={{ background: 'var(--m-bg)' }}>

      {/* Nav */}
      <nav style={{ borderBottom: '0.5px solid var(--m-border)' }}>
        <div className="flex justify-between items-center px-6 py-5 max-w-2xl mx-auto">
          <button onClick={() => window.location.href = '/'} className="transition-opacity hover:opacity-80">
            <Logo />
          </button>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="text-sm px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => window.location.href = '/'}
                className="text-sm px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      <section className="px-6 py-20 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: 'var(--m-text-muted)' }}>
            Pricing
          </p>
          <h1 className="text-4xl font-semibold tracking-tight leading-tight mb-4" style={{ color: 'var(--m-text-primary)' }}>
            Simple. No surprises.
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--m-text-secondary)' }}>
            Start free. Upgrade when you are ready to ship more.
          </p>
        </div>

        {/* Plans */}
        <div className="flex flex-col gap-4">

          {/* Free */}
          <div
            className="rounded-2xl p-8"
            style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--m-text-muted)' }}>Free</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold" style={{ color: 'var(--m-text-primary)' }}>€0</span>
                  <span className="text-sm" style={{ color: 'var(--m-text-muted)' }}>/month</span>
                </div>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-muted)' }}
              >
                Current plan
              </span>
            </div>

            <div className="flex flex-col gap-2.5 mb-8">
              {free.map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--m-text-muted)' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  <span className="text-sm" style={{ color: 'var(--m-text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = isLoggedIn ? '/dashboard' : '/'}
              className="w-full rounded-xl py-3 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}
            >
              {isLoggedIn ? 'Go to dashboard' : 'Get started free'}
            </button>
          </div>

          {/* Pro */}
          <div
            className="rounded-2xl p-8"
            style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-accent-border)' }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: 'var(--m-accent)' }}>Pro</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold" style={{ color: 'var(--m-text-primary)' }}>€9</span>
                  <span className="text-sm" style={{ color: 'var(--m-text-muted)' }}>/month</span>
                </div>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)', color: 'var(--m-accent)' }}
              >
                Most popular
              </span>
            </div>

            <div className="flex flex-col gap-2.5 mb-8">
              {pro.map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  <span className="text-sm" style={{ color: 'var(--m-text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = isLoggedIn ? '/account/upgrade' : '/'}
              className="w-full rounded-xl py-3 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ background: 'var(--m-accent)', color: 'white' }}
            >
              {isLoggedIn ? 'Upgrade to Pro →' : 'Start free, then upgrade →'}
            </button>
          </div>

        </div>

        {/* FAQ */}
        <div className="mt-16">
          <p className="text-xs font-medium uppercase tracking-widest mb-8" style={{ color: 'var(--m-text-muted)' }}>
            Questions
          </p>
          <div className="flex flex-col">
            {[
              {
                q: 'Can I try Miroki before paying?',
                a: 'Yes. The free plan gives you 3 full projects with all features. No credit card needed.',
              },
              {
                q: 'What happens when I hit the free limit?',
                a: 'Your existing projects stay fully accessible. You just cannot create new ones until you upgrade.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel whenever you want. You keep Pro access until the end of your billing period.',
              },
              {
                q: 'Is there a yearly plan?',
                a: 'Coming soon. Monthly only for now.',
              },
            ].map((item, i, arr) => (
              <div
                key={i}
                className="py-6"
                style={{ borderBottom: i < arr.length - 1 ? '0.5px solid var(--m-border)' : 'none' }}
              >
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--m-text-primary)' }}>{item.q}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--m-text-muted)' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Footer */}
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