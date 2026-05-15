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
        .eq('id', id)
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
      .eq('id', id)

    if (error) { alert(error.message); setSaving(false); return }
    window.location.href = `/projects/${id}`
  }

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <p className="text-zinc-500 text-sm">Loading...</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-12">
      <div className="max-w-sm mx-auto flex flex-col gap-8">

        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = `/projects/${id}`}
            className="text-zinc-500 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-white">Edit project</h1>
          <p className="text-zinc-500 text-sm mt-1">Update your track.</p>
        </div>

        <div className="flex flex-col gap-6">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">What are you building?</label>
            <input
              className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">One core feature</label>
            <input
              className="bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
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
              value={hours}
              onChange={e => setHours(e.target.value)}
            />
          </div>

        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-black rounded-xl px-4 py-3 text-sm font-medium hover:bg-zinc-100 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save changes →'}
        </button>

      </div>
    </main>
  )
}