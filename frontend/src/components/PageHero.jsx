function PageHero({ eyebrow, title, description, actions, tone = 'bg-primary' }) {
  return (
    <section className={`${tone} border-b border-primary/15 px-6 py-12 text-white sm:px-8 sm:py-16`}>
      <div className="max-w-4xl">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/78 sm:text-base">
          {description}
        </p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  )
}

export default PageHero
