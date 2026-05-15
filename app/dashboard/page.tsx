'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

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

export default function Dashboard() {
  const [email, setEmail] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { window.location.href = '/'; return }
      setEmail(session.user.email ?? '')

      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      setProjects(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleDelete(id: number) {
    setDeleting(id)
    await supabase.from('projects').delete().eq('id', id)
    setProjects(prev => prev.filter(p => p.id !== id))
    setDeleting(null)
  }

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
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-12">
      <div className="max-w-lg mx-auto">

        <div className="flex justify-between items-center mb-12">
          <div className="text-white text-xl">✦ Miroki</div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-500 text-sm">{email}</span>
            <button
              onClick={handleLogout}
              className="border border-zinc-800 text-zinc-400 rounded-xl px-3 py-1.5 text-xs hover:bg-zinc-900 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white font-semibold text-lg">Your projects</h1>
          <button
            onClick={() => window.location.href = '/onboarding'}
            className="bg-white text-black rounded-xl px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 transition-colors"
          >
            + New project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-sm mb-4">No projects yet.</p>
            <button
              onClick={() => window.location.href = '/onboarding'}
              className="bg-white text-black rounded-xl px-4 py-3 text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Start your first project →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => window.location.href = `/projects/${project.slug}`}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{categoryIcon[project.category] ?? '✦'}</span>
                    <h2 className="text-white font-medium">{project.name}</h2>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(project.id) }}
                    disabled={deleting === project.id}
                    className="text-zinc-600 hover:text-red-400 transition-colors text-xs"
                  >
                    {deleting === project.id ? '...' : 'Delete'}
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap">
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

                <div className="border-t border-zinc-800 pt-4 flex flex-col gap-2">
                  <div>
                    <p className="text-zinc-500 text-xs mb-0.5">Core feature</p>
                    <p className="text-zinc-300 text-sm">{project.core_feature}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs mb-0.5">Hours per week</p>
                    <p className="text-zinc-300 text-sm">{project.hours_per_week}h / week</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}