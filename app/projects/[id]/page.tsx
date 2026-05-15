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

const categoryPaths: Record<string, string> = {
  saas: 'M13 10V3L4 14h7v7l9-11h-7z',
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  app: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z',
  content: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z',
  other: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
}

function CategoryIcon({ category }: { category: string }) {
  const path = categoryPaths[category] ?? categoryPaths.other
  return (
    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  )
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
      <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse" />
    </main>
  )

  if (!project) return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A]">
      <p className="text-zinc-500 text-sm">Project not found.</p>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-10">
      <div className="max-w-lg mx-auto">

        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <button
            onClick={() => window.location.href = `/projects/${project.slug}/edit`}
            className="flex items-center gap-1.5 border border-zinc-800 text-zinc-400 rounded-lg px-3 py-1.5 text-xs hover:bg-zinc-900 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
            Edit
          </button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <CategoryIcon category={project.category} />
          <h1 className="text-xl font-semibold text-white">{project.name}</h1>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-8">
          <span className={`text-xs px-2 py-0.5 rounded-md border capitalize ${priorityColor[project.priority] ?? priorityColor.medium}`}>
            {project.priority} priority
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-md border capitalize ${statusColor[project.status] ?? statusColor.idea}`}>
            {project.status}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-500 capitalize">
            {project.category}
          </span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-4 mb-4">
          <div>
            <p className="text-zinc-500 text-xs mb-1">Core feature</p>
            <p className="text-white text-sm">{project.core_feature}</p>
          </div>
          <div className="border-t border-zinc-800 pt-4">
            <p className="text-zinc-500 text-xs mb-1">Hours per week</p>
            <p className="text-white text-sm">{project.hours_per_week}h / week</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-600 text-xs text-center">Track coming soon</p>
        </div>

      </div>
    </main>
  )
}