import PlaceholderImage from './PlaceholderImage.jsx'

function MediaTile({ title, meta, description, alt, imageSrc }) {
  return (
    <article className="flex h-full flex-col rounded-[1.75rem] border-2 border-primary/20 bg-base p-4 shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
      {imageSrc ? (
        <img src={imageSrc} alt={alt} className="aspect-[4/3] w-full rounded-[1.2rem] object-cover" />
      ) : (
        <PlaceholderImage alt={alt} className="aspect-[4/3] w-full" />
      )}
      <div className="px-1 pb-1 pt-4">
        {meta ? (
          <p className="mb-3 inline-flex rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {meta}
          </p>
        ) : null}
        <h3 className="text-base md:text-lg font-bold tracking-[-0.02em] text-text">{title}</h3>
        {description ? (
          <p className="mt-2 text-xs md:text-sm font-medium leading-6 text-text/80">{description}</p>
        ) : null}
      </div>
    </article>
  )
}

export default MediaTile
