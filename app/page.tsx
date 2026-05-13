'use client'

import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) window.location.href = '/dashboard'
    })
  }, [])

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'https://www.miroki.app/auth/callback?next=/onboarding'
      }
    })
    if (error) { alert(error.message); return }
    setSent(true)
  }

  if (sent) return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <div className="text-center">
        <div className="text-4xl mb-6">✦</div>
        <h1 className="text-xl font-medium text-white mb-2">Check your email</h1>
        <p className="text-zinc-500 text-sm">Magic link sent to {email}</p>
      </div>
    </main>
  )

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <div className="flex flex-col items-center gap-8 w-full max-w-sm px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">✦</div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Miroki</h1>
          <p className="text-zinc-500 text-sm mt-2">Ship calm. Step by step.</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <input
            type="email"
            placeholder="your@email.com"
            className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 w-full text-sm focus:outline-none focus:border-zinc-600"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="bg-white text-black rounded-xl px-4 py-3 w-full text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            Continue with magic link →
          </button>
        </div>
        <p className="text-zinc-600 text-xs text-center">No password needed. No credit card.</p>
      </div>
    </main>
  )
}