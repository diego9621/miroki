import { supabase } from '../../lib/supabase'
import Logo from '../../components/Logo'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const phases = ['Clarify', 'Plan', 'Stack', 'Build', 'Launch', 'Track']

const categoryPaths: Record<string, string> = {
  saas: 'M13 10V3L4 14h7v7l9-11h-7z',
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  app: 'M12 18.178l-4.62-1.256-.328-3.544h2.27l.157 1.844 2.52.667 2.52-.667.26-2.866H6.96l-.635-6.678h11.35l-.227 2.21H8.822l.204 2.256h8.126l-.654 7.034L12 18.178z',
  content: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z',
  other: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
}

export default async function PublicProjectPage({ params }: { params: { id: string } }) {
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('public_id', params.id)
    .eq('is_public', true)
    .single()

  if (!project) notFound()

  const { data: steps } = await supabase
    .from('steps')
    .select('*')
    .eq('project_id', project.id)
    .order('phase_order', { ascending: true })
    .order('step_order', { ascending: true })

  const completedCount = steps?.filter(s => s.completed).length ?? 0
  const totalCount = steps?.length ?? 0
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const categoryPath = categoryPaths[project.category] ?? categoryPaths.other

  return (
    <main className="min-h-screen px-6 py-10" style={{ background: 'var(--m-bg)' }}>
      <div className="max-w-lg mx-auto">

        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <Link
            href="/"
            className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: 'var(--m-accent)', color: 'white' }}
          >
            Try Miroki →
          </Link>
        </div>

        {/* Project header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)' }}>
              <svg className="w-4 h-4" style={{ color: 'var(--m-text-secondary)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={categoryPath} />
              </svg>
            </div>
            <h1 className="text-xl font-semibold truncate" style={{ color: 'var(--m-text-primary)' }}>{project.name}</h1>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded-md ml-3 flex-shrink-0"
            style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-muted)' }}
          >
            Public
          </span>
        </div>

        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--m-text-muted)' }}>{project.core_feature}</p>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Overall progress</span>
            <span className="text-xs font-medium" style={{ color: progress === 100 ? 'var(--m-accent)' : 'var(--m-text-secondary)' }}>
              {completedCount}/{totalCount} · {progress}%
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--m-surface-3)' }}>
            <div className="h-1.5 rounded-full" style={{ width: `${progress}%`, background: 'var(--m-accent)' }} />
          </div>
        </div>

        {/* Phases */}
        <div className="flex flex-col gap-6">
          {phases.map(phase => {
            const phaseSteps = steps?.filter(s => s.phase === phase) ?? []
            if (phaseSteps.length === 0) return null
            const phaseCompleted = phaseSteps.every(s => s.completed)
            const phaseDone = phaseSteps.filter(s => s.completed).length

            return (
              <div key={phase}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: phaseCompleted ? 'var(--m-accent)' : 'var(--m-text-muted)' }}>
                    {phase}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>
                    {phaseDone}/{phaseSteps.length}
                  </span>
                  {phaseCompleted && (
                    <svg className="w-3.5 h-3.5" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {phaseSteps.map(step => (
                    <div
                      key={step.id}
                      className="rounded-xl p-4 flex items-start gap-3"
                      style={{ background: 'var(--m-surface-1)', border: step.completed ? '0.5px solid var(--m-accent-border)' : '0.5px solid var(--m-border)' }}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={step.completed ? { background: 'var(--m-accent)', border: '2px solid var(--m-accent)' } : { border: '2px solid var(--m-border-hover)' }}
                      >
                        {step.completed && (
                          <svg className="w-2.5 h-2.5" fill="white" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: step.completed ? 'var(--m-text-muted)' : 'var(--m-text-primary)', textDecoration: step.completed ? 'line-through' : 'none' }}>
                          {step.title}
                        </p>
                        {step.answer && (
                          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--m-accent)' }}>{step.answer}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 rounded-2xl p-6 text-center" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--m-text-primary)' }}>Built with Miroki</p>
          <p className="text-xs mb-4" style={{ color: 'var(--m-text-muted)' }}>Stop rebuilding. Start finishing.</p>
          <Link
            href="/"
            className="inline-flex px-5 py-2.5 rounded-xl text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: 'var(--m-accent)', color: 'white' }}
          >
            Start your own track →
          </Link>
        </div>

      </div>
    </main>
  )
}