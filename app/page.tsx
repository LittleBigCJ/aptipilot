export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section className="grid gap-10 md:grid-cols-2 items-center">
        <div>
          <span className="badge mb-3">ATPL Practice</span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Pilot aptitude & theory,
            <br />
            <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              made beautifully simple
            </span>
          </h1>
          <p className="mt-4 text-ink-600 text-lg">
            Build custom tests from curated CSV banks. Immediate feedback, clear explanations, and progress tracking.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <a href="/quiz" className="btn-primary">Go to Quiz</a>
            <a href="/sign-up" className="btn-ghost">Create account</a>
          </div>

          <div className="mt-6 text-xs text-ink-500">
            No credit card needed • Works on mobile • Import your own banks
          </div>
        </div>

        <div className="card p-4">
          <div className="rounded-2xl bg-gradient-to-br from-primary-100 via-white to-accent-100 p-6 shadow-soft">
            <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-glass">
              <div className="mb-3 h-3 w-24 rounded-full bg-ink-200" />
              <div className="mb-6 h-6 w-48 rounded-full bg-ink-200" />
              <div className="space-y-2">
                <div className="h-10 rounded-xl bg-white shadow-soft border border-ink-100" />
                <div className="h-10 rounded-xl bg-white shadow-soft border border-ink-100" />
                <div className="h-10 rounded-xl bg-white shadow-soft border border-ink-100" />
              </div>
              <div className="mt-6 h-10 w-32 rounded-xl bg-primary-600 shadow-lift" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
