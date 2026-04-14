const heroTones = {
  primary: {
    surface: 'border-primary/20 bg-background',
    eyebrow: 'text-primary',
    accent: 'bg-primary/12',
    support: 'bg-primary/8',
  },
  secondary: {
    surface: 'border-primary/20 bg-background',
    eyebrow: 'text-secondary',
    accent: 'bg-secondary/12',
    support: 'bg-secondary/8',
  },
  accent: {
    surface: 'border-primary/20 bg-background',
    eyebrow: 'text-accent',
    accent: 'bg-accent/12',
    support: 'bg-accent/8',
  },
  neutral: {
    surface: 'border-primary/20 bg-background',
    eyebrow: 'text-text',
    accent: 'bg-primary/12',
    support: 'bg-primary/8',
  },
}

function PageHero({ eyebrow, title, description, actions, tone = 'primary' }) {
  const styles = heroTones[tone] ?? heroTones.primary

  return (
    <section
      className={`relative overflow-hidden rounded-4xl border-2 border-primary/20 px-6 py-12 shadow-[0_16px_40px_rgba(0,0,0,0.10)] md:px-8 md:py-16 grid md:grid-cols-2 lg:grid-cols-3 lg:gap-8 ${styles.surface}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`absolute -right-16 top-0 h-48 w-48 rounded-full blur-3xl ${styles.accent}`} />
        <div
          className={`absolute bottom-0 left-0 h-40 w-40 -translate-x-1/3 translate-y-1/3 rounded-full blur-2xl ${styles.support}`}
        />
      </div>

      {/* LEFT (eyebrow + title) */}
      <div className="relative">
        {eyebrow ? (
          <p
            className={`mb-4 inline-flex rounded-full bg-base/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] backdrop-blur-sm ${styles.eyebrow}`}
          >
            {eyebrow}
          </p>
        ) : null}

        <h1 className="max-w-3xl text-3xl md:text-4xl lg:text-5xl font-bold tracking-[-0.04em] text-text">
          {title}
        </h1>

        {/* DESCRIPTION (mobile only stays here) */}
        <p className="mt-5 md:mt-6 max-w-2xl text-sm font-medium leading-7 text-text/85 md:text-text/80 lg:hidden">
          {description}
        </p>
      </div>

      {/* RIGHT (description only on lg) */}
      <div className="relative hidden lg:block lg:pl-4">
        <p className="max-w-xl text-sm font-medium leading-7 text-text/85">
          {description}
        </p>
      </div>
    </section>
  )
}

export default PageHero