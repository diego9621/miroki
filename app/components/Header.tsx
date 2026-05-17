'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import { supabase } from '../lib/supabase'

type HeaderProps = {
  maxWidth?: string
}

export default function Header({ maxWidth = 'max-w-2xl' }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setIsLoggedIn(!!session?.user)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  const links = [
    { label: 'How it works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
  ]

  return (
    <nav style={{ borderBottom: '0.5px solid var(--m-border)' }}>
      <div className={`relative flex justify-between items-center px-6 py-5 ${maxWidth} mx-auto`}>
        <Link href="/" className="transition-opacity hover:opacity-80">
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-opacity hover:opacity-80"
            style={{
              background: 'var(--m-surface-1)',
              border: '0.5px solid var(--m-border)',
              color: 'var(--m-text-primary)',
            }}
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>

        {open && (
          <div
            className="absolute right-6 top-[76px] z-50 w-56 rounded-2xl p-2"
            style={{
              background: 'var(--m-surface-1)',
              border: '0.5px solid var(--m-border)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
            }}
          >
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: 'var(--m-text-primary)' }}
              >
                {link.label}
              </Link>
            ))}

            <div className="my-1" style={{ borderTop: '0.5px solid var(--m-border)' }} />

            <div className="flex items-center justify-between rounded-xl px-4 py-3">
              <span className="text-sm font-medium" style={{ color: 'var(--m-text-primary)' }}>Theme</span>
              <ThemeToggle />
            </div>

            <div className="my-1" style={{ borderTop: '0.5px solid var(--m-border)' }} />

            <Link
              href={isLoggedIn ? '/dashboard' : '/'}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-medium transition-opacity hover:opacity-80"
              style={{ color: 'var(--m-accent)' }}
            >
              {isLoggedIn ? 'Dashboard' : 'Sign in'}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}