'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Note {
  id: number
  content: string
  created_at: string
}

export default function NotesSection({ projectId }: { projectId: number }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
      setNotes(data ?? [])
      setLoading(false)
    }
    load()
  }, [projectId])

  async function handleSave() {
    if (!draft.trim()) return
    setSaving(true)
    const { data, error } = await supabase
      .from('notes')
      .insert([{ project_id: projectId, content: draft.trim() }])
      .select()
      .single()
    if (!error && data) {
      setNotes(prev => [data, ...prev])
      setDraft('')
    }
    setSaving(false)
  }

  async function handleDelete(id: number) {
    setDeleting(id)
    await supabase.from('notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
    setDeleting(null)
  }

  function formatDate(str: string) {
    const d = new Date(str)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="mt-8">
      <div style={{ borderTop: '0.5px solid var(--m-border)' }} className="mb-8" />

      <div className="mb-5">
        <h2 className="font-semibold" style={{ color: 'var(--m-text-primary)' }}>Notes</h2>
        <p className="text-xs mt-0.5" style={{ color: 'var(--m-text-muted)' }}>Thoughts, blockers, ideas. Just for you.</p>
      </div>

      {/* Input */}
      <div className="rounded-xl overflow-hidden mb-4" style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}>
        <textarea
          className="w-full px-4 py-3 text-sm focus:outline-none resize-none transition-colors"
          style={{ background: 'transparent', color: 'var(--m-text-primary)', caretColor: 'var(--m-accent)' }}
          placeholder="Write a note..."
          rows={3}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
          }}
        />
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderTop: '0.5px solid var(--m-border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>
            ⌘ + Enter to save
          </span>
          <button
            onClick={handleSave}
            disabled={saving || !draft.trim()}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-40 flex items-center gap-1.5"
            style={{ background: 'var(--m-accent)', color: 'white' }}
          >
            {saving && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />}
            {saving ? 'Saving...' : 'Save note →'}
          </button>
        </div>
      </div>

      {/* Notes list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--m-border-hover)' }} />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: 'var(--m-text-muted)' }}>No notes yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notes.map(note => (
            <div
              key={note.id}
              className="rounded-xl p-4 group"
              style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--m-text-primary)', whiteSpace: 'pre-wrap' }}>
                  {note.content}
                </p>
                <button
                  onClick={() => handleDelete(note.id)}
                  disabled={deleting === note.id}
                  className="flex-shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-70"
                  style={{ color: 'var(--m-text-muted)' }}
                >
                  {deleting === note.id ? (
                    <div className="w-3.5 h-3.5 border border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--m-border-hover)' }} />
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--m-text-muted)' }}>{formatDate(note.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}