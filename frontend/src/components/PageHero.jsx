/**
 * PageHero Component
 * - Tone variants: primary, secondary, accent, neutral
 * - Elegant gradients, subtle blur effects, two-column layout (md+)
 * - Icon/action support for CTA
 */

const heroTones = {
  primary: {
    surface: 'border border-primary/20 bg-gradient-to-br from-primary/15 to-primary/5',
    eyebrow: 'text-primary bg-primary/10',
    accentGrad: 'bg-primary/20',
    supportGrad: 'bg-primary/10',
  },
  secondary: {
    surface: 'border border-secondary/20 bg-gradient-to-br from-secondary/15 to-secondary/5',
    eyebrow: 'text-secondary bg-secondary/10',
    accentGrad: 'bg-secondary/20',
    supportGrad: 'bg-secondary/10',
  },
  accent: {
    surface: 'border border-accent/20 bg-gradient-to-br from-accent/15 to-accent/5',
    eyebrow: 'text-accent bg-accent/15',
    accentGrad: 'bg-accent/20',
    supportGrad: 'bg-accent/10',
  },
  neutral: {
    surface: 'border border-text/10 bg-gradient-to-br from-text/8 to-background',
    eyebrow: 'text-primary bg-primary/10',
    accentGrad: 'bg-primary/15',
    supportGrad: 'bg-primary/8',
  },
}

function PageHero({ eyebrow, title, description, actions, tone = 'primary' }) {
  const styles = heroTones[tone] ?? heroTones.primary

  return (
    <section
      className={`relative overflow-hidden rounded-lg p-8 md:p-12 lg:p-16 shadow-lg md:grid md:grid-cols-2 lg:gap-8 mt-4 md:mt-28 ${styles.surface}`}
    >
      {/* Decorative Blur Elements */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`absolute -right-20 top-0 h-64 w-64 rounded-full blur-3xl opacity-60 ${styles.accentGrad}`} />
        <div
          className={`absolute bottom-0 left-0 h-48 w-48 -translate-x-1/2 translate-y-1/2 rounded-full blur-2xl opacity-60 ${styles.supportGrad}`}
        />
      </div>

      {/* Left Column - Eyebrow + Title */}
      <div className="relative">
        {eyebrow && (
          <p
            className={`mb-4 inline-flex rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-sm ${styles.eyebrow}`}
          >
            {eyebrow}
          </p>
        )}

        <h1 className="max-w-3xl text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-text">
          {title}
        </h1>

        {/* Description on Mobile, and Actions */}
        <p className="mt-6 md:mt-8 max-w-2xl text-base font-medium leading-relaxed text-text/80 md:hidden">
          {description}
        </p>

        {/* Actions */}
        {actions && (
          <div className="mt-6 md:mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
            {actions}
          </div>
        )}
      </div>

      {/* Right Column - Description on Desktop Only */}
      {description && (
        <div className="relative hidden md:flex flex-col justify-center">
          <p className="max-w-xl text-base text-xl leading-relaxed text-text/80">
            {description}
          </p>
        </div>
      )}
    </section>
  )
}

export default PageHero