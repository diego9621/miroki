'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [email, setEmail] = useState('')
  const [hasProject, setHasProject] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/'; return }

      setEmail(user.email ?? '')

      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)

      if (projects && projects.length > 0) {
        setHasProject(true)
      } else {
        window.location.href = '/onboarding'
      }

      setLoading(false)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <p className="text-zinc-500 text-sm">Loading...</p>
    </main>
  )

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <div className="flex flex-col items-center gap-4">
        <div className="text-4xl">✦</div>
        <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
        <p className="text-zinc-500 text-sm">{email}</p>
        <button
          onClick={handleLogout}
          className="border border-zinc-800 text-zinc-400 rounded-xl px-4 py-2 text-sm hover:bg-zinc-900 transition-colors"
        >
          Log out
        </button>
      </div>
    </main>
  )
}