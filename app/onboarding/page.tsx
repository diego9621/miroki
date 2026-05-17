'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Logo from '../components/Logo'

const categories = ['SaaS', 'Tool', 'App', 'Content', 'Other']
const priorities = ['High', 'Medium', 'Low']
const statuses = ['Idea', 'Building', 'Launched']

export default function Onboarding() {
  const [name, setName] = useState('')
  const [coreFeature, setCoreFeature] = useState('')
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
    if (!name || !coreFeature) { alert('Fill in all fields'); return }
    setSubmitting(true)

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: userId,
        name,
        core_feature: coreFeature,
        category: category.toLowerCase(),
        priority: priority.toLowerCase(),
        status: status.toLowerCase()
      }])
      .select()
      .single()

    if (error) { alert(error.message); setSubmitting(false); return }
    await supabase.rpc('create_default_steps', { p_project_id: data.id })
    window.location.href = `/projects/${data.slug}`
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--m-bg)' }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--m-border-hover)' }} />
    </main>
  )

  if (!userId) return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--m-bg)' }}>
      <div className="text-center">
        <p className="text-sm mb-4" style={{ color: 'var(--m-text-secondary)' }}>You need to log in first.</p>
        <a href="/" className="text-sm underline" style={{ color: 'var(--m-accent)' }}>Go to login</a>
      </div>
    </main>
  )

  const inputStyle = {
    background: 'var(--m-surface-1)',
    border: '0.5px solid var(--m-border)',
    color: 'var(--m-text-primary)',
  }

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: 'var(--m-bg)' }}>
      <div className="max-w-sm mx-auto flex flex-col gap-8">

        <div>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
            style={{ color: 'var(--m-text-secondary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--m-text-primary)' }}>New project</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--m-text-secondary)' }}>Lock in your track. Then ship.</p>
        </div>

        <div className="flex flex-col gap-6">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>What are you building?</label>
            <input
              className="rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
              style={{ ...inputStyle, caretColor: 'var(--m-accent)' }}
              placeholder="An app that..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>One core feature</label>
            <input
              className="rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
              style={{ ...inputStyle, caretColor: 'var(--m-accent)' }}
              placeholder="Users can..."
              value={coreFeature}
              onChange={e => setCoreFeature(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>Category</label>
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={category === c
                    ? { background: 'var(--m-accent)', color: 'white', border: '0.5px solid var(--m-accent)' }
                    : { background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>Priority</label>
            <div className="flex gap-2">
              {priorities.map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={priority === p
                    ? p === 'High'
                      ? { background: 'var(--m-danger)', color: 'white', border: '0.5px solid var(--m-danger)' }
                      : p === 'Medium'
                        ? { background: '#A07830', color: 'white', border: '0.5px solid #A07830' }
                        : { background: 'var(--m-surface-3)', color: 'var(--m-text-primary)', border: '0.5px solid var(--m-border-hover)' }
                    : { background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }
                  }
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>Status</label>
            <div className="flex gap-2">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={status === s
                    ? { background: 'var(--m-accent)', color: 'white', border: '0.5px solid var(--m-accent)' }
                    : { background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-xl px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50"
          style={{ background: 'var(--m-accent)', color: 'white' }}
        >
          {submitting ? 'Creating...' : 'Lock in my track →'}
        </button>

      </div>
    </main>
  )
}