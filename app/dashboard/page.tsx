'use client'

import { useEffect, useState, useRef } from 'react'
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
  low: 'bg-zinc-800 text-zinc-400 border-zinc-700',
}

const statusColor: Record<string, string> = {
  idea: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  building: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  launched: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

const categoryPaths: Record<string, string> = {
  saas: 'M13 10V3L4 14h7v7l9-11h-7z',
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  app: 'M12 18.178l-4.62-1.256-.328-3.544h2.27l.157 1.844 2.52.667 2.52-.667.26-2.866H6.96l-.635-6.678h11.35l-.227 2.21H8.822l.204 2.256h8.126l-.654 7.034L12 18.178z',
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

function AvatarMenu({ email, onLogout }: { email: string, onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initials = email.slice(0, 2).toUpperCase()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300 hover:border-zinc-600 transition-colors"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-44 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl z-50">
          <div className="px-3 py-2.5 border-b border-zinc-800">
            <p className="text-zinc-500 text-xs truncate">{email}</p>
          </div>
          <button
            onClick={() => { setOpen(false); window.location.href = '/account' }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-zinc-300 hover:bg-zinc-800 transition-colors text-sm"
          >
            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Account
          </button>
          <button
            onClick={() => { setOpen(false); onLogout() }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-red-400 hover:bg-zinc-800 transition-colors text-sm border-t border-zinc-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign out
          </button>
        </div>
      )}
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
          <AvatarMenu email={email} onLogout={handleLogout} />
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
          <div className="flex flex-col items-center text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
              <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h2 className="text-white font-semibold mb-2">Ship your first project</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-2">
              Miroki gives you a clear, step-by-step track from idea to shipped.
            </p>
            <p className="text-zinc-600 text-xs leading-relaxed mb-8 max-w-xs">
              Lock in your stack. Follow the phases. No more half-finished projects collecting dust.
            </p>
            <button
              onClick={() => window.location.href = '/onboarding'}
              className="bg-white text-black rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 transition-colors"
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
                        <span className={`text-xs font-medium ${progress === 100 ? 'text-emerald-500' : 'text-zinc-500'}`}>
                          {progress}%
                        </span>
                      </div>
                      <div className="h-0.5 bg-zinc-800 rounded-full">
                        <div
                          className="h-0.5 bg-emerald-500 rounded-full transition-all duration-500"
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