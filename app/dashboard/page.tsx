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
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) { 
        window.location.href = '/'
        return 
      }

      setEmail(session.user.email ?? '')

      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (projects && projects.length > 0) {
        setProject(projects[0])
      }

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

        {project ? (
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-zinc-500 text-sm mb-1">Your project</p>
              <h1 className="text-2xl font-semibold text-white">{project.name}</h1>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
              <div>
                <p className="text-zinc-500 text-xs mb-1">Core feature</p>
                <p className="text-white text-sm">{project.core_feature}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs mb-1">Hours per week</p>
                <p className="text-white text-sm">{project.hours_per_week} hours</p>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/onboarding'}
              className="text-zinc-600 text-xs text-center hover:text-zinc-400 transition-colors"
            >
              + Start a new project
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-zinc-500 text-sm mb-4">You have no projects yet.</p>
            <button
              onClick={() => window.location.href = '/onboarding'}
              className="bg-white text-black rounded-xl px-4 py-3 text-sm font-medium hover:bg-zinc-100 transition-colors"
            >
              Start your first project →
            </button>
          </div>
        )}
      </div>
    </main>
  )
}