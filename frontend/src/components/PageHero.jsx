const heroTones = {
  primary: {
    surface: 'border-gray-300 bg-gray-100',
    eyebrow: 'text-text',
    accent: 'bg-gray-200',
    support: 'bg-gray-150',
  },
  secondary: {
    surface: 'border-gray-300 bg-gray-100',
    eyebrow: 'text-text',
    accent: 'bg-gray-200',
    support: 'bg-gray-150',
  },
  accent: {
    surface: 'border-gray-300 bg-gray-100',
    eyebrow: 'text-text',
    accent: 'bg-gray-200',
    support: 'bg-gray-150',
  },
  neutral: {
    surface: 'border-gray-300 bg-background',
    eyebrow: 'text-text',
    accent: 'bg-gray-200',
    support: 'bg-gray-150',
  },
}

function PageHero({ eyebrow, title, description, actions, tone = 'primary' }) {
  const styles = heroTones[tone] ?? heroTones.primary

  return (
    <section
      className={`relative overflow-hidden rounded-[2rem] border-2 border-gray-300 px-6 py-12 shadow-[0_16px_40px_rgba(0,0,0,0.10)] md:px-8 md:py-16 ${styles.surface}`}
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
        <h1 className="max-w-3xl text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-text">
          {title}
        </h1>
        <p className="mt-5 md:mt-6 max-w-2xl text-sm md:text-base leading-7 text-text/85 md:text-text/80">
          {description}
        </p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  )
}

export default PageHero
