'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'
import Header from '../components/Header'
import FaqItem from '../components/FaqItem'

export default function Pricing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [plan, setPlan] = useState<'free' | 'pro'>('free')

  useEffect(() => {
    async function loadUserPlan() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const user = session?.user

      setIsLoggedIn(!!user)

      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      setPlan(data?.plan === 'pro' ? 'pro' : 'free')
    }

    loadUserPlan()
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

  const questions = [
    {
      q: 'Why not just use Notion or Trello?',
      a: 'Miroki is not built for collecting ideas. It is built for finishing them. The product uses locked execution phases to prevent endless rebuilding, feature creep and stack switching.',
    },
    {
      q: 'Why does Miroki lock phases?',
      a: 'Because most builders do not fail from lack of ideas. They fail from constantly changing direction. Miroki keeps your focus on the next required step instead of another restart.',
    },
    {
      q: 'Can I change my stack later?',
      a: 'Yes, but Miroki is designed to make that decision intentional. The goal is to stop casual stack switching before your MVP is finished.',
    },
    {
      q: 'What happens when I hit the free limit?',
      a: 'Your existing projects stay accessible. You just cannot create new projects until you upgrade.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. You keep Pro access until the end of your billing period.',
    },
  ]

  return (
    <main className="min-h-screen" style={{ background: 'var(--m-bg)' }}>
      <Header />

      <section className="px-6 py-20 max-w-2xl mx-auto">
        <div className="mb-14">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-4"
            style={{ color: 'var(--m-text-muted)' }}
          >
            Pricing
          </p>

          <h1
            className="text-4xl font-semibold tracking-tight leading-tight mb-4"
            style={{ color: 'var(--m-text-primary)' }}
          >
            Simple. No surprises.
          </h1>

          <p
            className="text-lg leading-relaxed"
            style={{ color: 'var(--m-text-secondary)' }}
          >
            Start free. Upgrade when you are ready to finish more.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'var(--m-surface-1)',
              border: '0.5px solid var(--m-border)',
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-widest mb-2"
                  style={{ color: 'var(--m-text-muted)' }}
                >
                  Free
                </p>

                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl font-semibold"
                    style={{ color: 'var(--m-text-primary)' }}
                  >
                    €0
                  </span>

                  <span
                    className="text-sm"
                    style={{ color: 'var(--m-text-muted)' }}
                  >
                    /month
                  </span>
                </div>
              </div>

              {isLoggedIn && plan === 'free' && (
                <span
                  className="text-xs px-2.5 py-1 rounded-lg"
                  style={{
                    background: 'var(--m-surface-2)',
                    border: '0.5px solid var(--m-border)',
                    color: 'var(--m-text-muted)',
                  }}
                >
                  Current plan
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2.5 mb-8">
              {free.map(feature => (
                <div key={feature} className="flex items-center gap-2.5">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: 'var(--m-text-muted)' }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>

                  <span
                    className="text-sm"
                    style={{ color: 'var(--m-text-secondary)' }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = isLoggedIn ? '/dashboard' : '/'}
              className="w-full rounded-xl py-3 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                background: 'var(--m-accent)',
                color: 'white',
              }}
            >
              {isLoggedIn ? 'Go to dashboard' : 'Get started free →'}
            </button>
          </div>

          <div
            className="rounded-2xl p-8"
            style={{
              background: 'var(--m-surface-1)',
              border: '0.5px solid var(--m-accent-border)',
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <p
                  className="text-xs font-medium uppercase tracking-widest mb-2"
                  style={{ color: 'var(--m-accent)' }}
                >
                  Pro
                </p>

                <div className="flex items-baseline gap-1">
                  <span
                    className="text-4xl font-semibold"
                    style={{ color: 'var(--m-text-primary)' }}
                  >
                    €9
                  </span>

                  <span
                    className="text-sm"
                    style={{ color: 'var(--m-text-muted)' }}
                  >
                    /month
                  </span>
                </div>
              </div>

              <span
                className="text-xs px-2.5 py-1 rounded-lg"
                style={{
                  background: 'var(--m-accent-subtle)',
                  border: '0.5px solid var(--m-accent-border)',
                  color: 'var(--m-accent)',
                }}
              >
                {isLoggedIn && plan === 'pro' ? 'Current plan' : 'Most popular'}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 mb-8">
              {pro.map(feature => (
                <div key={feature} className="flex items-center gap-2.5">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: 'var(--m-accent)' }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>

                  <span
                    className="text-sm"
                    style={{ color: 'var(--m-text-secondary)' }}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                if (plan === 'pro') {
                  window.location.href = '/dashboard'
                } else if (isLoggedIn) {
                  window.location.href = '/account/upgrade'
                } else {
                  window.location.href = '/'
                }
              }}
              className="w-full rounded-xl py-3 text-sm font-medium transition-opacity hover:opacity-80"
              style={{
                background: 'var(--m-accent)',
                color: 'white',
              }}
            >
              {plan === 'pro'
                ? 'Go to dashboard'
                : isLoggedIn
                  ? 'Upgrade to Pro →'
                  : 'Start free, then upgrade →'}
            </button>
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-8">
            <p
              className="text-xs font-medium uppercase tracking-widest mb-3"
              style={{ color: 'var(--m-text-muted)' }}
            >
              Questions
            </p>

            <h2
              className="text-2xl font-semibold tracking-tight"
              style={{ color: 'var(--m-text-primary)' }}
            >
              Still wondering if Miroki fits?
            </h2>
          </div>

          <div
            className="rounded-2xl px-6"
            style={{
              background: 'var(--m-surface-1)',
              border: '0.5px solid var(--m-border)',
            }}
          >
            {questions.map(item => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      <footer
        className="px-6 py-8 max-w-2xl mx-auto flex justify-between items-center"
        style={{ borderTop: '0.5px solid var(--m-border)' }}
      >
        <Logo />

        <p
          className="text-xs"
          style={{ color: 'var(--m-text-muted)' }}
        >
          Ship calm. Step by step.
        </p>
      </footer>
    </main>
  )
}