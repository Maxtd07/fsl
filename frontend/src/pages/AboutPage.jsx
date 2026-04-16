import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import picture from '../assets/Copilot_20260416_170749.png'

const focusAreas = [
  {
    label: 'Ascolto e sostegno',
    text: "Offriamo ascolto, orientamento e sostegno alle persone con disabilita e alle loro famiglie nei bisogni quotidiani e nei momenti di maggiore fragilita.",
    tone: 'primary',
  },
  {
    label: 'Formazione',
    text: 'Promuoviamo incontri, laboratori e occasioni di approfondimento per crescere insieme come comunita piu consapevole, inclusiva e preparata.',
    tone: 'secondary',
  },
  {
    label: 'Rete territoriale',
    text: 'Collaboriamo con scuole, servizi, enti e realta del territorio per dare continuita ai progetti e valorizzare il punto di vista delle famiglie.',
    tone: 'accent',
  },
]

const serviceCards = [
  {
    title: 'Laboratori e attivita',
    text: 'Proponiamo attivita espressive, educative e ricreative che favoriscono benessere, partecipazione, relazione e valorizzazione delle capacita personali.',
    tone: 'secondary',
  },
  {
    title: 'Tempo libero e autonomia',
    text: 'Accompagniamo le persone in esperienze di gruppo e percorsi di autonomia che aiutano a vivere il tempo libero con serenita, relazioni positive e maggiore indipendenza.',
    tone: 'accent',
  },
]

const collaborationAreas = [
  {
    title: 'Incontri e momenti di confronto',
    meta: 'Approfondimento',
    description:
      'Organizziamo momenti di dialogo e approfondimento su temi legati alla disabilita, ai diritti, al benessere e alla partecipazione alla vita sociale.',
  },
  {
    title: 'Progetti costruiti intorno alla persona',
    meta: 'Progetto di vita',
    description:
      'Promuoviamo percorsi che mettano al centro desideri, bisogni e qualita della vita, favorendo soluzioni piu accessibili e personalizzate.',
  },
  {
    title: 'Collaborazioni con la comunita',
    meta: 'Rete associativa',
    description:
      'Lavoriamo insieme ad associazioni, volontari, professionisti e realta locali per creare opportunita condivise e inclusive.',
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
        title="Un punto di riferimento per ascolto, inclusione e progetto di vita."
        description="L'associazione sostiene persone con disabilita e famiglie attraverso ascolto, orientamento, attivita dedicate e una rete di collaborazioni che mette al centro la persona."
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
            eyebrow="Chi siamo"
            title="Ascolto, partecipazione e tutela dei diritti nella vita di tutti i giorni."
            description="La nostra attivita unisce sostegno diretto, formazione e collaborazione con il territorio per costruire risposte piu umane, accessibili e continuative."
          />
          <div className="mt-5 max-w-3xl space-y-3 text-xs font-medium leading-7 text-text/85 md:mt-6 md:space-y-4 md:text-sm md:text-text/80">
            <p>
              Offriamo ascolto, sostegno e orientamento, accompagnando persone con disabilita e famiglie nei bisogni
              quotidiani e nei momenti in cui serve un confronto chiaro e affidabile.
            </p>
            <p>
              Allo stesso tempo promuoviamo occasioni di confronto, attivita e collaborazioni che aiutano a costruire
              una comunita piu accogliente, consapevole e vicina ai diritti delle persone.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {focusAreas.map((item) => (
            <article
              key={item.label}
              className={`rounded-[1.5rem] border p-5 shadow-[0_14px_30px_rgba(76,130,169,0.05)] ${areaStyles[item.tone]}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{item.label}</p>
              <p className="mt-3 text-sm font-medium leading-7 text-text/80 md:text-text/85">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-primary/12 bg-background px-6 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.08fr)] lg:items-center">
          <img src={picture} alt="img laboratorio di sport" className="border-2 border-primary rounded-2xl" />
          <div>
            <SectionHeading
              eyebrow="Servizi e progetti"
              title="Percorsi che danno valore al benessere, al tempo libero e all'autonomia."
              description="Accanto al sostegno e alla rappresentanza, promuoviamo esperienze concrete che aiutano ogni persona a vivere relazioni, crescita e partecipazione con maggiore serenita."
            />
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {serviceCards.map((item) => (
                <article
                  key={item.title}
                  className={`rounded-[1.4rem] border p-5 shadow-[0_12px_26px_rgba(76,130,169,0.05)] ${areaStyles[item.tone]}`}
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary md:mb-3">
                    {item.title}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-text/85 md:mt-3 md:text-sm md:leading-7 md:text-text/80">
                    {item.text}
                  </p>
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
            title="Collaborazioni e attivita condivise per una comunita piu inclusiva."
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
              <p className="mb-2 inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-accent md:mb-3">
                {item.meta}
              </p>
              <h3 className="text-base font-bold tracking-[-0.02em] text-text md:text-lg">{item.title}</h3>
              <p className="mt-2 text-xs font-medium leading-6 text-text/85 md:mt-3 md:text-sm md:leading-7 md:text-text/80">
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
