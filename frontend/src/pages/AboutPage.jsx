import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import PlaceholderImage from '../components/PlaceholderImage.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

const focusAreas = [
  {
    label: 'Ascolto e sostegno',
    text: "La Crisalide offre un servizio di ascolto delle problematiche, sostegno e consulenza per accompagnare persone con disabilita e famiglie.",
    tone: 'primary',
  },
  {
    label: 'Formazione',
    text: "Partecipa a incontri di formazione e convegni, e promuove occasioni di approfondimento su integrazione scolastica, sessualita e autismo con esperti locali e professionisti di rilievo nazionale.",
    tone: 'secondary',
  },
  {
    label: 'Rete territoriale',
    text: "Partecipa a tavoli di concertazione e consultazione promossi dagli Enti Locali, dall'Ambito XX e dalla ASUR Marche di Fermo per portare il punto di vista delle famiglie e delle persone con disabilita.",
    tone: 'accent',
  },
]

const serviceCards = [
  {
    title: 'Musicoterapia',
    text: 'Offriamo un servizio di musicoterapia con professionisti di alto livello e un setting altamente qualificato, pensato per favorire espressione, relazione e benessere.',
    tone: 'secondary',
  },
  {
    title: 'Tempo libero e autonomia',
    text: 'Realizziamo progetti che danno valore al tempo libero dei ragazzi disabili: nel fine settimana si incontrano con educatori, assistenti e volontari per vivere il tempo libero in modo naturale e sperimentare percorsi di autonomia con un gruppo di amici.',
    tone: 'accent',
  },
]

const collaborationAreas = [
  {
    title: 'Convegni e incontri formativi',
    meta: 'Approfondimento',
    description:
      'Promuoviamo convegni e incontri dedicati alla disabilita, approfondendo temi come integrazione scolastica, sessualita e autismo con il contributo di esperti locali e professionisti di calibro nazionale.',
  },
  {
    title: 'Interventi socio-sanitari centrati sulla persona',
    meta: 'Progetto di vita',
    description:
      "Collaboriamo con le istituzioni competenti per migliorare interventi socio-sanitari che mettano al centro la persona disabile e il suo progetto di vita, dall'integrazione scolastica ai centri diurni e residenziali, fino all'abbattimento delle barriere architettoniche.",
  },
  {
    title: 'Collaborazioni con il territorio',
    meta: 'Rete associativa',
    description:
      'Lavoriamo insieme ad associazioni del territorio come UNITALSI, Croce Verde, Liberi nel Vento e Anthropos per realizzare attivita teatrali, musical, nuoto e uscite in barca a vela con ragazzi disabili, volontari e familiari.',
  },
]

const areaStyles = {
  primary: 'border-primary/12 bg-base',
  secondary: 'border-secondary/20 bg-secondary/10',
  accent: 'border-accent/30 bg-accent/18',
}

function AboutPage() {
  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Chi siamo"
        title="La Crisalide e un punto di riferimento per ascolto, inclusione e progetto di vita."
        description="L'associazione sostiene persone con disabilità e famiglie attraverso ascolto, consulenza, formazione, servizi qualificati e una rete di collaborazioni che mette al centro la persona."
        tone="primary"
        actions={
          <>
            <ActionLink to="/contatti">Contattaci</ActionLink>
            <ActionLink to="/donazioni" variant="secondary">
              Sostieni il progetto
            </ActionLink>
          </>
        }
      />

      <section className="grid gap-10 px-6 py-10 md:px-8 md:py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div>
          <SectionHeading
            eyebrow="La Crisalide"
            title="Ascolto, partecipazione e tutela dei diritti nella vita di tutti i giorni."
            description="La nostra attivita unisce sostegno diretto, formazione e collaborazione con il territorio per costruire risposte piu umane, competenti e continuative."
          />
          <div className="mt-5 md:mt-6 max-w-3xl space-y-3 md:space-y-4 text-xs md:text-sm leading-7 text-text/85 md:text-text/80">
            <p>
              La Crisalide offre un servizio di ascolto delle problematiche,
              sostegno e consulenza, accompagnando famiglie e persone con
              disabilita nei bisogni quotidiani e nei momenti in cui serve un
              orientamento piu chiaro.
            </p>
            <p>
              Allo stesso tempo partecipa a incontri di formazione, convegni e
              tavoli di consultazione promossi dagli Enti Locali, dall'Ambito XX
              e dalla ASUR Marche di Fermo, contribuendo al confronto sui temi che
              riguardano la qualita della vita e i diritti delle persone
              disabili.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {focusAreas.map((item) => (
            <article
              key={item.label}
              className={`rounded-[1.5rem] border p-5 shadow-[0_14px_30px_rgba(76,130,169,0.05)] ${areaStyles[item.tone]}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {item.label}
              </p>
              <p className="mt-3 text-sm leading-7 text-text/80">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/12 bg-background px-6 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <PlaceholderImage alt="Attivita e servizi dell'associazione" className="aspect-[4/3] w-full" />
          <div>
            <SectionHeading
              eyebrow="Servizi e progetti"
              title="Percorsi qualificati che danno valore al benessere, al tempo libero e all'autonomia."
              description="Accanto al sostegno e alla rappresentanza, promuoviamo esperienze concrete che aiutano ogni persona a vivere relazioni, crescita e partecipazione con maggiore serenita."
            />
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {serviceCards.map((item) => (
                <article
                  key={item.title}
                  className={`rounded-[1.4rem] border p-5 shadow-[0_12px_26px_rgba(76,130,169,0.05)] ${areaStyles[item.tone]}`}
                >
                  <p className="mb-2 md:mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    {item.title}
                  </p>
                  <p className="mt-2 md:mt-3 text-xs md:text-sm leading-6 md:leading-7 text-text/85 md:text-text/80">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-primary/12 px-6 py-10 md:px-8 md:py-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Rete territoriale"
            title="Collaborazioni, advocacy e attivita condivise per una comunita piu inclusiva."
            description="L'associazione lavora con istituzioni, professionisti e realta del territorio per trasformare i bisogni in iniziative concrete e occasioni di partecipazione."
          />
          <ActionLink to="/contatti" variant="secondary">
            Parla con noi
          </ActionLink>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {collaborationAreas.map((item) => (
            <article
              key={item.title}
              className="rounded-[1.75rem] border border-primary/12 bg-base p-6 shadow-[0_16px_36px_rgba(76,130,169,0.06)]"
            >
              <p className="mb-2 md:mb-3 inline-flex rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {item.meta}
              </p>
              <h3 className="text-base md:text-lg font-semibold tracking-[-0.02em] text-text">
                {item.title}
              </h3>
              <p className="mt-2 md:mt-3 text-xs md:text-sm leading-6 md:leading-7 text-text/85 md:text-text/80">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default AboutPage
