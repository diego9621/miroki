export default function SoundFamiliar() {
  const items = [
    {
      icon: (
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
      ),
      title: 'No clear next step',
      body: 'You open the project. Stare at the screen. Close it again.',
    },
    {
      icon: (
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
      title: 'Stack paralysis',
      body: 'You picked a framework. Then changed it. Twice. Still no product.',
    },
    {
      icon: (
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Stuck at 80%',
      body: 'The hard part is done. But shipping feels final. So you wait.',
    },
    {
      icon: (
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      ),
      title: 'AI said yes. Again.',
      body: 'Every tool builds what you ask. No one tells you it is the wrong time. Miroki locks your scope so you ship what matters first.',
    },
    {
      icon: (
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      title: 'Lost track of progress',
      body: 'You have no idea what is done, what is next, or how far you are.',
    },
    {
      icon: (
        <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      title: 'Motivation fades',
      body: 'Without visible progress, the excitement dies. The project collects dust.',
    },
  ]

  return (
    <section className="px-6 py-20 max-w-2xl mx-auto">
      <p className="text-xs font-medium uppercase tracking-widest mb-10" style={{ color: 'var(--m-text-muted)' }}>
        Sound familiar
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {items.map((item, i) => (
          <div
            key={i}
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{ background: 'var(--m-surface-1)', border: '0.5px solid var(--m-border)' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)', color: 'var(--m-text-secondary)' }}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--m-text-primary)' }}>{item.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--m-text-muted)' }}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-base leading-relaxed" style={{ color: 'var(--m-text-secondary)' }}>
        Your idea deserves to be live. <strong style={{ color: 'var(--m-text-primary)', fontWeight: 500 }}>Miroki</strong> gives it a clear path to follow. Step by step. Phase by phase.
      </p>
    </section>
  )
}