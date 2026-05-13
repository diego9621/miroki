'use client'

import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'

export default function Home() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        window.location.href = '/dashboard'
      }
    })
  }, [])

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) { alert(error.message); return }
    setSent(true)
  }

  if (sent) return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Check je email</h1>
        <p className="text-gray-500">We hebben een magic link gestuurd naar {email}</p>
      </div>
    </main>
  )

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <h1 className="text-3xl font-semibold">Miroki</h1>
        <p className="text-gray-500 text-sm">Ship rustig. Stap voor stap.</p>
        <input
          type="email"
          placeholder="jouw@email.com"
          className="border rounded-lg px-4 py-2 w-full"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="bg-black text-white rounded-lg px-4 py-2 w-full"
        >
          Inloggen met magic link
        </button>
      </div>
    </main>
  )
}