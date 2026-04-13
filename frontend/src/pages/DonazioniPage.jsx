import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

const donationCards = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
]

const impactCards = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
]

function DonazioniPage() {
  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Donazioni"
        title="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod."
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae."
        tone="secondary"
        actions={
          <>
            <ActionLink to="/contatti">Richiedi dettagli</ActionLink>
            <ActionLink to="/chi-siamo" variant="secondary">
              Scopri il progetto
            </ActionLink>
          </>
        }
      />

      <section className="space-y-5">
        <SectionHeading
          eyebrow="Modalita"
          title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {donationCards.map((text, index) => (
            <article
              key={text}
              className="rounded-[1.6rem] border-2 border-primary/20 bg-base p-4 md:p-5 lg:p-6 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Opzione {index + 1}
              </p>
              <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Impatto"
            title="Sed ut perspiciatis unde omnis iste natus error sit voluptatem."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {impactCards.map((text) => (
              <div
                key={text}
                className="rounded-[1.4rem] border-2 border-primary/20 bg-background p-4 md:p-5 shadow-[0_6px_14px_rgba(0,0,0,0.06)]"
              >
                <p className="text-xs md:text-sm font-medium leading-6 md:leading-7 text-text/85 md:text-text/80">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <PlaceholderImage alt="Impatto donazioni" className="h-72 md:h-80 lg:h-full lg:min-h-96" />
      </section>
    </main>
  )
}

export default DonazioniPage
