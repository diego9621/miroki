'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Project {
  id: number
  name: string
  core_feature: string
  hours_per_week: number
}

export default function Dashboard() {
  const [email, setEmail] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

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
              <div key={project.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-3">
                <h2 className="text-white font-medium">{project.name}</h2>
                <div className="flex flex-col gap-2">
                  <div>
                    <p className="text-zinc-500 text-xs mb-0.5">Core feature</p>
                    <p className="text-zinc-300 text-sm">{project.core_feature}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs mb-0.5">Hours per week</p>
                    <p className="text-zinc-300 text-sm">{project.hours_per_week} hours</p>
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