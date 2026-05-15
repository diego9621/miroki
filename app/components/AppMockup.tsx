'use client'

import { useState, useEffect } from 'react'

const captions = [
  'Five questions. One locked track. No more drift.',
  'Every step has a concrete task — no guessing.',
  'Free tools only. One click to select and lock.',
  'All projects in one calm dashboard.',
  'Track users, revenue and social growth in one place.',
]

function NextjsLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#000"/>
      <path d="M4.5 19.5V4.5h4.5l6 10V4.5H19.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function SvelteLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#FF3E00"/>
      <path d="M19.2 5.4c-1.8-2.6-5.4-3.3-8-1.7L6.4 7.1C5 8 4.1 9.4 3.9 11c-.2 1.3.1 2.6.9 3.6-.6.9-.8 2-.6 3 .4 2.2 2.3 3.8 4.5 3.8.5 0 1-.1 1.5-.2l4.8-3.4c1.4-.9 2.3-2.3 2.5-3.9.2-1.3-.1-2.6-.9-3.6.6-.9.8-2 .6-3z" fill="white" fillOpacity="0.9"/>
      <path d="M10.3 18.9c-1.1.3-2.3-.1-3-1-.5-.7-.7-1.5-.5-2.3.1-.3.2-.6.4-.9l.1-.2.6.5c.7.6 1.5 1 2.4 1.2l.6.1-.1.5c-.1.4 0 .8.2 1.1.3.4.7.6 1.2.6.2 0 .4 0 .6-.1l4.8-3.4c.6-.4 1-.9 1.2-1.5.2-.6.1-1.2-.2-1.7-.5-.7-1.3-1-2.2-.8l-.5.1-.3-.5c-.4-.7-1-1.2-1.7-1.5-.7-.3-1.5-.3-2.2 0L7.3 11.4c-.6.4-1 .9-1.2 1.5-.2.6-.1 1.2.2 1.7.1.2.3.4.5.5l.1.1-.1.2c-.2.3-.3.7-.3 1.1 0 .6.2 1.1.6 1.5.6.7 1.6 1 2.6.7l4.8-3.4" fill="#FF3E00"/>
    </svg>
  )
}

function SupabaseLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#1C1C1C"/>
      <path d="M11.9 4L5 14.5h6l-1 5.5 8-10.5H12l1-5.5z" fill="#3ECF8E"/>
    </svg>
  )
}

function FirebaseLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#1C1C1C"/>
      <path d="M5.5 17.5L8 7l3 4.5L13 4l5.5 13.5z" fill="#FFA000"/>
      <path d="M5.5 17.5l7-4.5 1 4.5z" fill="#F57C00"/>
      <path d="M13 4l1 9-7 4.5z" fill="#FFCA28"/>
    </svg>
  )
}

function VercelLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#000"/>
      <path d="M12 5L21 19H3L12 5z" fill="white"/>
    </svg>
  )
}

function NetlifyLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#00AD9F"/>
      <path d="M9 7h6M12 4v6M9 17h6M12 14v6M5 12h14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function GitHubLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#24292E"/>
      <path d="M12 3C7 3 3 7 3 12c0 4 2.6 7.4 6.2 8.6.5.1.6-.2.6-.4v-1.6c-2.6.6-3.1-1.2-3.1-1.2-.4-1.1-1-1.4-1-1.4-.8-.6.1-.6.1-.6.9.1 1.4 1 1.4 1 .8 1.4 2.1 1 2.7.8.1-.6.3-1 .5-1.2-2.1-.2-4.2-1-4.2-4.6 0-1 .4-1.9 1-2.5-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.5.6.6 1 1.5 1 2.5 0 3.6-2.2 4.4-4.3 4.6.3.3.6.8.6 1.7V20c0 .2.1.5.6.4C18.4 19.4 21 16 21 12c0-5-4-9-9-9z" fill="white"/>
    </svg>
  )
}

function GitLabLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#FC6D26"/>
      <path d="M12 19l-7-5 2.5-8 1.5 4h6l1.5-4L19 14z" fill="white" fillOpacity="0.9"/>
      <path d="M5 14l2.5-8 1.5 4h-4zM19 14l-2.5-8-1.5 4h4z" fill="white" fillOpacity="0.6"/>
    </svg>
  )
}

function StripeLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#635BFF"/>
      <path d="M11.5 9.5c0-.8.7-1.1 1.8-1.1 1.6 0 3.2.5 4.7 1.3V6.2C16.5 5.4 14.9 5 13.3 5 9.9 5 7.6 6.7 7.6 9.7c0 4.6 6.3 3.9 6.3 5.9 0 .9-.8 1.2-2 1.2-1.7 0-3.6-.7-5.2-1.7v3.6c1.8.8 3.5 1.2 5.2 1.2 3.5 0 5.9-1.7 5.9-4.8 0-4.8-6.3-4-6.3-5.6z" fill="white"/>
    </svg>
  )
}

function SearchConsoleLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="4" fill="#4285F4"/>
      <circle cx="11" cy="11" r="4.5" stroke="white" strokeWidth="1.5" fill="none"/>
      <path d="M15 15l3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 11h4M11 9v4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function RedditLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="10" fill="#FF4500"/>
      <path d="M16.67 10a1.46 1.46 0 00-2.47-1 7.12 7.12 0 00-3.85-1.23l.65-3.07 2.13.45a1 1 0 101.07-1 1 1 0 00-.96.68l-2.38-.5a.17.17 0 00-.2.13l-.73 3.44a7.14 7.14 0 00-3.89 1.23 1.46 1.46 0 10-1.61 2.39 2.87 2.87 0 000 .44c0 2.24 2.61 4.06 5.83 4.06s5.83-1.82 5.83-4.06a2.87 2.87 0 000-.44 1.46 1.46 0 00.49-1.52zM7.27 11a1 1 0 111 1 1 1 0 01-1-1zm5.58 2.71a3.58 3.58 0 01-2.85.86 3.58 3.58 0 01-2.85-.86.17.17 0 01.23-.23 3.26 3.26 0 002.62.71 3.26 3.26 0 002.62-.71.17.17 0 01.23.23zm-.14-1.71a1 1 0 111-1 1 1 0 01-1 1z" fill="white"/>
    </svg>
  )
}

function InstagramLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="ig3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FED373"/>
          <stop offset="30%" stopColor="#F15245"/>
          <stop offset="60%" stopColor="#D92E7F"/>
          <stop offset="100%" stopColor="#515ECF"/>
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig3)"/>
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.5" fill="none"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
    </svg>
  )
}

function XLogo({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#000"/>
      <path d="M17.5 4h2.5l-5.5 6.3L21 20h-5l-3.7-4.8L8 20H5.5l5.8-6.6L4 4h5.1l3.4 4.4L17.5 4zm-.9 14.4h1.4L7.5 5.4H6z" fill="white"/>
    </svg>
  )
}

const stackGroups = [
  { label: 'Frontend', tools: [
    { name: 'Next.js', Logo: NextjsLogo, on: true },
    { name: 'SvelteKit', Logo: SvelteLogo, on: false },
  ]},
  { label: 'Database', tools: [
    { name: 'Supabase', Logo: SupabaseLogo, on: true },
    { name: 'Firebase', Logo: FirebaseLogo, on: false },
  ]},
  { label: 'Hosting', tools: [
    { name: 'Vercel', Logo: VercelLogo, on: true },
    { name: 'Netlify', Logo: NetlifyLogo, on: false },
  ]},
  { label: 'Code', tools: [
    { name: 'GitHub', Logo: GitHubLogo, on: true },
    { name: 'GitLab', Logo: GitLabLogo, on: false },
  ]},
]

const setupSteps = [
  { Logo: GitHubLogo, label: 'Create GitHub account', done: true },
  { Logo: SupabaseLogo, label: 'New Supabase project', done: true },
  { Logo: SupabaseLogo, label: 'Copy API keys', done: false },
  { Logo: VercelLogo, label: 'Connect to Vercel', done: false },
]

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 280, height: 508, background: '#FFFFFF', borderRadius: 28, border: '1px solid #E8E0D8', overflow: 'hidden', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px 8px', borderBottom: '0.5px solid #F0EAE2', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1C1612' }}>
          <span style={{ color: '#5A8A4A' }}>✦</span> Miroki
        </div>
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#F0EAE2', border: '0.5px solid #E8E0D8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 500, color: '#7A6C62' }}>JO</div>
      </div>
      <div style={{ padding: 16, flex: 1, overflow: 'hidden' }}>{children}</div>
    </div>
  )
}

function ProgBar({ value, total }: { value: number, total: number }) {
  const pct = Math.round((value / total) * 100)
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: '#9C8E82' }}>{value}/{total} steps</span>
        <span style={{ fontSize: 10, color: '#5A8A4A', fontWeight: 500 }}>{pct}%</span>
      </div>
      <div style={{ height: 4, background: '#F0EAE2', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: 4, width: `${pct}%`, background: '#5A8A4A', borderRadius: 4 }} />
      </div>
    </div>
  )
}

function OnboardingScreen() {
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 500, color: '#1C1612', marginBottom: 3 }}>New project</div>
      <div style={{ fontSize: 11, color: '#9C8E82', marginBottom: 14 }}>Lock in your track. Then ship.</div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: '#9C8E82', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>What are you building?</div>
        <div style={{ background: '#F7F4EF', border: '0.5px solid #5A8A4A', borderRadius: 8, padding: '8px 10px', fontSize: 12, color: '#1C1612' }}>
          A waitlist app for my SaaS<span style={{ opacity: 0.4 }}>|</span>
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: '#9C8E82', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Category</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
          {['SaaS', 'Tool', 'App', 'Content'].map(c => (
            <div key={c} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '0.5px solid', background: c === 'SaaS' ? 'rgba(90,138,74,0.1)' : '#F7F4EF', color: c === 'SaaS' ? '#3D6B35' : '#9C8E82', borderColor: c === 'SaaS' ? 'rgba(90,138,74,0.25)' : '#E8E0D8' }}>{c}</div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: '#9C8E82', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Priority</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {[{ l: 'High', bg: 'rgba(163,48,40,0.08)', c: '#A33028', bc: 'rgba(163,48,40,0.2)' }, { l: 'Medium', bg: '#F7F4EF', c: '#9C8E82', bc: '#E8E0D8' }, { l: 'Low', bg: '#F7F4EF', c: '#9C8E82', bc: '#E8E0D8' }].map(p => (
            <div key={p.l} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: `0.5px solid ${p.bc}`, background: p.bg, color: p.c }}>{p.l}</div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: '#9C8E82', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 4 }}>Status</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {['Idea', 'Building', 'Launched'].map((s, i) => (
            <div key={s} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '0.5px solid', background: i === 0 ? 'rgba(90,138,74,0.1)' : '#F7F4EF', color: i === 0 ? '#3D6B35' : '#9C8E82', borderColor: i === 0 ? 'rgba(90,138,74,0.25)' : '#E8E0D8' }}>{s}</div>
          ))}
        </div>
      </div>
      <button style={{ width: '100%', background: '#5A8A4A', color: 'white', border: 'none', borderRadius: 10, padding: '9px', fontSize: 12, fontWeight: 500 }}>Lock in my track →</button>
    </div>
  )
}

function TrackScreen() {
  return (
    <div>
      <ProgBar value={3} total={24} />
      <div style={{ background: '#F7F4EF', border: '0.5px solid #E8E0D8', borderRadius: 10, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(90,138,74,0.1)', border: '0.5px solid rgba(90,138,74,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="13" height="13" fill="none" stroke="#5A8A4A" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
        </div>
        <div>
          <div style={{ fontSize: 9, color: '#9C8E82', marginBottom: 1 }}>Next · Clarify</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: '#1C1612' }}>Name three people with this problem</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3, marginBottom: 12, overflowX: 'auto' as const }}>
        {['Clarify', 'Plan', 'Stack', 'Build', 'Launch'].map((p, i) => (
          <div key={p} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 6, border: '0.5px solid', whiteSpace: 'nowrap' as const, background: i === 0 ? '#5A8A4A' : '#F7F4EF', color: i === 0 ? 'white' : i > 1 ? '#C4B8AE' : '#9C8E82', borderColor: i === 0 ? '#5A8A4A' : '#E8E0D8', opacity: i > 1 ? 0.5 : 1, fontWeight: i === 0 ? 500 : 400 }}>{p}</div>
        ))}
      </div>
      <div style={{ background: '#F7F4EF', border: '0.5px solid #E8E0D8', borderRadius: 10, padding: '10px 12px' }}>
        {[
          { done: true, title: 'Describe the problem', cta: null },
          { done: false, title: 'Name three people', cta: 'Write 3 profiles' },
          { done: false, title: 'Find three competitors', cta: null },
          { done: false, title: 'Define your differentiator', cta: null },
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, padding: '7px 0', borderBottom: i < 3 ? '0.5px solid #F0EAE2' : 'none' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, border: `1.5px solid ${step.done ? '#5A8A4A' : i === 1 ? '#5A8A4A' : '#D4C9BC'}`, background: step.done ? '#5A8A4A' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
              {step.done && <svg width="8" height="8" fill="white" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: step.done ? '#B4A89C' : '#1C1612', textDecoration: step.done ? 'line-through' : 'none', marginBottom: step.cta && i === 1 ? 4 : 0 }}>{step.title}</div>
              {step.cta && i === 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(90,138,74,0.08)', border: '0.5px solid rgba(90,138,74,0.2)', borderRadius: 7, padding: '4px 8px' }}>
                  <svg width="10" height="10" fill="none" stroke="#5A8A4A" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
                  <span style={{ fontSize: 10, color: '#3D6B35', fontWeight: 500 }}>{step.cta}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StackScreen() {
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 500, color: '#1C1612', marginBottom: 3 }}>Your stack</div>
      <div style={{ fontSize: 11, color: '#9C8E82', marginBottom: 12 }}>Free tools only. Select and lock.</div>
      {stackGroups.map(group => (
        <div key={group.label} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 9, fontWeight: 500, color: '#9C8E82', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 5 }}>{group.label}</div>
          <div style={{ display: 'flex', gap: 5 }}>
            {group.tools.map(t => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 9px', borderRadius: 9, border: `0.5px solid ${t.on ? 'rgba(90,138,74,0.3)' : '#E8E0D8'}`, background: t.on ? 'rgba(90,138,74,0.08)' : '#F7F4EF', cursor: 'pointer' }}>
                <t.Logo size={14} />
                <span style={{ fontSize: 11, fontWeight: 500, color: t.on ? '#3D6B35' : '#7A6C62' }}>{t.name}</span>
                {t.on && <svg width="10" height="10" fill="#5A8A4A" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ fontSize: 9, fontWeight: 500, color: '#9C8E82', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6, marginTop: 4 }}>Setup steps</div>
      {setupSteps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 9, border: `0.5px solid ${s.done ? 'rgba(90,138,74,0.3)' : '#E8E0D8'}`, background: s.done ? 'rgba(90,138,74,0.06)' : '#F7F4EF', marginBottom: 4 }}>
          <s.Logo size={14} />
          <span style={{ fontSize: 11, fontWeight: 500, color: s.done ? '#3D6B35' : '#1C1612', flex: 1, textDecoration: s.done ? 'line-through' : 'none' }}>{s.label}</span>
          {s.done
            ? <svg width="12" height="12" fill="#5A8A4A" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            : <svg width="12" height="12" fill="none" stroke="#C4B8AE" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
          }
        </div>
      ))}
      <button style={{ width: '100%', background: '#5A8A4A', color: 'white', border: 'none', borderRadius: 10, padding: '8px', fontSize: 11, fontWeight: 500, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
        <svg width="11" height="11" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
        Lock stack — 4 tools selected
      </button>
    </div>
  )
}

function DashboardScreen() {
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 500, color: '#1C1612', marginBottom: 12 }}>Your projects</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 14 }}>
        {[{ l: 'Projects', v: '3', c: '#1C1612' }, { l: 'Steps done', v: '18', c: '#5A8A4A' }, { l: 'Shipped', v: '1', c: '#1C1612' }].map(s => (
          <div key={s.l} style={{ background: '#F7F4EF', border: '0.5px solid #E8E0D8', borderRadius: 8, padding: 8, textAlign: 'center' as const }}>
            <div style={{ fontSize: 18, fontWeight: 500, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 9, color: '#9C8E82', marginTop: 1 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {[
        { name: 'PlantPal', done: 24, total: 24, status: 'Shipped', sBg: 'rgba(90,138,74,0.1)', sC: '#3D6B35', sBc: 'rgba(90,138,74,0.25)' },
        { name: 'Waitlist SaaS', done: 11, total: 24, status: 'Building', sBg: 'rgba(100,70,160,0.08)', sC: '#7A5AB8', sBc: 'rgba(100,70,160,0.2)' },
      ].map(p => (
        <div key={p.name} style={{ background: '#F7F4EF', border: '0.5px solid #E8E0D8', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: '#F0EAE2', border: '0.5px solid #D4C9BC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
              {p.name === 'PlantPal' ? '🌱' : '⚡'}
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: '#1C1612' }}>{p.name}</span>
            <span style={{ marginLeft: 'auto', fontSize: 9, padding: '2px 6px', borderRadius: 4, border: `0.5px solid ${p.sBc}`, background: p.sBg, color: p.sC }}>{p.status}</span>
          </div>
          <div style={{ height: 3, background: '#E8E0D8', borderRadius: 3 }}>
            <div style={{ height: 3, width: `${Math.round(p.done / p.total * 100)}%`, background: '#5A8A4A', borderRadius: 3 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, color: '#9C8E82' }}>
            <span>{p.done}/{p.total} steps</span>
            <span style={{ color: '#5A8A4A' }}>{Math.round(p.done / p.total * 100)}%</span>
          </div>
        </div>
      ))}
      <div style={{ textAlign: 'center' as const, marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#5A8A4A', background: 'rgba(90,138,74,0.1)', border: '0.5px solid rgba(90,138,74,0.25)', borderRadius: 8, padding: 8 }}>+ Start new project →</div>
      </div>
    </div>
  )
}

function TrackingScreen() {
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 500, color: '#1C1612', marginBottom: 3 }}>Track growth</div>
      <div style={{ fontSize: 11, color: '#9C8E82', marginBottom: 14 }}>PlantPal · Last 7 days</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
        {[{ l: 'Users', v: '342', t: '+18%' }, { l: 'Revenue', v: '$542', t: '+21%' }, { l: 'Visitors', v: '2.8k', t: '+12%' }, { l: 'Signups', v: '89', t: '+8%' }].map(s => (
          <div key={s.l} style={{ background: '#F7F4EF', border: '0.5px solid #E8E0D8', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ fontSize: 9, color: '#9C8E82', marginBottom: 3 }}>{s.l}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: '#1C1612', marginBottom: 3 }}>{s.v}</div>
            <div style={{ fontSize: 10, color: '#5A8A4A', fontWeight: 500 }}>↑ {s.t}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 9, fontWeight: 500, color: '#9C8E82', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 8 }}>Social</div>
      {[
        { platform: 'Reddit', followers: '312 upvotes', trend: '24', LogoComp: RedditLogo },
        { platform: 'Instagram', followers: '892 followers', trend: '45', LogoComp: InstagramLogo },
        { platform: 'X / Twitter', followers: '1.2k followers', trend: '89', LogoComp: XLogo },
      ].map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 9, border: '0.5px solid #E8E0D8', background: '#F7F4EF', marginBottom: 5 }}>
          <s.LogoComp size={16} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: '#1C1612' }}>{s.platform}</div>
            <div style={{ fontSize: 10, color: '#9C8E82' }}>{s.followers}</div>
          </div>
          <span style={{ fontSize: 10, color: '#5A8A4A', fontWeight: 500 }}>+{s.trend}</span>
        </div>
      ))}
      <div style={{ marginTop: 10, background: 'rgba(90,138,74,0.06)', border: '0.5px solid rgba(90,138,74,0.2)', borderRadius: 9, padding: '8px 10px' }}>
        <div style={{ fontSize: 10, color: '#3D6B35', fontWeight: 500, marginBottom: 6 }}>Connect integrations</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' as const }}>
          {[
            { name: 'Search Console', LogoComp: SearchConsoleLogo },
            { name: 'Stripe', LogoComp: StripeLogo },
          ].map(t => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, border: '0.5px solid rgba(90,138,74,0.25)', background: 'rgba(90,138,74,0.08)' }}>
              <t.LogoComp size={14} />
              <span style={{ fontSize: 10, color: '#3D6B35', fontWeight: 500 }}>{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AppMockup() {
  const [cur, setCur] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % 5), 5000)
    return () => clearInterval(t)
  }, [])

  const screens = [
    <OnboardingScreen key="onboarding" />,
    <TrackScreen key="track" />,
    <StackScreen key="stack" />,
    <DashboardScreen key="dashboard" />,
    <TrackingScreen key="tracking" />,
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, padding: '32px 16px', background: 'var(--m-bg)', minHeight: 640 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} onClick={() => setCur(i)} style={{ width: i === cur ? 20 : 6, height: 6, borderRadius: i === cur ? 3 : '50%', background: i === cur ? 'var(--m-accent)' : 'var(--m-border-hover)', transition: 'all 0.3s', cursor: 'pointer' }} />
        ))}
      </div>

      <div style={{ position: 'relative', width: 280, height: 508, flexShrink: 0 }}>
        {screens.map((screen, i) => (
          <div key={i} style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            opacity: i === cur ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: i === cur ? 'auto' : 'none',
          }}>
            <PhoneFrame>{screen}</PhoneFrame>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => setCur(c => (c + 4) % 5)} style={{ fontSize: 11, borderRadius: 8, border: '0.5px solid var(--m-border)', background: 'var(--m-surface-1)', color: 'var(--m-text-secondary)', cursor: 'pointer', padding: '6px 14px', fontFamily: 'inherit' }}>←</button>
        <div style={{ fontSize: 12, color: 'var(--m-text-secondary)', textAlign: 'center' as const, maxWidth: 240, lineHeight: 1.5 }}>{captions[cur]}</div>
        <button onClick={() => setCur(c => (c + 1) % 5)} style={{ fontSize: 11, borderRadius: 8, border: '0.5px solid var(--m-border)', background: 'var(--m-surface-1)', color: 'var(--m-text-secondary)', cursor: 'pointer', padding: '6px 14px', fontFamily: 'inherit' }}>→</button>
      </div>
    </div>
  )
}