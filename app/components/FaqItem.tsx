'use client'

import { useState } from 'react'

type FaqItemProps = {
  q: string
  a: string
}

export default function FaqItem({ q, a }: FaqItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: '0.5px solid var(--m-border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between gap-6 text-left transition-opacity hover:opacity-80"
      >
        <span className="text-sm font-medium" style={{ color: 'var(--m-text-primary)' }}>
          {q}
        </span>

        <span className="text-lg leading-none" style={{ color: 'var(--m-text-muted)' }}>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <p className="text-sm leading-relaxed pb-5 pr-8" style={{ color: 'var(--m-text-muted)' }}>
          {a}
        </p>
      )}
    </div>
  )
}