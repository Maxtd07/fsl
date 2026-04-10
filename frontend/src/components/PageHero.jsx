const heroTones = {
  primary: {
    surface: 'border-primary/15 bg-primary/12',
    eyebrow: 'text-primary',
    accent: 'bg-primary/18',
    support: 'bg-secondary/22',
  },
  secondary: {
    surface: 'border-secondary/20 bg-secondary/12',
    eyebrow: 'text-secondary',
    accent: 'bg-secondary/18',
    support: 'bg-primary/16',
  },
  accent: {
    surface: 'border-accent/40 bg-accent/24',
    eyebrow: 'text-primary',
    accent: 'bg-accent/40',
    support: 'bg-secondary/20',
  },
  neutral: {
    surface: 'border-primary/12 bg-background',
    eyebrow: 'text-primary',
    accent: 'bg-primary/12',
    support: 'bg-accent/30',
  },
}

function PageHero({ eyebrow, title, description, actions, tone = 'primary' }) {
  const styles = heroTones[tone] ?? heroTones.primary

  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border px-6 py-12 shadow-[0_24px_54px_rgba(76,130,169,0.08)] sm:px-8 sm:py-16 ${styles.surface}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`absolute -right-16 top-0 h-48 w-48 rounded-full blur-3xl ${styles.accent}`} />
        <div
          className={`absolute bottom-0 left-0 h-40 w-40 -translate-x-1/3 translate-y-1/3 rounded-full blur-2xl ${styles.support}`}
        />
        <div className="absolute inset-x-6 bottom-6 h-px bg-primary/10" />
      </div>

      <div className="relative max-w-4xl">
        {eyebrow ? (
          <p
            className={`mb-4 inline-flex rounded-full bg-base/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] backdrop-blur-sm ${styles.eyebrow}`}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-text sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-text/76 sm:text-base">
          {description}
        </p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  )
}

export default PageHero
