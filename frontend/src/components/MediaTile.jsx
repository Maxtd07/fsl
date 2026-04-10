import PlaceholderImage from './PlaceholderImage.jsx'

function MediaTile({ title, meta, description, alt }) {
  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border border-primary/12 bg-base p-4 shadow-[0_16px_36px_rgba(76,130,169,0.06)]">
      <PlaceholderImage alt={alt} className="aspect-[4/3] w-full" />
      <div className="px-1 pb-1 pt-4">
        {meta ? (
          <p className="mb-3 inline-flex rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {meta}
          </p>
        ) : null}
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-text">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-text/72">{description}</p>
        ) : null}
      </div>
    </article>
  )
}

export default MediaTile
