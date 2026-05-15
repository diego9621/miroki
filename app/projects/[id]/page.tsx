'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

interface Project {
  id: number
  slug: string
  name: string
  core_feature: string
  category: string
  priority: string
  status: string
  stack: string[]
}

interface Step {
  id: number
  phase: string
  phase_order: number
  title: string
  description: string
  step_order: number
  completed: boolean
  answer: string | null
}

const phases = ['Clarify', 'Plan', 'Stack', 'Build', 'Launch', 'Track']

const categoryPaths: Record<string, string> = {
  saas: 'M13 10V3L4 14h7v7l9-11h-7z',
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  app: 'M12 18.178l-4.62-1.256-.328-3.544h2.27l.157 1.844 2.52.667 2.52-.667.26-2.866H6.96l-.635-6.678h11.35l-.227 2.21H8.822l.204 2.256h8.126l-.654 7.034L12 18.178z',
  content: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z',
  other: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
}

const stackTools = [
  { category: 'Frontend', tools: [
    { id: 'nextjs', name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { id: 'remix', name: 'Remix', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/remix/remix-original.svg' },
    { id: 'astro', name: 'Astro', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg' },
    { id: 'svelte', name: 'SvelteKit', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg' },
  ]},
  { category: 'Database & Backend', tools: [
    { id: 'supabase', name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
    { id: 'firebase', name: 'Firebase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    { id: 'neon', name: 'Neon', logo: 'https://neon.tech/favicon/favicon.svg' },
    { id: 'planetscale', name: 'PlanetScale', logo: 'https://cdn.brandfetch.io/idj9KAIbPK/w/400/h/400/theme/dark/icon.png' },
  ]},
  { category: 'Auth', tools: [
    { id: 'supabase-auth', name: 'Supabase Auth', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
    { id: 'clerk', name: 'Clerk', logo: 'https://clerk.com/favicon.ico' },
    { id: 'nextauth', name: 'NextAuth', logo: 'https://next-auth.js.org/img/logo/logo-sm.png' },
  ]},
  { category: 'Hosting', tools: [
    { id: 'vercel', name: 'Vercel', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
    { id: 'netlify', name: 'Netlify', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg' },
    { id: 'railway', name: 'Railway', logo: 'https://railway.app/favicon.ico' },
    { id: 'flyio', name: 'Fly.io', logo: 'https://fly.io/static/images/brand/logo.svg' },
  ]},
  { category: 'Payments', tools: [
    { id: 'stripe', name: 'Stripe', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/stripe/stripe-original.svg' },
    { id: 'lemonsqueezy', name: 'Lemon Squeezy', logo: 'https://www.lemonsqueezy.com/favicon.ico' },
  ]},
  { category: 'Code', tools: [
    { id: 'github', name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { id: 'gitlab', name: 'GitLab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg' },
  ]},
]

const allTools = stackTools.flatMap(g => g.tools)

function CategoryIcon({ category }: { category: string }) {
  const path = categoryPaths[category] ?? categoryPaths.other
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
      style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)' }}>
      <svg className="w-4 h-4" style={{ color: 'var(--m-text-secondary)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  )
}

function SummaryCard({ steps, stack }: { steps: Step[], stack: string[] }) {
  const [expanded, setExpanded] = useState(false)
  const problem = steps.find(s => s.title === 'Describe the problem')?.answer
  const differentiator = steps.find(s => s.title === 'Define your one differentiator')?.answer
  const mvp = steps.find(s => s.title === 'Define your MVP in one feature')?.answer
  const shipDate = steps.find(s => s.title === 'Set a ship date')?.answer
  const selectedTools = stack.map(id => allTools.find(t => t.id === id)).filter(Boolean)
  const answered = [problem, differentiator, mvp, shipDate, stack.length > 0 ? 'stack' : null].filter(Boolean)
  if (answered.length === 0) return null

  return (
    <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 transition-opacity hover:opacity-80"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>Project summary</span>
          <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--m-accent-subtle)', color: 'var(--m-accent)', border: '0.5px solid var(--m-accent-border)' }}>
            {answered.length} filled
          </span>
        </div>
        <svg className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          style={{ color: 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 flex flex-col gap-3 pt-4" style={{ borderTop: '0.5px solid var(--m-border)' }}>
          {problem && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Problem</span>
              <span className="text-sm leading-relaxed" style={{ color: 'var(--m-text-primary)' }}>{problem}</span>
            </div>
          )}
          {differentiator && (
            <div className="flex flex-col gap-0.5 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}>
              <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Differentiator</span>
              <span className="text-sm leading-relaxed" style={{ color: 'var(--m-text-primary)' }}>{differentiator}</span>
            </div>
          )}
          {mvp && (
            <div className="flex flex-col gap-0.5 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}>
              <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>MVP</span>
              <span className="text-sm leading-relaxed" style={{ color: 'var(--m-text-primary)' }}>{mvp}</span>
            </div>
          )}
          {selectedTools.length > 0 && (
            <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}>
              <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Stack</span>
              <div className="flex flex-wrap gap-2">
                {selectedTools.map(tool => tool && (
                  <div key={tool.id} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1"
                    style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)' }}>
                    <img src={tool.logo} alt={tool.name} className="w-3.5 h-3.5 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    <span className="text-xs" style={{ color: 'var(--m-text-secondary)' }}>{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {shipDate && (
            <div className="flex flex-col gap-0.5 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}>
              <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Ship date</span>
              <span className="text-sm font-medium" style={{ color: 'var(--m-accent)' }}>{shipDate}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function NextStepBanner({ steps, onGo }: { steps: Step[], onGo: (phase: string) => void }) {
  const nextStep = steps.find(s => !s.completed)
  if (!nextStep) return (
    <div className="rounded-2xl p-5 mb-6 flex items-center gap-4"
      style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)' }}>
        <svg className="w-5 h-5" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--m-accent)' }}>All steps completed</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--m-text-muted)' }}>Your project is shipped.</p>
      </div>
    </div>
  )

  return (
    <div
      className="rounded-2xl p-5 mb-6 flex items-center gap-4 cursor-pointer group transition-opacity hover:opacity-80"
      style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border-hover)' }}
      onClick={() => onGo(nextStep.phase)}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)' }}>
        <svg className="w-4 h-4" style={{ color: 'var(--m-accent)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-0.5" style={{ color: 'var(--m-text-muted)' }}>Next step · {nextStep.phase}</p>
        <p className="text-sm font-medium truncate" style={{ color: 'var(--m-text-primary)' }}>{nextStep.title}</p>
      </div>
      <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </div>
  )
}

function StackSelector({ selected, onChange }: { selected: string[], onChange: (stack: string[]) => void }) {
  function toggle(toolId: string) {
    onChange(selected.includes(toolId) ? selected.filter(s => s !== toolId) : [...selected, toolId])
  }

  return (
    <div className="flex flex-col gap-4">
      {stackTools.map(group => (
        <div key={group.category}>
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--m-text-muted)' }}>{group.category}</p>
          <div className="flex flex-wrap gap-2">
            {group.tools.map(tool => {
              const isSelected = selected.includes(tool.id)
              return (
                <button
                  key={tool.id}
                  onClick={() => toggle(tool.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={isSelected
                    ? { background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)', color: 'var(--m-accent)' }
                    : { background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }
                  }
                >
                  <img src={tool.logo} alt={tool.name} className="w-4 h-4 rounded object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  {tool.name}
                  {isSelected && (
                    <svg className="w-3 h-3" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProjectPage() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [steps, setSteps] = useState<Step[]>([])
  const [activePhase, setActivePhase] = useState('Clarify')
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedStack, setSelectedStack] = useState<string[]>([])
  const [savingStack, setSavingStack] = useState(false)
  const [saving, setSaving] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { window.location.href = '/'; return }

      const { data: projectData } = await supabase
        .from('projects').select('*').eq('slug', id).eq('user_id', session.user.id).single()

      if (!projectData) { setLoading(false); return }
      setProject(projectData)
      setSelectedStack(projectData.stack ?? [])

      const { data: stepsData } = await supabase
        .from('steps').select('*').eq('project_id', projectData.id)
        .order('phase_order', { ascending: true }).order('step_order', { ascending: true })

      setSteps(stepsData ?? [])
      const initialAnswers: Record<number, string> = {}
      stepsData?.forEach(s => { if (s.answer) initialAnswers[s.id] = s.answer })
      setAnswers(initialAnswers)
      setLoading(false)
    }
    load()
  }, [id])

  function isPhaseUnlocked(phase: string): boolean {
    const phaseIndex = phases.indexOf(phase)
    if (phaseIndex === 0) return true
    const previousPhase = phases[phaseIndex - 1]
    const previousSteps = steps.filter(s => s.phase === previousPhase)
    return previousSteps.length > 0 && previousSteps.every(s => s.completed)
  }

  async function toggleStep(stepId: number, completed: boolean) {
    await supabase.from('steps').update({ completed: !completed }).eq('id', stepId)
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, completed: !completed } : s))
  }

  async function saveAnswer(stepId: number) {
    setSaving(stepId)
    const answer = answers[stepId] ?? ''
    await supabase.from('steps').update({ answer, completed: answer.trim() !== '' }).eq('id', stepId)
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, answer, completed: answer.trim() !== '' } : s))
    setSaving(null)
    setExpandedStep(null)
  }

  async function saveStack(stack: string[]) {
    setSavingStack(true)
    setSelectedStack(stack)
    await supabase.from('projects').update({ stack }).eq('slug', id as string)
    setProject(prev => prev ? { ...prev, stack } : prev)
    setSavingStack(false)
    const lockStep = steps.find(s => s.title === 'Lock your stack')
    if (lockStep && !lockStep.completed && stack.length > 0) {
      const stackNames = allTools.filter(t => stack.includes(t.id)).map(t => t.name).join(', ')
      await supabase.from('steps').update({ completed: true, answer: stackNames }).eq('id', lockStep.id)
      setSteps(prev => prev.map(s => s.id === lockStep.id ? { ...s, completed: true, answer: stackNames } : s))
    }
  }

  const phaseSteps = steps.filter(s => s.phase === activePhase)
  const completedCount = steps.filter(s => s.completed).length
  const totalCount = steps.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const activePhaseUnlocked = isPhaseUnlocked(activePhase)

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--m-bg)' }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--m-border-hover)' }} />
    </main>
  )

  if (!project) return (
    <main className="flex min-h-screen items-center justify-center" style={{ background: 'var(--m-bg)' }}>
      <p className="text-sm" style={{ color: 'var(--m-text-secondary)' }}>Project not found.</p>
    </main>
  )

  return (
    <main className="min-h-screen px-6 py-10" style={{ background: 'var(--m-bg)' }}>
      <div className="max-w-lg mx-auto">

        <div className="flex items-center justify-between mb-10">
          <button onClick={() => window.location.href = '/dashboard'}
            className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity"
            style={{ color: 'var(--m-text-secondary)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <button onClick={() => window.location.href = `/projects/${project.slug}/edit`}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs hover:opacity-70 transition-opacity"
            style={{ border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
            Edit
          </button>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <CategoryIcon category={project.category} />
          <h1 className="text-xl font-semibold" style={{ color: 'var(--m-text-primary)' }}>{project.name}</h1>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-6">
          {[
            { label: project.priority + ' priority', style: { background: 'rgba(163,48,40,0.08)', color: 'var(--m-danger)', border: '0.5px solid var(--m-danger-border)' } },
            { label: project.status, style: project.status === 'building'
              ? { background: 'rgba(100,70,160,0.08)', color: '#7A5AB8', border: '0.5px solid rgba(100,70,160,0.2)' }
              : project.status === 'launched'
                ? { background: 'var(--m-accent-subtle)', color: 'var(--m-accent)', border: '0.5px solid var(--m-accent-border)' }
                : { background: 'rgba(60,100,180,0.08)', color: '#4A72B8', border: '0.5px solid rgba(60,100,180,0.2)' }
            },
            { label: project.category, style: { background: 'var(--m-surface-2)', color: 'var(--m-text-secondary)', border: '0.5px solid var(--m-border)' } },
          ].map(b => (
            <span key={b.label} className="text-xs px-2 py-0.5 rounded-md capitalize" style={b.style}>{b.label}</span>
          ))}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Overall progress</span>
            <span className="text-xs font-medium" style={{ color: progress === 100 ? 'var(--m-accent)' : 'var(--m-text-secondary)' }}>
              {completedCount}/{totalCount} · {progress}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--m-surface-3)' }}>
            <div className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: 'var(--m-accent)' }} />
          </div>
        </div>

        <NextStepBanner steps={steps} onGo={(phase) => isPhaseUnlocked(phase) && setActivePhase(phase)} />
        <SummaryCard steps={steps} stack={selectedStack} />

        <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
          {phases.map(phase => {
            const phaseStepsAll = steps.filter(s => s.phase === phase)
            const phaseCompleted = phaseStepsAll.every(s => s.completed) && phaseStepsAll.length > 0
            const unlocked = isPhaseUnlocked(phase)
            const isActive = activePhase === phase
            return (
              <button
                key={phase}
                onClick={() => unlocked && setActivePhase(phase)}
                disabled={!unlocked}
                className="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all flex items-center gap-1.5"
                style={
                  !unlocked
                    ? { background: 'transparent', border: '0.5px solid var(--m-border)', color: 'var(--m-text-muted)', opacity: 0.4, cursor: 'not-allowed' }
                    : isActive
                      ? phaseCompleted
                        ? { background: 'var(--m-accent)', color: 'white', border: '0.5px solid var(--m-accent)', fontWeight: 500 }
                        : { background: 'var(--m-text-primary)', color: 'var(--m-bg)', border: '0.5px solid var(--m-text-primary)', fontWeight: 500 }
                      : phaseCompleted
                        ? { background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)', color: 'var(--m-accent)' }
                        : { background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }
                }
              >
                {!unlocked ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                ) : phaseCompleted ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                ) : null}
                {phase}
              </button>
            )
          })}
        </div>

        {!activePhaseUnlocked ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
            <svg className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--m-border-hover)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--m-text-secondary)' }}>Phase locked</p>
            <p className="text-xs mb-4" style={{ color: 'var(--m-text-muted)' }}>
              Complete all steps in {phases[phases.indexOf(activePhase) - 1]} first.
            </p>
            <button
              onClick={() => setActivePhase(phases[phases.indexOf(activePhase) - 1])}
              className="text-xs hover:opacity-70 transition-opacity"
              style={{ color: 'var(--m-accent)' }}
            >
              ← Go to {phases[phases.indexOf(activePhase) - 1]}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {phaseSteps.map((step, index) => {
              const isStackStep = step.title === 'Lock your stack'
              return (
                <div key={step.id} className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    background: 'var(--m-surface-1)',
                    border: step.completed
                      ? '0.5px solid var(--m-accent-border)'
                      : '0.5px solid var(--m-border)'
                  }}>
                  <div className="p-4 flex gap-3 cursor-pointer select-none"
                    onClick={() => setExpandedStep(prev => prev === step.id ? null : step.id)}>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (!isStackStep) toggleStep(step.id, step.completed) }}
                      className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                      style={step.completed
                        ? { background: 'var(--m-accent)', border: '2px solid var(--m-accent)' }
                        : isStackStep
                          ? { border: '2px solid var(--m-border-hover)' }
                          : { border: '2px solid var(--m-border-hover)' }
                      }
                    >
                      {step.completed && (
                        <svg className="w-2.5 h-2.5" fill="currentColor" style={{ color: 'white' }} viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>{index + 1}</span>
                        <p className="text-sm font-medium" style={{
                          color: step.completed ? 'var(--m-text-muted)' : 'var(--m-text-primary)',
                          textDecoration: step.completed ? 'line-through' : 'none'
                        }}>
                          {step.title}
                        </p>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--m-text-muted)' }}>{step.description}</p>

                      {isStackStep && selectedStack.length > 0 && expandedStep !== step.id && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {allTools.filter(t => selectedStack.includes(t.id)).map(tool => (
                            <div key={tool.id} className="flex items-center gap-1 rounded-md px-2 py-0.5"
                              style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)' }}>
                              <img src={tool.logo} alt={tool.name} className="w-3 h-3 object-contain"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                              <span className="text-xs" style={{ color: 'var(--m-text-secondary)' }}>{tool.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {!isStackStep && step.answer && expandedStep !== step.id && (
                        <div className="mt-2 flex items-start gap-1.5">
                          <svg className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                          <p className="text-xs leading-relaxed line-clamp-1" style={{ color: 'var(--m-accent)' }}>{step.answer}</p>
                        </div>
                      )}
                    </div>

                    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-transform duration-200 ${expandedStep === step.id ? 'rotate-180' : ''}`}
                      style={{ color: 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>

                  {expandedStep === step.id && (
                    <div className="px-4 pb-4 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}>
                      {isStackStep ? (
                        <>
                          <StackSelector selected={selectedStack} onChange={saveStack} />
                          {selectedStack.length > 0 && (
                            <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}>
                              <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>{selectedStack.length} tool{selectedStack.length !== 1 ? 's' : ''} selected</p>
                              <button
                                onClick={() => setExpandedStep(null)}
                                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80 flex items-center gap-1.5"
                                style={{ background: 'var(--m-accent)', color: 'white' }}
                              >
                                {savingStack && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />}
                                Lock stack →
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <textarea
                            className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors resize-none"
                            style={{
                              background: 'var(--m-surface-2)',
                              border: '0.5px solid var(--m-border)',
                              color: 'var(--m-text-primary)',
                              caretColor: 'var(--m-accent)'
                            }}
                            placeholder="Write your answer here..."
                            rows={3}
                            value={answers[step.id] ?? ''}
                            onChange={e => setAnswers(prev => ({ ...prev, [step.id]: e.target.value }))}
                          />
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Saving will also mark this step as complete</p>
                            <button
                              onClick={() => saveAnswer(step.id)}
                              disabled={saving === step.id}
                              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50 flex items-center gap-1.5"
                              style={{ background: 'var(--m-accent)', color: 'white' }}
                            >
                              {saving === step.id ? (
                                <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Saving</>
                              ) : 'Save & complete →'}
                            </button>
                          </div>
                        </>
                      )}
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