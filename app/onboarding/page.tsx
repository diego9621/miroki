'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Onboarding() {
  const [name, setName] = useState('')
  const [coreFeature, setCoreFeature] = useState('')
  const [hours, setHours] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit() {
    if (!userId) { alert('Not logged in'); return }

    const { error } = await supabase
      .from('projects')
      .insert([{
        user_id: userId,
        name,
        core_feature: coreFeature,
        hours_per_week: parseInt(hours)
      }])

    if (error) { alert(error.message); return }
    window.location.href = '/dashboard'
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <p className="text-zinc-500 text-sm">Loading...</p>
    </main>
  )

  if (!userId) return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <div className="text-center">
        <p className="text-zinc-500 text-sm mb-4">You need to log in first.</p>
        <a href="/" className="text-white text-sm underline">Go to login</a>
      </div>
    </main>
  )

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <div className="flex flex-col gap-6 w-full max-w-sm px-6">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">New project</h1>
          <p className="text-zinc-500 text-sm mt-1">Three questions. Then we build.</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300">What are you building?</label>
            <input
              className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600"
              placeholder="An app that..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300">What is the one core feature?</label>
            <input
              className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600"
              placeholder="Users can..."
              value={coreFeature}
              onChange={e => setCoreFeature(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-300">Hours per week?</label>
            <input
              className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600"
              type="number"
              placeholder="5"
              value={hours}
              onChange={e => setHours(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-white text-black rounded-xl px-4 py-3 text-sm font-medium hover:bg-zinc-100 transition-colors"
        >
          Start my track →
        </button>
      </div>
    </main>
  )
}