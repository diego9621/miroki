'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Step {
  id: number
  completed: boolean
}

interface Project {
  id: number
  slug: string
  name: string
  core_feature: string
  hours_per_week: number
  category: string
  priority: string
  status: string
  steps: Step[]
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
    <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
      <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  )
}

function Avatar({ email }: { email: string }) {
  const initials = email.slice(0, 2).toUpperCase()
  return (
    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300">
      {initials}
    </div>
  )
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
        .select('*, steps(id, completed)')
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
      <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse" />
    </main>
  )

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-10">
      <div className="max-w-lg mx-auto">

        <div className="flex justify-between items-center mb-10">
          <span className="text-white font-medium tracking-tight">✦ Miroki</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <Avatar email={email} />
          </button>
        </div>

        <div className="flex justify-between items-center mb-5">
          <h1 className="text-white font-semibold">Projects</h1>
          <button
            onClick={() => window.location.href = '/onboarding'}
            className="bg-white text-black rounded-lg px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 transition-colors"
          >
            + New
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
          <div className="flex flex-col gap-3">
            {projects.map(project => {
              const completedSteps = project.steps?.filter(s => s.completed).length ?? 0
              const totalSteps = project.steps?.length ?? 0
              const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

              return (
                <div
                  key={project.id}
                  onClick={() => window.location.href = `/projects/${project.slug}`}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col gap-3 hover:border-zinc-700 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <CategoryIcon category={project.category} />
                      <h2 className="text-white text-sm font-medium">{project.name}</h2>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.location.href = `/projects/${project.slug}/edit`
                        }}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
                        title="Edit"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(project.id) }}
                        disabled={deleting === project.id}
                        className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        {deleting === project.id ? (
                          <div className="w-3.5 h-3.5 border border-zinc-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-md border capitalize ${priorityColor[project.priority] ?? priorityColor.medium}`}>
                      {project.priority}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-md border capitalize ${statusColor[project.status] ?? statusColor.idea}`}>
                      {project.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-500 capitalize">
                      {project.category}
                    </span>
                  </div>

                  <p className="text-zinc-500 text-xs leading-relaxed">{project.core_feature}</p>

                  {totalSteps > 0 && (
                    <div className="border-t border-zinc-800 pt-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-zinc-600 text-xs">{completedSteps}/{totalSteps} steps</span>
                        <span className="text-zinc-600 text-xs">{progress}%</span>
                      </div>
                      <div className="h-0.5 bg-zinc-800 rounded-full">
                        <div
                          className="h-0.5 bg-white rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}