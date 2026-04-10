import PlaceholderImage from './PlaceholderImage.jsx'

function MediaTile({ title, meta, description, alt }) {
  return (
    <article className="flex flex-col gap-3">
      <PlaceholderImage alt={alt} className="aspect-[4/3] w-full" />
      <div className="border-b border-primary/12 pb-4">
        {meta ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
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
