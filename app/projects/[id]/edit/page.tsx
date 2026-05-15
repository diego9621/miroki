'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const categories = ['SaaS', 'Tool', 'App', 'Content', 'Other']
const priorities = ['High', 'Medium', 'Low']
const statuses = ['Idea', 'Building', 'Launched']

export default function EditProject() {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [coreFeature, setCoreFeature] = useState('')
  const [hours, setHours] = useState('')
  const [category, setCategory] = useState('SaaS')
  const [priority, setPriority] = useState('Medium')
  const [status, setStatus] = useState('Idea')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { window.location.href = '/'; return }
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', id)
        .eq('user_id', session.user.id)
        .single()
      if (data) {
        setName(data.name)
        setCoreFeature(data.core_feature)
        setHours(data.hours_per_week.toString())
        setCategory(data.category.charAt(0).toUpperCase() + data.category.slice(1))
        setPriority(data.priority.charAt(0).toUpperCase() + data.priority.slice(1))
        setStatus(data.status.charAt(0).toUpperCase() + data.status.slice(1))
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('projects')
      .update({
        name,
        core_feature: coreFeature,
        hours_per_week: parseInt(hours),
        category: category.toLowerCase(),
        priority: priority.toLowerCase(),
        status: status.toLowerCase()
      })
      .eq('slug', id)
    if (error) { alert(error.message); setSaving(false); return }
    window.location.href = `/projects/${id}`
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--m-bg)' }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--m-border-hover)' }} />
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
            onClick={() => window.location.href = `/projects/${id}`}
            className="flex items-center gap-1.5 text-sm mb-8 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--m-text-secondary)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--m-text-primary)' }}>Edit project</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--m-text-secondary)' }}>Update your track.</p>
        </div>

        <div className="flex flex-col gap-6">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>What are you building?</label>
            <input className="rounded-xl px-4 py-3 text-sm focus:outline-none" style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>One core feature</label>
            <input className="rounded-xl px-4 py-3 text-sm focus:outline-none" style={inputStyle} value={coreFeature} onChange={e => setCoreFeature(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>Category</label>
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)} className="px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={category === c
                    ? { background: 'var(--m-accent)', color: 'white', border: '0.5px solid var(--m-accent)' }
                    : { background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }
                  }>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>Priority</label>
            <div className="flex gap-2">
              {priorities.map(p => (
                <button key={p} onClick={() => setPriority(p)} className="flex-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={priority === p
                    ? p === 'High'
                      ? { background: 'var(--m-danger)', color: 'white', border: '0.5px solid var(--m-danger)' }
                      : p === 'Medium'
                        ? { background: '#A07830', color: 'white', border: '0.5px solid #A07830' }
                        : { background: 'var(--m-surface-3)', color: 'var(--m-text-primary)', border: '0.5px solid var(--m-border-hover)' }
                    : { background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }
                  }>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>Status</label>
            <div className="flex gap-2">
              {statuses.map(s => (
                <button key={s} onClick={() => setStatus(s)} className="flex-1 px-3 py-1.5 rounded-lg text-sm transition-colors"
                  style={status === s
                    ? { background: 'var(--m-accent)', color: 'white', border: '0.5px solid var(--m-accent)' }
                    : { background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }
                  }>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>Hours per week</label>
            <input className="rounded-xl px-4 py-3 text-sm focus:outline-none" style={inputStyle} type="number" value={hours} onChange={e => setHours(e.target.value)} />
          </div>

        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50"
          style={{ background: 'var(--m-accent)', color: 'white' }}
        >
          {saving ? 'Saving...' : 'Save changes →'}
        </button>

      </div>
    </main>
  )
}