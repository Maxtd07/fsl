function PlaceholderImage({ alt, className = '' }) {
  const accessibilityProps = alt
    ? { role: 'img', 'aria-label': `Segnaposto grafico: ${alt}` }
    : { 'aria-hidden': true }

  return (
    <div
      className={`relative isolate overflow-hidden rounded-3xl border-2 border-primary/20 bg-linear-to-br from-base via-background to-background shadow-[0_12px_28px_rgba(0,0,0,0.08)] ${className}`}
      {...accessibilityProps}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(141,193,51,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(253,196,155,0.28),transparent_38%)]"
      />
      <div
        aria-hidden="true"
        className="absolute left-6 top-6 h-16 w-16 rounded-full border border-base/60 bg-base/55 blur-[1px]"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-6 right-6 h-10 w-20 rounded-full border border-primary/10 bg-base/60"
      />

      <div className="relative flex h-full min-h-56 items-center justify-center p-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-primary/20 bg-base/90 shadow-[0_8px_18px_rgba(0,0,0,0.08)] backdrop-blur-sm">
          <svg
            className="h-11 w-11"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="8" y="12" width="32" height="24" rx="6" stroke="#4C82A9" strokeWidth="2.5" />
            <path
              d="M14 30L21 23L28 29L34 24L40 30"
              stroke="#8DC133"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="19" r="3.5" fill="#FDC49B" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default PlaceholderImage
