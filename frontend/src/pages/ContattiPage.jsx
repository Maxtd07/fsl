import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

const contactCards = [
  {
    label: 'Email',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
  },
  {
    label: 'Telefono',
    text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
  },
  {
    label: 'Sede',
    text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
  },
]

function ContattiPage() {
  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Contatti"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit ut labore."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
        tone="neutral"
        actions={
          <>
            <ActionLink to="/eventi">Scopri eventi</ActionLink>
            <ActionLink to="/chi-siamo" variant="secondary">
              Leggi di piu
            </ActionLink>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {contactCards.map((card) => (
          <article
            key={card.label}
            className="rounded-[1.6rem] border-2 border-primary/20 bg-base p-4 md:p-5 lg:p-6 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              {card.label}
            </p>
            <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">{card.text}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Scrivici"
            title="Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.4rem] border-2 border-secondary/30 bg-secondary/8 p-4 md:p-5 shadow-[0_6px_14px_rgba(0,0,0,0.06)]">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                Lorem
              </p>
              <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt.
              </p>
            </div>
            <div className="rounded-[1.4rem] border-2 border-accent/30 bg-accent/8 p-4 md:p-5 shadow-[0_6px_14px_rgba(0,0,0,0.06)]">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
                Ipsum
              </p>
              <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip.
              </p>
            </div>
          </div>
        </div>

        <PlaceholderImage alt="Contatti dettaglio" className="h-72 md:h-80 lg:h-full lg:min-h-96" />
      </section>
    </main>
  )
}

export default ContattiPage
