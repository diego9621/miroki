export default function SoundFamiliar() {
  const items = [
    {
      icon: 'ti-map-off',
      title: 'No clear next step',
      body: 'You open the project. Stare at the screen. Close it again.',
    },
    {
      icon: 'ti-arrows-shuffle',
      title: 'Stack paralysis',
      body: 'You picked a framework. Then changed it. Twice. Still no product.',
    },
    {
      icon: 'ti-clock-pause',
      title: 'Stuck at 80%',
      body: 'The hard part is done. But shipping feels final. So you wait.',
    },
    {
      icon: 'ti-robot',
      title: 'AI said yes. Again.',
      body: 'Every tool builds what you ask. No one tells you it is the wrong time. Miroki locks your scope so you ship what matters first.',
    },
    {
      icon: 'ti-chart-line-off',
      title: 'Lost track of progress',
      body: 'You have no idea what is done, what is next, or how far you are.',
    },
    {
      icon: 'ti-battery-off',
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
              style={{ background: 'var(--m-surface-2)', border: '0.5px solid var(--m-border)' }}
            >
              <i className={`ti ${item.icon}`} style={{ fontSize: 15, color: 'var(--m-text-secondary)' }} aria-hidden="true" />
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