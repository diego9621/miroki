import Header from '../components/Header'
import Logo from '../components/Logo'
import Footer from '../components/Footer'


export const metadata = {
  title: 'How Miroki works',
  description: 'Learn how Miroki helps AI builders lock their MVP, stack and execution path so they can finish what they start.',
}

export default function HowItWorks() {
  const steps = [
    {
      title: 'Define what you are actually building',
      body: 'Start with the core problem, target user and MVP outcome. Miroki forces clarity before you touch more features.',
    },
    {
      title: 'Lock your MVP scope',
      body: 'Your first version stays intentionally small. Extra ideas can be saved for later instead of destroying the launch path.',
    },
    {
      title: 'Lock your stack',
      body: 'Pick the tools you will use and stop switching frameworks halfway through. The goal is progress, not another rebuild.',
    },
    {
      title: 'Move through execution phases',
      body: 'Clarify, plan, stack, build, launch and track. Each phase gives you the next required step instead of an endless task list.',
    },
    {
      title: 'Finish before optimizing',
      body: 'Miroki keeps analytics, growth and iteration after the MVP is complete. First finish something real, then improve it.',
    },
  ]

  return (
    <main className="min-h-screen" style={{ background: 'var(--m-bg)' }}>
      <Header />

      <section className="px-6 py-20 max-w-2xl mx-auto">
        <div className="mb-14">
          <p
            className="text-xs font-medium uppercase tracking-widest mb-4"
            style={{ color: 'var(--m-text-muted)' }}
          >
            How it works
          </p>

          <h1
            className="text-5xl font-semibold tracking-tight leading-tight mb-6"
            style={{ color: 'var(--m-text-primary)' }}
          >
            AI lets you build anything.
            <br />
            <span style={{ color: 'var(--m-accent)' }}>
              Miroki helps you finish something.
            </span>
          </h1>

          <p
            className="text-lg leading-relaxed max-w-xl"
            style={{ color: 'var(--m-text-secondary)' }}
          >
            Miroki turns your idea into a locked execution path so you stop rebuilding, stop switching direction and keep moving toward a finished MVP.
          </p>
        </div>

        <div
          className="rounded-2xl p-6 sm:p-8 mb-14"
          style={{
            background: 'var(--m-surface-1)',
            border: '0.5px solid var(--m-border)',
          }}
        >
          <p
            className="text-sm font-medium mb-3"
            style={{ color: 'var(--m-text-primary)' }}
          >
            The problem is not lack of ideas anymore.
          </p>

          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--m-text-muted)' }}
          >
            AI made it easy to generate code, redesign flows and restart projects. That freedom is useful, but it also creates endless optionality. Miroki adds structure back: one MVP, one stack, one path forward.
          </p>
        </div>

        <div className="flex flex-col">
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-6">
              <div className="flex flex-col items-center" style={{ width: 32, flexShrink: 0 }}>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                  style={{
                    background: index < 3 ? 'var(--m-accent)' : 'var(--m-surface-1)',
                    border: index < 3 ? 'none' : '0.5px solid var(--m-border)',
                    color: index < 3 ? 'white' : 'var(--m-text-muted)',
                  }}
                >
                  {index + 1}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className="w-0.5 flex-1 my-1"
                    style={{
                      background: index < 2 ? 'var(--m-accent)' : 'var(--m-border)',
                      minHeight: 48,
                    }}
                  />
                )}
              </div>

              <div className="pb-10 flex-1 min-w-0">
                <h2
                  className="text-lg font-semibold mb-2 leading-snug"
                  style={{ color: 'var(--m-text-primary)' }}
                >
                  {step.title}
                </h2>

                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--m-text-muted)' }}
                >
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-8 mt-8"
          style={{
            background: 'var(--m-surface-1)',
            border: '0.5px solid var(--m-accent-border)',
          }}
        >
          <h2
            className="text-2xl font-semibold tracking-tight mb-3"
            style={{ color: 'var(--m-text-primary)' }}
          >
            Constraints are the feature.
          </h2>

          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: 'var(--m-text-muted)' }}
          >
            Miroki is not trying to give you infinite flexibility. AI already does that. Miroki gives you enough structure to finish one thing before adding everything else.
          </p>

          <a
            href="/"
            className="inline-flex rounded-xl px-5 py-3 text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: 'var(--m-accent)',
              color: 'white',
            }}
          >
            Start finishing →
          </a>
        </div>
      </section>
      <Footer />
    </main>
  )
}