'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

interface Project {
  id: number
  slug: string
  name: string
  core_feature: string
  hours_per_week: number
  category: string
  priority: string
  status: string
}

const priorityColor: Record<string, string> = {
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-zinc-700/50 text-zinc-400 border-zinc-700',
}

const statusColor: Record<string, string> = {
  idea: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  building: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  launched: 'bg-green-500/10 text-green-400 border-green-500/20',
}

const categoryIcon: Record<string, string> = {
  saas: '⚡',
  tool: '🔧',
  app: '📱',
  content: '✍️',
  other: '✦',
}

export default function ProjectPage() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

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

      setProject(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <p className="text-zinc-500 text-sm">Loading...</p>
    </main>
  )

  if (!project) return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <p className="text-zinc-500 text-sm">Project not found.</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-12">
      <div className="max-w-lg mx-auto">

        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="text-zinc-500 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{categoryIcon[project.category] ?? '✦'}</span>
            <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
          </div>
          <button
            onClick={() => window.location.href = `/projects/${project.slug}/edit`}
            className="border border-zinc-800 text-zinc-400 rounded-xl px-3 py-1.5 text-xs hover:bg-zinc-900 transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          <span className={`text-xs px-2.5 py-1 rounded-lg border capitalize ${priorityColor[project.priority] ?? priorityColor.medium}`}>
            {project.priority} priority
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-lg border capitalize ${statusColor[project.status] ?? statusColor.idea}`}>
            {project.status}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-lg border border-zinc-800 text-zinc-400 capitalize">
            {project.category}
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
          <div>
            <p className="text-zinc-500 text-xs mb-1">Core feature</p>
            <p className="text-white text-sm">{project.core_feature}</p>
          </div>
          <div className="border-t border-zinc-800 pt-4">
            <p className="text-zinc-500 text-xs mb-1">Hours per week</p>
            <p className="text-white text-sm">{project.hours_per_week}h / week</p>
          </div>
        </div>

        <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <p className="text-zinc-500 text-sm text-center">Track coming soon.</p>
        </div>

      </div>
    </main>
  )
}