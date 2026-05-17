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
          <div className="hidden sm:flex items-center gap-2">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm px-3 py-2 rounded-lg transition-opacity hover:opacity-80"
                style={{ color: 'var(--m-text-secondary)' }}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={isLoggedIn ? '/dashboard' : '/'}
              className="text-sm px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
              style={{
                background: 'var(--m-surface-1)',
                border: '0.5px solid var(--m-border)',
                color: 'var(--m-text-secondary)',
              }}
            >
              {isLoggedIn ? 'Dashboard' : 'Sign in'}
            </Link>
          </div>

          <ThemeToggle />

          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="sm:hidden w-11 h-11 rounded-xl flex items-center justify-center transition-opacity hover:opacity-80"
            style={{
              background: 'var(--m-surface-1)',
              border: '0.5px solid var(--m-border)',
              color: 'var(--m-text-primary)',
            }}
          >
            <span className="text-xl leading-none">
              {open ? '×' : '☰'}
            </span>
          </button>
        </div>

        {open && (
          <div
            className="absolute right-6 top-[76px] z-50 w-56 rounded-2xl p-2 sm:hidden"
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