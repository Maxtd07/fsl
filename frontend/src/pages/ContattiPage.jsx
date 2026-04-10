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
            className="rounded-[1.6rem] border border-primary/15 bg-base p-6 shadow-[0_14px_30px_rgba(76,130,169,0.05)]"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {card.label}
            </p>
            <p className="text-sm leading-7 text-text/80">{card.text}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 rounded-[2rem] border border-primary/12 bg-base p-6 shadow-[0_18px_40px_rgba(76,130,169,0.06)] sm:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Scrivici"
            title="Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-primary/12 bg-primary/10 p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Lorem
              </p>
              <p className="text-sm leading-7 text-text/80">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt.
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-secondary/20 bg-secondary/10 p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-secondary">
                Ipsum
              </p>
              <p className="text-sm leading-7 text-text/80">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip.
              </p>
            </div>
          </div>
        </div>

        <PlaceholderImage alt="Contatti dettaglio" className="h-72 sm:h-80 lg:h-full lg:min-h-96" />
      </section>
    </main>
  )
}

export default ContattiPage
