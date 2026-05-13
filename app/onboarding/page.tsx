'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Onboarding() {
  const [name, setName] = useState('')
  const [coreFeature, setCoreFeature] = useState('')
  const [hours, setHours] = useState('')

  async function handleSubmit() {
    const { data: { user } } = await supabase.auth.getUser()
    console.log('user:', user)

    if (!user) {
      console.log('no user found')
      return
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        user_id: user.id,
        name,
        core_feature: coreFeature,
        hours_per_week: parseInt(hours)
      }])
      .select()

    console.log('data:', data)
    console.log('error:', error)

    if (error) { alert(error.message); return }
    window.location.href = '/dashboard'
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <h1 className="text-2xl font-semibold">New project</h1>
        <p className="text-gray-500 text-sm">Three questions. Then we build.</p>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">What are you building?</label>
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="An app that..."
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">What is the one core feature of your MVP?</label>
          <input
            className="border rounded-lg px-4 py-2"
            placeholder="Users can..."
            value={coreFeature}
            onChange={e => setCoreFeature(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">How many hours per week do you have?</label>
          <input
            className="border rounded-lg px-4 py-2"
            type="number"
            placeholder="5"
            value={hours}
            onChange={e => setHours(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="bg-black text-white rounded-lg px-4 py-2"
        >
          Start my track →
        </button>
      </div>
    </main>
  )
}