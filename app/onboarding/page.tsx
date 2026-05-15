'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const categories = ['SaaS', 'Tool', 'App', 'Content', 'Other']
const priorities = ['High', 'Medium', 'Low']
const statuses = ['Idea', 'Building', 'Launched']

export default function Onboarding() {
  const [name, setName] = useState('')
  const [coreFeature, setCoreFeature] = useState('')
  const [hours, setHours] = useState('')
  const [category, setCategory] = useState('SaaS')
  const [priority, setPriority] = useState('Medium')
  const [status, setStatus] = useState('Idea')
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id)
      setLoading(false)
    })
  }, [])

  async function handleSubmit() {
    if (!userId) { alert('Not logged in'); return }
    if (!name || !coreFeature || !hours) { alert('Fill in all fields'); return }

    setSubmitting(true)

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: userId,
        name,
        core_feature: coreFeature,
        hours_per_week: parseInt(hours),
        category: category.toLowerCase(),
        priority: priority.toLowerCase(),
        status: status.toLowerCase()
      }])
      .select()
      .single()

    if (error) { alert(error.message); setSubmitting(false); return }

    await supabase.rpc('create_default_steps', { p_project_id: data.id })

    window.location.href = '/dashboard'
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse" />
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
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-12">
      <div className="max-w-sm mx-auto flex flex-col gap-8">

        <div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-sm mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-semibold text-white tracking-tight">New project</h1>
          <p className="text-zinc-500 text-sm mt-1">Lock in your track. Then ship.</p>
        </div>

        <div className="flex flex-col gap-6">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">What are you building?</label>
            <input
              className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
              placeholder="An app that..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">One core feature</label>
            <input
              className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
              placeholder="Users can..."
              value={coreFeature}
              onChange={e => setCoreFeature(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Category</label>
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    category === c
                      ? 'bg-white text-black font-medium'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Priority</label>
            <div className="flex gap-2">
              {priorities.map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    priority === p
                      ? p === 'High' ? 'bg-red-500 text-white font-medium'
                      : p === 'Medium' ? 'bg-yellow-500 text-black font-medium'
                      : 'bg-zinc-500 text-white font-medium'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Status</label>
            <div className="flex gap-2">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    status === s
                      ? 'bg-white text-black font-medium'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Hours per week</label>
            <input
              className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
              type="number"
              placeholder="5"
              value={hours}
              onChange={e => setHours(e.target.value)}
            />
          </div>

        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-white text-black rounded-xl px-4 py-3 text-sm font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Creating...' : 'Lock in my track →'}
        </button>

      </div>
    </main>
  )
}