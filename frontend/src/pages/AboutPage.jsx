import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import picture from '../assets/aboutusimage.jpg'
import { SIGNATURE_PROJECT_NAME, TEAM_NAME } from '../lib/site.js'

const focusAreas = [
  {
    label: 'Sport inclusivo',
    text: `${TEAM_NAME} pratica calcio paralimpico con un approccio chiaro: il risultato non e mai l'obiettivo, conta giocare, stare insieme e vivere lo sport come liberta.`,
    tone: 'primary',
  },
  {
    label: 'Dignita e valore',
    text: 'Ogni allenamento e ogni incontro sono pensati per dare spazio, voce e valore a ciascun ragazzo, rispettando la sua storia, i suoi tempi e il suo modo di stare al mondo.',
    tone: 'secondary',
  },
  {
    label: 'Una squadra che accoglie',
    text: 'I nostri 22 ragazzi e adulti, dai 12 ai 58 anni, formano una famiglia allargata che si sostiene, si abbraccia, ride, sbaglia e si rialza insieme.',
    tone: 'accent',
  },
]

const serviceCards = [
  {
    title: 'Crescita personale',
    text: 'Oltre al calcio proponiamo esperienze che aiutano a sviluppare autonomia, scoprire nuove passioni, mettersi alla prova e vivere occasioni che altrimenti sarebbero difficili da incontrare.',
    tone: 'secondary',
  },
  {
    title: SIGNATURE_PROJECT_NAME,
    text: 'Portiamo avanti un progetto di vita con un piano terra dedicato a laboratori e attivita e un appartamento pensato per sperimentare la vita indipendente.',
    tone: 'accent',
  },
]

const collaborationAreas = [
  {
    title: 'Tornei e calcio paralimpico',
    meta: 'Sport vissuto bene',
    description:
      'Scendiamo in campo per giocare, divertirci e costruire relazioni. Ogni partita diventa un'occasione per sentirsi parte di qualcosa e crescere insieme.',
  },
  {
    title: 'Reti che fanno comunita',
    meta: 'Collaborazioni',
    description:
      'Collaboriamo con associazioni, enti, realta sociali e sportive per costruire ponti, amicizie e occasioni concrete di apertura e accoglienza.',
  },
  {
    title: 'Autodeterminazione e futuro',
    meta: 'Progetto di vita',
    description:
      'Diffondiamo un modo piu umano di vivere la disabilita, in cui l'inclusione non e un favore ma un diritto e la diversita e una ricchezza.',
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
        title="Una squadra che mette le persone prima dello sport."
        description="La Soccer Dream Fermana e una realta sportiva inclusiva fatta di 22 ragazzi e adulti. Quando sono insieme diventano una squadra nel senso piu bello del termine."
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
            title="La Soccer Dream Fermana e una squadra, una casa e un progetto di vita."
            description="Non siamo una societa sportiva tradizionale: siamo un luogo dove si impara a vivere, a condividere, a rispettarsi e a crescere insieme."
          />
          <div className="mt-5 max-w-3xl space-y-3 text-xs font-medium leading-7 text-text/85 md:mt-6 md:space-y-4 md:text-sm md:text-text/80">
            <p>
              Ogni attivita nasce per mettere al centro la dignita e il valore di ciascuna persona. Alleniamo il corpo,
              ma anche il coraggio, le relazioni, la fiducia e la gioia di sentirsi accolti.
            </p>
            <p>
              Ovunque andiamo portiamo con noi un messaggio semplice e forte: l'inclusione e un diritto, la diversita
              e una ricchezza, la felicita nasce nelle cose semplici fatte insieme.
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
          <img src={picture} alt="Allenamento della squadra" className="border-2 border-primary rounded-2xl" />
          <div>
            <SectionHeading
              eyebrow="Servizi e progetti"
              title="Esperienze che fanno crescere sul campo e nella vita."
              description="Lo sport e un mezzo per imparare a vivere, condividere, crescere e sentirsi parte di qualcosa. Per questo lavoriamo anche su autonomia, relazioni e progetto di futuro."
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
            title="Ponti con il territorio per una societa piu umana."
            description="La Soccer Dream Fermana costruisce comunita insieme ad associazioni, enti e realta locali, trasformando ogni incontro in una possibilita concreta di partecipazione."
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
