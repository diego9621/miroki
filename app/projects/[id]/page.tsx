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

const priorityConfig: Record<string, { bg: string; text: string; border: string }> = {
  high: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  low: { bg: 'bg-zinc-800', text: 'text-zinc-400', border: 'border-zinc-700' },
}

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  idea: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  building: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  launched: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
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
    <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
      <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  )
}

function SummaryCard({ steps }: { steps: Step[] }) {
  const [expanded, setExpanded] = useState(false)

  const problem = steps.find(s => s.title === 'Describe the problem')?.answer
  const differentiator = steps.find(s => s.title === 'Define your one differentiator')?.answer
  const mvp = steps.find(s => s.title === 'Define your MVP in one feature')?.answer
  const stack = steps.find(s => s.title === 'Lock your stack')?.answer
  const shipDate = steps.find(s => s.title === 'Set a ship date')?.answer

  const answered = [problem, differentiator, mvp, stack, shipDate].filter(Boolean)
  if (answered.length === 0) return null

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl mb-6 overflow-hidden">
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Project summary</span>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md px-1.5 py-0.5">
            {answered.length} filled
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-zinc-800 flex flex-col gap-3 pt-4">
          {problem && (
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-600 text-xs">Problem</span>
              <span className="text-zinc-200 text-sm leading-relaxed">{problem}</span>
            </div>
          )}
          {differentiator && (
            <div className="flex flex-col gap-0.5 pt-3 border-t border-zinc-800">
              <span className="text-zinc-600 text-xs">Differentiator</span>
              <span className="text-zinc-200 text-sm leading-relaxed">{differentiator}</span>
            </div>
          )}
          {mvp && (
            <div className="flex flex-col gap-0.5 pt-3 border-t border-zinc-800">
              <span className="text-zinc-600 text-xs">MVP</span>
              <span className="text-zinc-200 text-sm leading-relaxed">{mvp}</span>
            </div>
          )}
          {stack && (
            <div className="flex flex-col gap-0.5 pt-3 border-t border-zinc-800">
              <span className="text-zinc-600 text-xs">Stack</span>
              <span className="text-zinc-200 text-sm leading-relaxed">{stack}</span>
            </div>
          )}
          {shipDate && (
            <div className="flex flex-col gap-0.5 pt-3 border-t border-zinc-800">
              <span className="text-zinc-600 text-xs">Ship date</span>
              <span className="text-emerald-400 text-sm font-medium">{shipDate}</span>
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
    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 mb-6 flex items-center gap-4">
      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      </div>
      <div>
        <p className="text-emerald-400 text-sm font-medium">All steps completed</p>
        <p className="text-emerald-600 text-xs mt-0.5">Your project is shipped. 🎉</p>
      </div>
    </div>
  )

  return (
    <div
      className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 mb-6 flex items-center gap-4 cursor-pointer hover:border-zinc-600 transition-colors group"
      onClick={() => onGo(nextStep.phase)}
    >
      <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-zinc-500 text-xs mb-0.5">Next step · {nextStep.phase}</p>
        <p className="text-white text-sm font-medium truncate">{nextStep.title}</p>
      </div>
      <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
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
  const [saving, setSaving] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { window.location.href = '/'; return }

      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', id)
        .eq('user_id', session.user.id)
        .single()

      if (!projectData) { setLoading(false); return }
      setProject(projectData)

      const { data: stepsData } = await supabase
        .from('steps')
        .select('*')
        .eq('project_id', projectData.id)
        .order('phase_order', { ascending: true })
        .order('step_order', { ascending: true })

      setSteps(stepsData ?? [])

      const initialAnswers: Record<number, string> = {}
      stepsData?.forEach(s => {
        if (s.answer) initialAnswers[s.id] = s.answer
      })
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
    setSteps(prev => prev.map(s =>
      s.id === stepId ? { ...s, answer, completed: answer.trim() !== '' } : s
    ))
    setSaving(null)
    setExpandedStep(null)
  }

  function handleGoToPhase(phase: string) {
    if (isPhaseUnlocked(phase)) setActivePhase(phase)
  }

  const phaseSteps = steps.filter(s => s.phase === activePhase)
  const completedCount = steps.filter(s => s.completed).length
  const totalCount = steps.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const activePhaseUnlocked = isPhaseUnlocked(activePhase)

  const pc = priorityConfig[project?.priority ?? 'medium']
  const sc = statusConfig[project?.status ?? 'idea']

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

        <div className="flex items-center gap-3 mb-3">
          <CategoryIcon category={project.category} />
          <h1 className="text-xl font-semibold text-white">{project.name}</h1>
        </div>

        <div className="flex gap-1.5 flex-wrap mb-6">
          <span className={`text-xs px-2 py-0.5 rounded-md border capitalize ${pc.bg} ${pc.text} ${pc.border}`}>
            {project.priority} priority
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-md border capitalize ${sc.bg} ${sc.text} ${sc.border}`}>
            {project.status}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-500 capitalize">
            {project.category}
          </span>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-zinc-500 text-xs">Overall progress</span>
            <span className={`text-xs font-medium ${progress === 100 ? 'text-emerald-400' : 'text-zinc-400'}`}>
              {completedCount}/{totalCount} · {progress}%
            </span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-1.5 bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <NextStepBanner steps={steps} onGo={handleGoToPhase} />
        <SummaryCard steps={steps} />

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
                title={!unlocked ? `Complete ${phases[phases.indexOf(phase) - 1]} first` : ''}
                className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  !unlocked
                    ? 'bg-zinc-900/40 border border-zinc-900 text-zinc-700 cursor-not-allowed'
                    : isActive
                      ? phaseCompleted
                        ? 'bg-emerald-500 text-white font-medium'
                        : 'bg-white text-black font-medium'
                      : phaseCompleted
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600'
                }`}
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
            <svg className="w-8 h-8 text-zinc-700 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="text-zinc-400 text-sm font-medium mb-1">Phase locked</p>
            <p className="text-zinc-600 text-xs mb-4">
              Complete all steps in {phases[phases.indexOf(activePhase) - 1]} first.
            </p>
            <button
              onClick={() => setActivePhase(phases[phases.indexOf(activePhase) - 1])}
              className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              ← Go to {phases[phases.indexOf(activePhase) - 1]}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {phaseSteps.map((step, index) => (
              <div
                key={step.id}
                className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                  step.completed
                    ? 'bg-zinc-900/50 border-emerald-500/15'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div
                  className="p-4 flex gap-3 cursor-pointer select-none"
                  onClick={() => setExpandedStep(prev => prev === step.id ? null : step.id)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleStep(step.id, step.completed)
                    }}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      step.completed
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-zinc-600 hover:border-emerald-500/70'
                    }`}
                  >
                    {step.completed && (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-zinc-600 text-xs">{index + 1}</span>
                      <p className={`text-sm font-medium ${step.completed ? 'line-through text-zinc-600' : 'text-white'}`}>
                        {step.title}
                      </p>
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed">{step.description}</p>
                    {step.answer && expandedStep !== step.id && (
                      <div className="mt-2 flex items-start gap-1.5">
                        <svg className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                        <p className="text-emerald-400/80 text-xs leading-relaxed line-clamp-1">{step.answer}</p>
                      </div>
                    )}
                  </div>

                  <svg
                    className={`w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5 transition-transform duration-200 ${expandedStep === step.id ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                {expandedStep === step.id && (
                  <div className="px-4 pb-4 border-t border-zinc-800 pt-3">
                    <textarea
                      className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-600 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500/40 transition-colors resize-none"
                      placeholder="Write your answer here..."
                      rows={3}
                      value={answers[step.id] ?? ''}
                      onChange={e => setAnswers(prev => ({ ...prev, [step.id]: e.target.value }))}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-zinc-600 text-xs">Saving will also mark this step as complete</p>
                      <button
                        onClick={() => saveAnswer(step.id)}
                        disabled={saving === step.id}
                        className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {saving === step.id ? (
                          <>
                            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            Saving
                          </>
                        ) : 'Save & complete →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}