'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import ThemeToggle from '../components/ThemeToggle'
import Logo from '../components/Logo'

interface Step {
  id: number
  completed: boolean
  title: string
  answer: string | null
}

interface Project {
  id: number
  slug: string
  name: string
  core_feature: string
  category: string
  priority: string
  status: string
  steps: Step[]
}

const categoryPaths: Record<string, string> = {
  saas: 'M13 10V3L4 14h7v7l9-11h-7z',
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  app: 'M12 18.178l-4.62-1.256-.328-3.544h2.27l.157 1.844 2.52.667 2.52-.667.26-2.866H6.96l-.635-6.678h11.35l-.227 2.21H8.822l.204 2.256h8.126l-.654 7.034L12 18.178z',
  content: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z',
  other: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
}

import React from 'react'

function getDaysUntil(dateStr: string): number | null {
  const parsed = new Date(dateStr)
  if (isNaN(parsed.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  parsed.setHours(0, 0, 0, 0)
  return Math.ceil((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function ShipDateBadge({ days }: { days: number }) {
  if (days < 0) return (
    <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(163,48,40,0.08)', color: 'var(--m-danger)', border: '0.5px solid rgba(163,48,40,0.2)' }}>
      {Math.abs(days)}d overdue
    </span>
  )
  if (days === 0) return (
    <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'var(--m-accent-subtle)', color: 'var(--m-accent)', border: '0.5px solid var(--m-accent-border)' }}>
      ships today
    </span>
  )
  if (days <= 3) return (
    <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(163,48,40,0.08)', color: 'var(--m-danger)', border: '0.5px solid rgba(163,48,40,0.2)' }}>
      {days}d left
    </span>
  )
  if (days <= 7) return (
    <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(180,140,60,0.08)', color: '#A07830', border: '0.5px solid rgba(180,140,60,0.2)' }}>
      {days}d left
    </span>
  )
  return (
    <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'var(--m-surface-2)', color: 'var(--m-text-muted)', border: '0.5px solid var(--m-border)' }}>
      {days}d left
    </span>
  )
}

function priorityStyle(priority: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    high: { background: 'rgba(163,48,40,0.08)', color: 'var(--m-danger)', border: '0.5px solid var(--m-danger-border)' },
    medium: { background: 'rgba(180,140,60,0.08)', color: '#A07830', border: '0.5px solid rgba(180,140,60,0.2)' },
    low: { background: 'var(--m-surface-2)', color: 'var(--m-text-secondary)', border: '0.5px solid var(--m-border)' },
  }
  return map[priority] ?? map.medium
}

function statusStyle(status: string): React.CSSProperties {
  const map: Record<string, React.CSSProperties> = {
    idea: { background: 'rgba(60,100,180,0.08)', color: '#4A72B8', border: '0.5px solid rgba(60,100,180,0.2)' },
    building: { background: 'rgba(100,70,160,0.08)', color: '#7A5AB8', border: '0.5px solid rgba(100,70,160,0.2)' },
    launched: { background: 'var(--m-accent-subtle)', color: 'var(--m-accent)', border: '0.5px solid var(--m-accent-border)' },
  }
  return map[status] ?? map.idea
}

function CategoryIcon({ category }: { category: string }) {
  const path = categoryPaths[category] ?? categoryPaths.other
  return (
    <div style={{ background: 'var(--m-surface-3)', border: '0.5px solid var(--m-border)' }}
      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">
      <svg className="w-3.5 h-3.5" style={{ color: 'var(--m-text-secondary)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  )
}

function AvatarMenu({ email, plan, onLogout }: { email: string, plan: string, onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initials = email.slice(0, 2).toUpperCase()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors"
      >
        {initials}
      </button>
      {open && (
        <div style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}
          className="absolute right-0 top-10 w-44 rounded-xl overflow-hidden z-50">
          <div style={{ borderBottom: '0.5px solid var(--m-border)' }} className="px-3 py-2.5">
            <p style={{ color: 'var(--m-text-muted)' }} className="text-xs truncate mb-1.5">{email}</p>
            <span
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={plan === 'pro'
                ? { background: 'var(--m-accent-subtle)', color: 'var(--m-accent)', border: '0.5px solid var(--m-accent-border)' }
                : { background: 'var(--m-surface-2)', color: 'var(--m-text-muted)', border: '0.5px solid var(--m-border)' }
                }
            >
                {plan === 'pro' ? 'Pro' : 'Free'}
            </span>
            </div>
          <button
            onClick={() => { setOpen(false); window.location.href = '/account' }}
            style={{ color: 'var(--m-text-primary)' }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:opacity-80 transition-opacity"
          >
            <svg className="w-4 h-4" style={{ color: 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Account
          </button>
          <button
            onClick={() => { setOpen(false); onLogout() }}
            style={{ color: 'var(--m-danger)', borderTop: '0.5px solid var(--m-border)' }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:opacity-80 transition-opacity"
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

const FREE_LIMIT = 3

export default function Dashboard() {
  const [email, setEmail] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [plan, setPlan] = useState<string>('free')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { window.location.href = '/'; return }
      setEmail(session.user.email ?? '')

      const [{ data: projectsData }, { data: profile }] = await Promise.all([
        supabase
          .from('projects')
          .select('*, steps(id, completed, title, answer)')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('profiles')
          .select('plan')
          .eq('id', session.user.id)
          .single()
      ])

      setProjects(projectsData ?? [])
      setPlan(profile?.plan ?? 'free')
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
    <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--m-bg)' }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--m-border-hover)' }} />
    </main>
  )

  const isPro = plan === 'pro'
  const atLimit = !isPro && projects.length >= FREE_LIMIT

  const totalSteps = projects.reduce((acc, p) => acc + (p.steps?.length ?? 0), 0)
  const completedSteps = projects.reduce((acc, p) => acc + (p.steps?.filter(s => s.completed).length ?? 0), 0)
  const shippedProjects = projects.filter(p => p.status === 'launched').length
  const activeProjects = projects.filter(p => p.status === 'building').length

  return (
    <main className="min-h-screen px-6 py-10" style={{ background: 'var(--m-bg)' }}>
      <div className="max-w-lg mx-auto">

        <div className="flex justify-between items-center mb-10">
          <button onClick={() => window.location.href = '/'} className="transition-opacity hover:opacity-80">
            <Logo />
          </button>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <AvatarMenu email={email} plan={plan} onLogout={handleLogout} />
          </div>
        </div>

        {projects.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-8">
            {[
              { label: 'Projects', value: projects.length, sub: `${activeProjects} active` },
              { label: 'Steps done', value: completedSteps, sub: `of ${totalSteps} total` },
              { label: 'Shipped', value: shippedProjects, sub: shippedProjects === 1 ? 'project' : 'projects' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-4" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
                <div className="text-xs mb-1" style={{ color: 'var(--m-text-muted)' }}>{s.label}</div>
                <div className="text-2xl font-semibold" style={{ color: 'var(--m-text-primary)' }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--m-text-secondary)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mb-5">
          <h1 className="font-semibold" style={{ color: 'var(--m-text-primary)' }}>Projects</h1>
          {!atLimit && (
            <button
              onClick={() => window.location.href = '/onboarding'}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-80"
              style={{ background: 'var(--m-accent)', color: 'white' }}
            >
              + New
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <h2 className="font-semibold mb-2" style={{ color: 'var(--m-text-primary)' }}>Ship your first project</h2>
            <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--m-text-secondary)' }}>
              Miroki gives you a clear, step-by-step track from idea to shipped.
            </p>
            <p className="text-xs leading-relaxed mb-8 max-w-xs" style={{ color: 'var(--m-text-muted)' }}>
              Lock in your stack. Follow the phases. No more half-finished projects collecting dust.
            </p>
            <button
              onClick={() => window.location.href = '/onboarding'}
              className="rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
              style={{ background: 'var(--m-accent)', color: 'white' }}
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
              const shipDateAnswer = project.steps?.find(s => s.title === 'Set a ship date')?.answer
              const shipDays = shipDateAnswer && project.status !== 'launched' ? getDaysUntil(shipDateAnswer) : null

              return (
                <div
                  key={project.id}
                  onClick={() => window.location.href = `/projects/${project.slug}`}
                  className="rounded-xl p-5 flex flex-col gap-3 cursor-pointer group transition-all"
                  style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <CategoryIcon category={project.category} />
                      <h2 className="text-sm font-medium" style={{ color: 'var(--m-text-primary)' }}>{project.name}</h2>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); window.location.href = `/projects/${project.slug}/edit` }}
                        className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                        style={{ color: 'var(--m-text-muted)' }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(project.id) }}
                        disabled={deleting === project.id}
                        className="p-1.5 rounded-lg transition-colors hover:opacity-70"
                        style={{ color: 'var(--m-danger)' }}
                      >
                        {deleting === project.id ? (
                          <div className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: 'var(--m-border-hover)' }} />
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-md capitalize" style={priorityStyle(project.priority)}>
                      {project.priority}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md capitalize" style={statusStyle(project.status)}>
                      {project.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md capitalize" style={{
                      border: '0.5px solid var(--m-border)',
                      background: 'var(--m-surface-2)',
                      color: 'var(--m-text-secondary)'
                    }}>
                      {project.category}
                    </span>
                    {shipDays !== null && <ShipDateBadge days={shipDays} />}
                  </div>

                  <p className="text-xs leading-relaxed" style={{ color: 'var(--m-text-muted)' }}>{project.core_feature}</p>

                  {totalSteps > 0 && (
                    <div style={{ borderTop: '0.5px solid var(--m-border)' }} className="pt-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>{completedSteps}/{totalSteps} steps</span>
                        <span className="text-xs font-medium" style={{ color: progress === 100 ? 'var(--m-accent)' : 'var(--m-text-muted)' }}>
                          {progress}%
                        </span>
                      </div>
                      <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--m-surface-3)' }}>
                        <div className="h-0.5 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%`, background: 'var(--m-accent)' }} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {atLimit && (
              <div
                className="rounded-xl p-5 flex flex-col gap-4 mt-1"
                style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-accent-border)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)' }}
                  >
                    <svg className="w-4 h-4" style={{ color: 'var(--m-accent)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--m-text-primary)' }}>Unlock unlimited projects</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--m-text-muted)' }}>You have used all {FREE_LIMIT} free project slots.</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {['Unlimited projects', 'All phases and steps', 'Growth tracking', 'Early access to new features'].map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                      <span className="text-xs" style={{ color: 'var(--m-text-secondary)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="w-full rounded-xl py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ background: 'var(--m-accent)', color: 'white' }}
                >
                  Upgrade to Pro →
                </button>
                <p className="text-xs text-center" style={{ color: 'var(--m-text-muted)' }}>
                  Free plan · {FREE_LIMIT}/{FREE_LIMIT} projects used
                </p>
              </div>
            )}

            {!atLimit && (
              <button
                onClick={() => window.location.href = '/onboarding'}
                className="rounded-xl p-5 flex items-center justify-center gap-2 transition-opacity hover:opacity-70"
                style={{ border: '0.5px dashed var(--m-border)', background: 'transparent' }}
              >
                <svg className="w-4 h-4" style={{ color: 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="text-sm" style={{ color: 'var(--m-text-muted)' }}>New project</span>
              </button>
            )}
          </div>
        )}

      </div>
    </main>
  )
}