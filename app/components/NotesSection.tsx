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
  const [editing, setEditing] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)
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

  async function handleEditSave(id: number) {
    if (!editContent.trim()) return
    setEditSaving(true)
    const { error } = await supabase
      .from('notes')
      .update({ content: editContent.trim() })
      .eq('id', id)
    if (!error) {
      setNotes(prev => prev.map(n => n.id === id ? { ...n, content: editContent.trim() } : n))
      setEditing(null)
    }
    setEditSaving(false)
  }

  async function handleDelete(id: number) {
    setDeleting(id)
    await supabase.from('notes').delete().eq('id', id)
    setNotes(prev => prev.filter(n => n.id !== id))
    setDeleting(null)
  }

  async function handleCopy(note: Note) {
    await navigator.clipboard.writeText(note.content)
    setCopied(note.id)
    setTimeout(() => setCopied(null), 1500)
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
        <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: '0.5px solid var(--m-border)' }}>
          <span className="text-xs" style={{ color: 'var(--m-text-muted)' }}>⌘ + Enter to save</span>
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
              className="rounded-xl overflow-hidden group"
              style={{ background: 'var(--m-surface-1)', border: editing === note.id ? '0.5px solid var(--m-accent-border)' : '0.5px solid var(--m-border)' }}
            >
              {editing === note.id ? (
                <div>
                  <textarea
                    className="w-full px-4 py-3 text-sm focus:outline-none resize-none"
                    style={{ background: 'transparent', color: 'var(--m-text-primary)', caretColor: 'var(--m-accent)' }}
                    rows={4}
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    autoFocus
                    onKeyDown={e => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleEditSave(note.id)
                      if (e.key === 'Escape') setEditing(null)
                    }}
                  />
                  <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: '0.5px solid var(--m-border)' }}>
                    <button
                      onClick={() => setEditing(null)}
                      className="text-xs hover:opacity-70 transition-opacity"
                      style={{ color: 'var(--m-text-muted)' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleEditSave(note.id)}
                      disabled={editSaving || !editContent.trim()}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-40 flex items-center gap-1.5"
                      style={{ background: 'var(--m-accent)', color: 'white' }}
                    >
                      {editSaving && <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />}
                      {editSaving ? 'Saving...' : 'Save →'}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => { setEditing(note.id); setEditContent(note.content) }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--m-text-primary)', whiteSpace: 'pre-wrap' }}>
                      {note.content}
                    </p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); handleCopy(note) }}
                        className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
                        style={{ color: copied === note.id ? 'var(--m-accent)' : 'var(--m-text-muted)' }}
                        title="Copy"
                      >
                        {copied === note.id ? (
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(note.id) }}
                        disabled={deleting === note.id}
                        className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--m-danger)' }}
                        title="Delete"
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
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>{formatDate(note.created_at)}</p>
                    <p className="text-xs" style={{ color: 'var(--m-text-muted)' }}>· click to edit</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}