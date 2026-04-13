function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'

  return (
    <div className={alignment}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-[-0.03em] text-text">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 md:mt-5 text-sm md:text-base leading-7 text-text/85 md:text-text/80">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default SectionHeading
