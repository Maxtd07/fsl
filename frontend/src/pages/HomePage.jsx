import ActionLink from '../components/ActionLink.jsx'
import MediaTile from '../components/MediaTile.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

const eventItems = [
  {
    title: 'Lorem ipsum dolor sit amet consectetur.',
    meta: '12 Aprile',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
  },
  {
    title: 'Sed ut perspiciatis unde omnis iste.',
    meta: '26 Aprile',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
  },
  {
    title: 'Quis autem vel eum iure reprehenderit.',
    meta: '10 Maggio',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
  },
]

const galleryItems = ['Galleria 1', 'Galleria 2', 'Galleria 3', 'Galleria 4']

function HomePage() {
  return (
    <main>
      <PageHero
        eyebrow="Benvenuti in La Crisalide"
        title="Valorizziamo le abilità, non le mancanze. "
        description="La Crisalide nasce con un obiettivo chiaro: accompagnare ogni persona in un percorso di crescita e trasformazione, sviluppando autonomia e consapevolezza.
Come la crisalide che si trasforma in farfalla, crediamo che ogni individuo abbia potenzialità da far emergere e coltivare."
        tone="primary"
      />

      {/* CHI SIAMO */}
      <section className="px-6 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.75fr)]">
          <div>
            <SectionHeading
              eyebrow="Chi siamo"
              title="una parola su di noi"
              description="La Crisalide è un’associazione attiva da oltre vent’anni
              nel supporto e nell’integrazione delle persone con disabilità e delle loro famiglie.
              Fin dall’inizio, l’obiettivo è stato quello di valorizzare le abilità individuali,
              costruendo percorsi personalizzati che tengano conto delle caratteristiche e dei bisogni di ciascuno."
            />

            <p className="mt-5 md:mt-6 max-w-3xl text-xs md:text-sm font-medium leading-7 text-slate-900">
              Crediamo che ogni persona abbia potenzialità da sviluppare attraverso opportunità concrete, senza fermarsi davanti alle difficoltà.

              Siamo stati tra i primi in Italia a credere nella musicoterapia come strumento educativo e relazionale. Nel tempo abbiamo sviluppato attività orientate all’autonomia, aiutando i ragazzi a vivere esperienze quotidiane come spostarsi, organizzarsi e relazionarsi in modo indipendente.

              Gli educatori costruiscono percorsi su misura, accompagnando ogni partecipante in un processo di crescita personale e sociale.
            </p>

            <div className="mt-6">
              <ActionLink to="/chi-siamo" variant="secondary" className="text-sm md:text-base">
                Scopri di piu
              </ActionLink>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[1.5rem] border-2 border-primary/20 bg-background px-4 md:px-5 py-4 md:py-5 shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                Identità e Missione
              </p>
              <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium leading-6 md:leading-7 text-slate-900">
                La Crisalide è un’associazione che da oltre vent’anni promuove l’inclusione e l’autonomia
                delle persone con disabilità.Crediamo nelle capacità di ogni individuo e lavoriamo per
                svilupparle attraverso esperienze concrete e percorsi personalizzati.
              </p>
            </div>

            <div className="rounded-[1.5rem] border-2 border-secondary/30 bg-secondary/8 px-4 md:px-5 py-4 md:py-5 shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">
                Metodo e Attività
              </p>
              <p className="mt-2 md:mt-3 text-xs md:text-sm font-medium leading-6 md:leading-7 text-slate-900">
                Costruiamo percorsi su misura che favoriscono la crescita personale e l’indipendenza.
                Attraverso laboratori, attività di gruppo e progetti di autonomia, accompagniamo ogni
                persona nel proprio sviluppo, valorizzando le sue potenzialità.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EVENTI */}
      <section className="border-t-2 border-primary/15 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:flex-nowrap">
          <SectionHeading
            eyebrow="Prossimi eventi"
            title="Scopri qui i nostri prossimi eventi"
            description="organizzati da La Crisalide e partecipa alle nostre iniziative per sostenere la nostra missione e condividere momenti di crescita e inclusione."
          />

          <ActionLink to="/eventi" variant="secondary" className="whitespace-nowrap flex-shrink-0">
            Vedi tutti
          </ActionLink>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {eventItems.map((item, index) => (
            <MediaTile key={item.title} alt={`Evento ${index + 1}`} {...item} />
          ))}
        </div>
      </section>

      {/* GALLERIA */}
      <section className="border-t-2 border-primary/15 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between lg:flex-nowrap">
          <SectionHeading
            eyebrow="Galleria"
            title="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod."
          />

          <ActionLink to="/galleria" variant="secondary" className="whitespace-nowrap flex-shrink-0">
            Vedi tutto
          </ActionLink>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {galleryItems.map((title) => (
            <div key={title} className="flex flex-col gap-3">
              <PlaceholderImage alt={title} className="aspect-[4/3] w-full" />
              <p className="text-sm font-semibold text-primary">{title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DONAZIONI CTA */}
      <section className="mt-6 rounded-[2rem] border-2 border-primary/20 bg-background px-4 md:px-6 lg:px-8 py-10 md:py-12 lg:py-14 text-center shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Sostieni
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em] text-slate-900">
          Sostieni La Crisalide
        </h2>
        <p className="mx-auto mt-4 md:mt-5 max-w-2xl text-xs md:text-sm font-medium leading-6 md:leading-7 text-slate-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className="mt-6 md:mt-7 flex flex-wrap justify-center gap-2 md:gap-3">
          <ActionLink to="/donazioni" variant="secondary">Dona ora</ActionLink>
          <ActionLink to="/contatti" variant="secondary">
            Richiedi informazioni
          </ActionLink>
        </div>
      </section>

      {/* CONTATTI CTA */}
      <section className="mt-6 rounded-[2rem] border-2 border-accent/20 bg-text px-4 md:px-6 lg:px-8 py-10 md:py-12 lg:py-14 text-center text-white shadow-[0_16px_40px_rgba(0,0,0,0.15)]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
          Resta in contatto
        </p>

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-[-0.03em]">
          Lorem ipsum dolor sit amet
        </h2>

        <p className="mx-auto mt-4 md:mt-5 max-w-2xl text-xs md:text-sm lg:text-base font-medium leading-6 md:leading-7 text-white/85 md:text-white/80">
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>

        <div className="mt-6 md:mt-7 flex justify-center">
          <ActionLink to="/contatti" variant="dark">
            Scrivici
          </ActionLink>
        </div>
      </section>
    </main>
  )
}

export default HomePage