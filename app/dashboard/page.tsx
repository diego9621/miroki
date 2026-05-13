'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email ?? '')
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">Welkom bij Miroki</h1>
        <p className="text-gray-500 text-sm">{email}</p>
        <button
          onClick={handleLogout}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          Uitloggen
        </button>
      </div>
    </main>
  )
}