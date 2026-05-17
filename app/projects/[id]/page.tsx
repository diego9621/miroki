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
  { category: 'Frontend', tools: [{ id: 'nextjs', name: 'Next.js' }, { id: 'remix', name: 'Remix' }, { id: 'astro', name: 'Astro' }, { id: 'svelte', name: 'SvelteKit' }] },
  { category: 'Database & Backend', tools: [{ id: 'supabase', name: 'Supabase' }, { id: 'firebase', name: 'Firebase' }, { id: 'neon', name: 'Neon' }, { id: 'planetscale', name: 'PlanetScale' }] },
  { category: 'Auth', tools: [{ id: 'supabase-auth', name: 'Supabase Auth' }, { id: 'clerk', name: 'Clerk' }, { id: 'nextauth', name: 'NextAuth' }] },
  { category: 'Hosting', tools: [{ id: 'vercel', name: 'Vercel' }, { id: 'netlify', name: 'Netlify' }, { id: 'railway', name: 'Railway' }, { id: 'flyio', name: 'Fly.io' }] },
  { category: 'Payments', tools: [{ id: 'stripe', name: 'Stripe' }, { id: 'lemonsqueezy', name: 'Lemon Squeezy' }] },
  { category: 'Code', tools: [{ id: 'github', name: 'GitHub' }, { id: 'gitlab', name: 'GitLab' }] },
]

const allTools = stackTools.flatMap(g => g.tools)

function getDaysUntil(dateStr: string): number | null {
  const parsed = new Date(dateStr)
  if (isNaN(parsed.getTime())) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  parsed.setHours(0, 0, 0, 0)
  return Math.ceil((parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function ShipDateBanner({ days, dateStr }: { days: number, dateStr: string }) {
  if (days < 0) {
    return (
      <div className="rounded-xl px-4 py-3 mb-6 flex items-center gap-3"
        style={{ background: 'rgba(163,48,40,0.06)', border: '0.5px solid rgba(163,48,40,0.2)' }}>
        <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--m-danger)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--m-danger)' }}>Ship date passed {Math.abs(days)} day{Math.abs(days) !== 1 ? 's' : ''} ago</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--m-text-muted)' }}>You planned to ship on {dateStr}. Time to push it out.</p>
        </div>
      </div>
    )
  }

  if (days === 0) {
    return (
      <div className="rounded-xl px-4 py-3 mb-6 flex items-center gap-3"
        style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)' }}>
        <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--m-accent)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--m-accent)' }}>Today is your ship date</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--m-text-muted)' }}>You planned to launch today. Ship it.</p>
        </div>
      </div>
    )
  }

  const urgent = days <= 3
  const warning = days <= 7

  return (
    <div className="rounded-xl px-4 py-3 mb-6 flex items-center gap-3"
      style={{
        background: urgent ? 'rgba(163,48,40,0.06)' : warning ? 'rgba(180,140,60,0.06)' : 'var(--m-surface-1)',
        border: urgent ? '0.5px solid rgba(163,48,40,0.2)' : warning ? '0.5px solid rgba(180,140,60,0.2)' : '0.5px solid var(--m-border)'
      }}>
      <svg className="w-4 h-4 flex-shrink-0" style={{ color: urgent ? 'var(--m-danger)' : warning ? '#A07830' : 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
      </svg>
      <div>
        <p className="text-sm font-medium" style={{ color: urgent ? 'var(--m-danger)' : warning ? '#A07830' : 'var(--m-text-primary)' }}>
          {days} day{days !== 1 ? 's' : ''} until ship date
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--m-text-muted)' }}>
          {urgent ? 'Almost there. Finish what matters, ship the rest.' : warning ? 'One week left. Stay focused.' : `Planned for ${dateStr}.`}
        </p>
      </div>
    </div>
  )
}

function ToolLogo({ id, size = 14 }: { id: string, size?: number }) {
  const logos: Record<string, React.ReactNode> = {
    nextjs: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#000"/><path d="M4.5 19.5V4.5h4.5l6 10V4.5H19.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    svelte: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#FF3E00"/><path d="M17 7c-1.5-2-4.5-2.5-6.5-1L6 9.5C4.8 10.3 4 11.5 3.8 12.8c-.1 1 .1 2 .7 2.8-.5.7-.6 1.6-.4 2.4.3 1.7 1.8 3 3.5 3 .4 0 .8-.1 1.2-.2l4.8-3c1.2-.8 2-2 2.2-3.3.1-1-.1-2-.7-2.8.5-.7.6-1.6.4-2.4z" fill="white" fillOpacity="0.9"/></svg>,
    supabase: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#1C1C1C"/><path d="M11.9 4L5 14.5h6l-1 5.5 8-10.5H12l1-5.5z" fill="#3ECF8E"/></svg>,
    'supabase-auth': <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#1C1C1C"/><path d="M11.9 4L5 14.5h6l-1 5.5 8-10.5H12l1-5.5z" fill="#3ECF8E"/></svg>,
    firebase: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#1C1C1C"/><path d="M5.5 17.5L8 7l3 4.5L13 4l5.5 13.5z" fill="#FFA000"/><path d="M5.5 17.5l7-4.5 1 4.5z" fill="#F57C00"/><path d="M13 4l1 9-7 4.5z" fill="#FFCA28"/></svg>,
    vercel: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#000"/><path d="M12 5L21 19H3L12 5z" fill="white"/></svg>,
    netlify: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#00AD9F"/><path d="M9 7h6M12 4v6M9 17h6M12 14v6M5 12h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    github: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#24292E"/><path d="M12 3C7 3 3 7 3 12c0 4 2.6 7.4 6.2 8.6.5.1.6-.2.6-.4v-1.6c-2.6.6-3.1-1.2-3.1-1.2-.4-1.1-1-1.4-1-1.4-.8-.6.1-.6.1-.6.9.1 1.4 1 1.4 1 .8 1.4 2.1 1 2.7.8.1-.6.3-1 .5-1.2-2.1-.2-4.2-1-4.2-4.6 0-1 .4-1.9 1-2.5-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.5.6.6 1 1.5 1 2.5 0 3.6-2.2 4.4-4.3 4.6.3.3.6.8.6 1.7V20c0 .2.1.5.6.4C18.4 19.4 21 16 21 12c0-5-4-9-9-9z" fill="white"/></svg>,
    gitlab: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#FC6D26"/><path d="M12 19l-7-5 2.5-8 1.5 4h6l1.5-4L19 14z" fill="white" fillOpacity="0.9"/></svg>,
    stripe: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#635BFF"/><path d="M11.5 9.5c0-.8.7-1.1 1.8-1.1 1.6 0 3.2.5 4.7 1.3V6.2C16.5 5.4 14.9 5 13.3 5 9.9 5 7.6 6.7 7.6 9.7c0 4.6 6.3 3.9 6.3 5.9 0 .9-.8 1.2-2 1.2-1.7 0-3.6-.7-5.2-1.7v3.6c1.8.8 3.5 1.2 5.2 1.2 3.5 0 5.9-1.7 5.9-4.8 0-4.8-6.3-4-6.3-5.6z" fill="white"/></svg>,
    clerk: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#6C47FF"/><circle cx="12" cy="9" r="3.5" fill="white"/><path d="M5 19c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>,
    neon: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#00E5BF"/><path d="M5 7h14v6l-4 4H5V7z" fill="#0A0A0A"/><path d="M15 17l4-4v4h-4z" fill="#00E5BF"/></svg>,
    railway: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#0B0D0E"/><path d="M12 4C7.6 4 4 7.6 4 12s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3l4 4-4 4-4-4 4-4z" fill="white"/></svg>,
    lemonsqueezy: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#FFC233"/><path d="M12 5C9 5 7 7.5 7 10c0 4 5 9 5 9s5-5 5-9c0-2.5-2-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#0A0A0A"/></svg>,
    flyio: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#7B3FE4"/><path d="M12 4l6 4v8l-6 4-6-4V8l6-4zm0 3L8 9.5V14l4 2.5 4-2.5V9.5L12 7z" fill="white"/></svg>,
    nextauth: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#1A1A2E"/><path d="M12 4l7 4v8l-7 4-7-4V8l7-4z" stroke="white" strokeWidth="1.5" fill="none"/><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    planetscale: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#000"/><path d="M4 4l16 16M4 4h7M4 4v7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    remix: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#121212"/><path d="M13.5 8c0-1.1-.9-2-2-2H7v4h4.5c1.1 0 2-.9 2-2zM7 13v3h2v-2.5c1.8.3 3.5 1 3.5 2.5H15c0-2.5-2.2-4-5-4.3V13H7z" fill="white"/></svg>,
    astro: <svg width={size} height={size} viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#17191E"/><path d="M12 3l3.5 10H16l-4 6-4-6h.5L12 3z" fill="white"/><path d="M8.5 13C9.5 14 11 15 12 19c1-4 2.5-5 3.5-6H8.5z" fill="#FF5D01"/></svg>,
  }
  return <>{logos[id] ?? <div style={{ width: size, height: size, borderRadius: 3, background: 'var(--m-surface-3)' }} />}</>
}

function CategoryIcon({ category }: { category: string }) {
  const path = categoryPaths[category] ?? categoryPaths.other
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)' }}>
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

  const days = shipDate ? getDaysUntil(shipDate) : null

  return (
    <div className="rounded-2xl mb-6 overflow-hidden" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
      <button onClick={() => setExpanded(p => !p)} className="w-full flex items-center justify-between px-5 py-4 transition-opacity hover:opacity-80">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--m-text-muted)' }}>Project summary</span>
          <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--m-accent-subtle)', color: 'var(--m-accent)', border: '0.5px solid var(--m-accent-border)' }}>{answered.length} filled</span>
        </div>
        <svg className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} style={{ color: 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {expanded && (
        <div className="px-5 pb-5 flex flex-col gap-3 pt-4" style={{ borderTop: '0.5px solid var(--m-border)' }}>
          {problem && <div className="flex flex-col gap-0.5"><span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Problem</span><span className="text-sm leading-relaxed" style={{ color: 'var(--m-text-primary)' }}>{problem}</span></div>}
          {differentiator && <div className="flex flex-col gap-0.5 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}><span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Differentiator</span><span className="text-sm leading-relaxed" style={{ color: 'var(--m-text-primary)' }}>{differentiator}</span></div>}
          {mvp && <div className="flex flex-col gap-0.5 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}><span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>MVP</span><span className="text-sm leading-relaxed" style={{ color: 'var(--m-text-primary)' }}>{mvp}</span></div>}
          {selectedTools.length > 0 && (
            <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}>
              <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Stack</span>
              <div className="flex flex-wrap gap-2">
                {selectedTools.map(tool => tool && (
                  <div key={tool.id} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1" style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)' }}>
                    <ToolLogo id={tool.id} size={12} />
                    <span className="text-xs" style={{ color: 'var(--m-text-secondary)' }}>{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {shipDate && (
            <div className="flex flex-col gap-0.5 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}>
              <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Ship date</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: 'var(--m-accent)' }}>{shipDate}</span>
                {days !== null && (
                  <span className="text-xs px-1.5 py-0.5 rounded-md" style={{
                    background: days < 0 ? 'rgba(163,48,40,0.08)' : days <= 3 ? 'rgba(163,48,40,0.08)' : days <= 7 ? 'rgba(180,140,60,0.08)' : 'var(--m-accent-subtle)',
                    color: days < 0 ? 'var(--m-danger)' : days <= 3 ? 'var(--m-danger)' : days <= 7 ? '#A07830' : 'var(--m-accent)',
                    border: days < 0 ? '0.5px solid rgba(163,48,40,0.2)' : days <= 3 ? '0.5px solid rgba(163,48,40,0.2)' : days <= 7 ? '0.5px solid rgba(180,140,60,0.2)' : '0.5px solid var(--m-accent-border)',
                  }}>
                    {days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'today' : `${days}d left`}
                  </span>
                )}
              </div>
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
    <div className="rounded-2xl p-5 mb-6 flex items-center gap-4" style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)' }}>
        <svg className="w-5 h-5" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--m-accent)' }}>All steps completed — project shipped!</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--m-text-muted)' }}>Track your growth below.</p>
      </div>
    </div>
  )
  return (
    <div className="rounded-2xl p-5 mb-6 flex items-center gap-4 cursor-pointer group transition-opacity hover:opacity-80" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border-hover)' }} onClick={() => onGo(nextStep.phase)}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)' }}>
        <svg className="w-4 h-4" style={{ color: 'var(--m-accent)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs mb-0.5" style={{ color: 'var(--m-text-muted)' }}>Next step · {nextStep.phase}</p>
        <p className="text-sm font-medium truncate" style={{ color: 'var(--m-text-primary)' }}>{nextStep.title}</p>
      </div>
      <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
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
                <button key={tool.id} onClick={() => toggle(tool.id)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                  style={isSelected ? { background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)', color: 'var(--m-accent)' } : { background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}>
                  <ToolLogo id={tool.id} size={14} />
                  {tool.name}
                  {isSelected && <svg className="w-3 h-3" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

const integrations = [
  { id: 'search_console', name: 'Search Console', description: 'Track search performance', logo: <svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#4285F4"/><circle cx="11" cy="11" r="4.5" stroke="white" strokeWidth="1.5" fill="none"/><path d="M15 15l3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 11h4M11 9v4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { id: 'stripe', name: 'Stripe', description: 'Track revenue automatically', logo: <svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#635BFF"/><path d="M11.5 9.5c0-.8.7-1.1 1.8-1.1 1.6 0 3.2.5 4.7 1.3V6.2C16.5 5.4 14.9 5 13.3 5 9.9 5 7.6 6.7 7.6 9.7c0 4.6 6.3 3.9 6.3 5.9 0 .9-.8 1.2-2 1.2-1.7 0-3.6-.7-5.2-1.7v3.6c1.8.8 3.5 1.2 5.2 1.2 3.5 0 5.9-1.7 5.9-4.8 0-4.8-6.3-4-6.3-5.6z" fill="white"/></svg> },
  { id: 'plausible', name: 'Plausible', description: 'Privacy-friendly analytics', logo: <svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#5850EC"/><path d="M5 17l4-6 4 3 3-5 3 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg> },
  { id: 'reddit', name: 'Reddit', description: 'Track upvotes & mentions', logo: <svg width="16" height="16" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="#FF4500"/><path d="M16.67 10a1.46 1.46 0 00-2.47-1 7.12 7.12 0 00-3.85-1.23l.65-3.07 2.13.45a1 1 0 101.07-1 1 1 0 00-.96.68l-2.38-.5a.17.17 0 00-.2.13l-.73 3.44a7.14 7.14 0 00-3.89 1.23 1.46 1.46 0 10-1.61 2.39 2.87 2.87 0 000 .44c0 2.24 2.61 4.06 5.83 4.06s5.83-1.82 5.83-4.06a2.87 2.87 0 000-.44 1.46 1.46 0 00.49-1.52zM7.27 11a1 1 0 111 1 1 1 0 01-1-1zm5.58 2.71a3.58 3.58 0 01-2.85.86 3.58 3.58 0 01-2.85-.86.17.17 0 01.23-.23 3.26 3.26 0 002.62.71 3.26 3.26 0 002.62-.71.17.17 0 01.23.23zm-.14-1.71a1 1 0 111-1 1 1 0 01-1 1z" fill="white"/></svg> },
  { id: 'instagram', name: 'Instagram', description: 'Track followers', logo: <svg width="16" height="16" viewBox="0 0 24 24"><defs><linearGradient id="ig-p" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FED373"/><stop offset="30%" stopColor="#F15245"/><stop offset="60%" stopColor="#D92E7F"/><stop offset="100%" stopColor="#515ECF"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig-p)"/><circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/></svg> },
  { id: 'twitter', name: 'X / Twitter', description: 'Track followers', logo: <svg width="16" height="16" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#000"/><path d="M17.5 4h2.5l-5.5 6.3L21 20h-5l-3.7-4.8L8 20H5.5l5.8-6.6L4 4h5.1l3.4 4.4L17.5 4zm-.9 14.4h1.4L7.5 5.4H6z" fill="white"/></svg> },
]

function TrackingSection({ projectId }: { projectId: number }) {
  const [showIntegrations, setShowIntegrations] = useState(false)

  const metrics = [
    { label: 'Visitors', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, integration: 'Plausible' },
    { label: 'Signups', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>, integration: 'Plausible' },
    { label: 'Users', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>, integration: 'Supabase' },
    { label: 'Revenue', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, integration: 'Stripe' },
  ]

  const social = [
    { label: 'Reddit upvotes', integration: 'Reddit', logo: integrations.find(i => i.id === 'reddit')!.logo },
    { label: 'Instagram followers', integration: 'Instagram', logo: integrations.find(i => i.id === 'instagram')!.logo },
    { label: 'X / Twitter followers', integration: 'X / Twitter', logo: integrations.find(i => i.id === 'twitter')!.logo },
  ]

  return (
    <div className="mt-8">
      <div style={{ borderTop: '0.5px solid var(--m-border)' }} className="mb-8" />
      <div className="mb-6">
        <h2 className="font-semibold" style={{ color: 'var(--m-text-primary)' }}>Growth tracking</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--m-text-muted)' }}>Connect integrations to see your data here.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {metrics.map(m => (
          <div key={m.label} className="rounded-xl p-4" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
            <div className="flex items-center justify-between mb-3">
              <div style={{ color: 'var(--m-text-muted)' }}>{m.icon}</div>
              <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--m-surface-2)', color: 'var(--m-text-muted)', border: '0.5px solid var(--m-border)' }}>via {m.integration}</span>
            </div>
            <div className="text-xs mb-1" style={{ color: 'var(--m-text-muted)' }}>{m.label}</div>
            <div className="text-xl font-semibold" style={{ color: 'var(--m-border-hover)' }}>—</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 mb-6">
        {social.map(s => (
          <div key={s.label} className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
            <div className="flex-shrink-0">{s.logo}</div>
            <div className="flex-1"><div className="text-sm" style={{ color: 'var(--m-text-secondary)' }}>{s.label}</div></div>
            <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--m-surface-2)', color: 'var(--m-text-muted)', border: '0.5px solid var(--m-border)' }}>via {s.integration}</span>
            <div className="text-sm font-semibold" style={{ color: 'var(--m-border-hover)' }}>—</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: '0.5px solid var(--m-accent-border)', background: 'var(--m-accent-subtle)' }}>
        <button onClick={() => setShowIntegrations(p => !p)} className="w-full flex items-center justify-between px-4 py-3 transition-opacity hover:opacity-80">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'var(--m-accent)' }}>
              <svg className="w-3 h-3" style={{ color: 'white' }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--m-accent)' }}>Connect integrations</span>
          </div>
          <svg className={`w-4 h-4 transition-transform duration-200 ${showIntegrations ? 'rotate-180' : ''}`} style={{ color: 'var(--m-accent)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
        </button>
        {showIntegrations && (
          <div className="flex flex-col" style={{ borderTop: '0.5px solid var(--m-accent-border)' }}>
            {integrations.map((intg, i) => (
              <div key={intg.id} className="flex items-center gap-3 px-4 py-3 transition-opacity hover:opacity-80 cursor-pointer"
                style={{ borderBottom: i < integrations.length - 1 ? '0.5px solid var(--m-accent-border)' : 'none', background: 'var(--m-accent-subtle)' }}>
                <div className="flex-shrink-0">{intg.logo}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium" style={{ color: 'var(--m-text-primary)' }}>{intg.name}</div>
                  <div className="text-xs" style={{ color: 'var(--m-text-muted)' }}>{intg.description}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'var(--m-surface-2)', color: 'var(--m-text-muted)', border: '0.5px solid var(--m-border)' }}>Coming soon</span>
              </div>
            ))}
          </div>
        )}
      </div>
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
      const { data: projectData } = await supabase.from('projects').select('*').eq('slug', id).eq('user_id', session.user.id).single()
      if (!projectData) { setLoading(false); return }
      setProject(projectData)
      setSelectedStack(projectData.stack ?? [])
      const { data: stepsData } = await supabase.from('steps').select('*').eq('project_id', projectData.id).order('phase_order', { ascending: true }).order('step_order', { ascending: true })
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
    const updatedSteps = steps.map(s => s.id === stepId ? { ...s, completed: !completed } : s)
    setSteps(updatedSteps)
    const allDone = updatedSteps.every(s => s.completed)
    if (allDone && project?.status !== 'launched') {
      await supabase.from('projects').update({ status: 'launched' }).eq('id', project!.id)
      setProject(prev => prev ? { ...prev, status: 'launched' } : prev)
    }
  }

  async function saveAnswer(stepId: number) {
    setSaving(stepId)
    const answer = answers[stepId] ?? ''
    await supabase.from('steps').update({ answer, completed: answer.trim() !== '' }).eq('id', stepId)
    const updatedSteps = steps.map(s => s.id === stepId ? { ...s, answer, completed: answer.trim() !== '' } : s)
    setSteps(updatedSteps)
    const allDone = updatedSteps.every(s => s.completed)
    if (allDone && project?.status !== 'launched') {
      await supabase.from('projects').update({ status: 'launched' }).eq('id', project!.id)
      setProject(prev => prev ? { ...prev, status: 'launched' } : prev)
    }
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

  // Ship date countdown
  const shipDateAnswer = steps.find(s => s.title === 'Set a ship date')?.answer
  const shipDays = shipDateAnswer ? getDaysUntil(shipDateAnswer) : null

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
          <button onClick={() => window.location.href = '/dashboard'} className="flex items-center gap-1.5 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--m-text-secondary)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Back
          </button>
          <button onClick={() => window.location.href = `/projects/${project.slug}/edit`} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs hover:opacity-70 transition-opacity" style={{ border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
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
            { label: project.status, style: project.status === 'building' ? { background: 'rgba(100,70,160,0.08)', color: '#7A5AB8', border: '0.5px solid rgba(100,70,160,0.2)' } : project.status === 'launched' ? { background: 'var(--m-accent-subtle)', color: 'var(--m-accent)', border: '0.5px solid var(--m-accent-border)' } : { background: 'rgba(60,100,180,0.08)', color: '#4A72B8', border: '0.5px solid rgba(60,100,180,0.2)' } },
            { label: project.category, style: { background: 'var(--m-surface-2)', color: 'var(--m-text-secondary)', border: '0.5px solid var(--m-border)' } },
          ].map(b => (
            <span key={b.label} className="text-xs px-2 py-0.5 rounded-md capitalize" style={b.style}>{b.label}</span>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Overall progress</span>
            <span className="text-xs font-medium" style={{ color: progress === 100 ? 'var(--m-accent)' : 'var(--m-text-secondary)' }}>{completedCount}/{totalCount} · {progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--m-surface-3)' }}>
            <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: 'var(--m-accent)' }} />
          </div>
        </div>

        {/* Ship date countdown — alleen tonen als er een datum is en project nog niet launched */}
        {shipDays !== null && project.status !== 'launched' && (
          <ShipDateBanner days={shipDays} dateStr={shipDateAnswer!} />
        )}

        <NextStepBanner steps={steps} onGo={(phase) => isPhaseUnlocked(phase) && setActivePhase(phase)} />
        <SummaryCard steps={steps} stack={selectedStack} />

        <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
          {phases.map(phase => {
            const phaseStepsAll = steps.filter(s => s.phase === phase)
            const phaseCompleted = phaseStepsAll.every(s => s.completed) && phaseStepsAll.length > 0
            const unlocked = isPhaseUnlocked(phase)
            const isActive = activePhase === phase
            return (
              <button key={phase} onClick={() => unlocked && setActivePhase(phase)} disabled={!unlocked}
                className="px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all flex items-center gap-1.5"
                style={!unlocked ? { background: 'transparent', border: '0.5px solid var(--m-border)', color: 'var(--m-text-muted)', opacity: 0.4, cursor: 'not-allowed' } : isActive ? phaseCompleted ? { background: 'var(--m-accent)', color: 'white', border: '0.5px solid var(--m-accent)', fontWeight: 500 } : { background: 'var(--m-text-primary)', color: 'var(--m-bg)', border: '0.5px solid var(--m-text-primary)', fontWeight: 500 } : phaseCompleted ? { background: 'var(--m-accent-subtle)', border: '0.5px solid var(--m-accent-border)', color: 'var(--m-accent)' } : { background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}>
                {!unlocked ? <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg> : phaseCompleted ? <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg> : null}
                {phase}
              </button>
            )
          })}
        </div>

        {!activePhaseUnlocked ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
            <svg className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--m-border-hover)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--m-text-secondary)' }}>Phase locked</p>
            <p className="text-xs mb-4" style={{ color: 'var(--m-text-muted)' }}>Complete all steps in {phases[phases.indexOf(activePhase) - 1]} first.</p>
            <button onClick={() => setActivePhase(phases[phases.indexOf(activePhase) - 1])} className="text-xs hover:opacity-70 transition-opacity" style={{ color: 'var(--m-accent)' }}>
              ← Go to {phases[phases.indexOf(activePhase) - 1]}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {phaseSteps.map((step, index) => {
              const isStackStep = step.title === 'Lock your stack'
              return (
                <div key={step.id} className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{ background: 'var(--m-surface-1)', border: step.completed ? '0.5px solid var(--m-accent-border)' : '0.5px solid var(--m-border)' }}>
                  <div className="p-4 flex gap-3 cursor-pointer select-none" onClick={() => setExpandedStep(prev => prev === step.id ? null : step.id)}>
                    <button onClick={(e) => { e.stopPropagation(); if (!isStackStep) toggleStep(step.id, step.completed) }}
                      className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                      style={step.completed ? { background: 'var(--m-accent)', border: '2px solid var(--m-accent)' } : { border: '2px solid var(--m-border-hover)' }}>
                      {step.completed && <svg className="w-2.5 h-2.5" fill="currentColor" style={{ color: 'white' }} viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>{index + 1}</span>
                        <p className="text-sm font-medium" style={{ color: step.completed ? 'var(--m-text-muted)' : 'var(--m-text-primary)', textDecoration: step.completed ? 'line-through' : 'none' }}>{step.title}</p>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--m-text-muted)' }}>{step.description}</p>
                      {isStackStep && selectedStack.length > 0 && expandedStep !== step.id && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {allTools.filter(t => selectedStack.includes(t.id)).map(tool => (
                            <div key={tool.id} className="flex items-center gap-1 rounded-md px-2 py-0.5" style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)' }}>
                              <ToolLogo id={tool.id} size={11} />
                              <span className="text-xs" style={{ color: 'var(--m-text-secondary)' }}>{tool.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {!isStackStep && step.answer && expandedStep !== step.id && (
                        <div className="mt-2 flex items-start gap-1.5">
                          <svg className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: 'var(--m-accent)' }} fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                          <p className="text-xs leading-relaxed line-clamp-1" style={{ color: 'var(--m-accent)' }}>{step.answer}</p>
                        </div>
                      )}
                    </div>
                    <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-transform duration-200 ${expandedStep === step.id ? 'rotate-180' : ''}`} style={{ color: 'var(--m-text-muted)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                  </div>
                  {expandedStep === step.id && (
                    <div className="px-4 pb-4 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}>
                      {isStackStep ? (
                        <>
                          <StackSelector selected={selectedStack} onChange={saveStack} />
                          {selectedStack.length > 0 && (
                            <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '0.5px solid var(--m-border)' }}>
                              <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>{selectedStack.length} tool{selectedStack.length !== 1 ? 's' : ''} selected</p>
                              <button onClick={() => setExpandedStep(null)} className="rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80 flex items-center gap-1.5" style={{ background: 'var(--m-accent)', color: 'white' }}>
                                {savingStack && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />}
                                Lock stack →
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                        {step.title === 'Set a ship date' ? (
                        <input
                            type="date"
                            className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                            style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-primary)', caretColor: 'var(--m-accent)' }}
                            value={answers[step.id] ?? ''}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => setAnswers(prev => ({ ...prev, [step.id]: e.target.value }))}
                        />
                        ) : (
                        <textarea className="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors resize-none"
                            style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-primary)', caretColor: 'var(--m-accent)' }}
                            placeholder="Write your answer here..." rows={3}
                            value={answers[step.id] ?? ''} onChange={e => setAnswers(prev => ({ ...prev, [step.id]: e.target.value }))} />
                        )}
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>Saving will also mark this step as complete</p>
                            <button onClick={() => saveAnswer(step.id)} disabled={saving === step.id} className="rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-50 flex items-center gap-1.5" style={{ background: 'var(--m-accent)', color: 'white' }}>
                              {saving === step.id ? <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Saving</> : 'Save & complete →'}
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

        {project.status === 'launched' && (
          <TrackingSection projectId={project.id} />
        )}

      </div>
    </main>
  )
}