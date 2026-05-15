'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { window.location.href = '/'; return }
      setEmail(session.user.email ?? '')
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
      <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse" />
    </main>
  )

  const initials = email.slice(0, 2).toUpperCase()

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-10">
      <div className="max-w-lg mx-auto">

        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
        </div>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg font-medium text-zinc-300">
            {initials}
          </div>
          <div>
            <h1 className="text-white font-semibold">Account</h1>
            <p className="text-zinc-500 text-sm">{email}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Profile</h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400 text-sm">Email</span>
                <span className="text-zinc-300 text-sm">{email}</span>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800 pt-3">
                <span className="text-zinc-400 text-sm">Avatar</span>
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300">
                  {initials}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Preferences</h2>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 text-sm">Theme</span>
              <span className="text-zinc-600 text-xs border border-zinc-800 rounded-md px-2 py-0.5">Dark — coming soon</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Danger zone</h2>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Sign out
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}