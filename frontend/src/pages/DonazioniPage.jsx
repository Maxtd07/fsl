import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import picture from '../assets/sostieniimage.jpeg'
import { CONTACT_EMAIL, ORGANIZATION_NAME, SIGNATURE_PROJECT_NAME, TEAM_NAME } from '../lib/site.js'

const donationCards = [
  `Scegli se sostenere ${ORGANIZATION_NAME} con il 5 per mille o con un bonifico bancario.`,
  'Usa i dati riportati in questa pagina e indica, se vuoi, una causale per la tua donazione.',
  'Se hai bisogno di supporto o di una ricevuta, puoi scriverci direttamente e ti aiuteremo volentieri.',
]

const impactCards = [
  'Ogni contributo sostiene allenamenti, tornei di calcio paralimpico, laboratori e momenti di comunita in cui ogni persona trova spazio, voce e valore.',
  `Le donazioni ci aiutano anche a far crescere ${SIGNATURE_PROJECT_NAME}, con laboratori dedicati e un appartamento pensato per sperimentare la vita indipendente.`,
]

function DonazioniPage() {
  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Donazioni"
        title={`Sostieni ${TEAM_NAME}.`}
        description={`Puoi aiutarci con il tuo 5 per mille oppure con un bonifico bancario. Ogni contributo sostiene sport inclusivo, crescita personale e il progetto ${SIGNATURE_PROJECT_NAME}.`}
        tone="secondary"
        actions={
          <>
            <ActionLink to="/contatti">Richiedi dettagli</ActionLink>
            <ActionLink to="/privacy" variant="secondary">
              Privacy e trattamento dati
            </ActionLink>
          </>
        }
      />

      <section className="space-y-5 px-6 md:px-8">
        <SectionHeading
          title="Scegli come sostenerci"
          description="Abbiamo scelto modalita semplici e dirette, adatte a chi vuole stare vicino alla squadra e ai suoi progetti."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-lg border border-primary/20 bg-base px-6 py-8 shadow-md transition hover:shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-text">Dona il 5 per mille</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Nella dichiarazione dei redditi puoi destinare il 5 per mille alla {ORGANIZATION_NAME} firmando nell'apposito riquadro.</p>
              <p className="font-semibold text-primary">Codice Fiscale:</p>
              <p className="rounded-lg bg-primary/8 p-3 font-mono text-base tracking-wide text-text">00000000000</p>
              <p className="pt-2 text-xs text-text/60">Non ti costa nulla e aiuta concretamente le attivita della squadra.</p>
            </div>
          </article>

          <article className="rounded-lg border border-secondary/20 bg-base px-6 py-8 shadow-md transition hover:shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-text">Conto corrente postale</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Puoi effettuare un versamento su conto corrente postale intestato alla {ORGANIZATION_NAME}.</p>
              <p className="font-semibold text-secondary">Numero conto:</p>
              <p className="rounded-lg bg-secondary/8 p-3 font-mono text-base tracking-wide text-text">
                123456
              </p>
              <p className="pt-2 text-xs text-text/60">
                Disponibile presso tutti gli uffici postali.
              </p>
            </div>
          </article>

          <article className="rounded-lg border border-accent/20 bg-base px-6 py-8 shadow-md transition hover:shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-text">Bonifico bancario</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Puoi effettuare un bonifico diretto intestato alla {ORGANIZATION_NAME}.</p>
              <p className="font-semibold text-text">Intestazione:</p>
              <p className="rounded-lg bg-accent/8 p-3 text-text">{ORGANIZATION_NAME}</p>
              <p className="font-semibold text-text">IBAN:</p>
              <p className="rounded-lg break-all bg-accent/8 p-3 font-mono text-base tracking-wide text-text">
                IT00 X000 0000 0000 0000 0000 0000
              </p>
              <p className="pt-2 text-xs text-text/60">Causale consigliata: "Donazione liberale"</p>
            </div>
          </article>
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading eyebrow="Come funziona" title="Un gesto semplice e trasparente." />

        <div className="grid gap-4 lg:grid-cols-3">
          {donationCards.map((text, index) => (
            <article
              key={text}
              className="rounded-[1.6rem] border-2 border-primary/20 bg-base p-4 shadow-[0_8px_18px_rgba(0,0,0,0.08)]"
            >
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-primary">Step {index + 1}</p>
              <p className="text-sm leading-7 text-text/80">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-lg border border-primary/20 bg-base p-6 shadow-lg md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Impatto"
            title="Ogni donazione diventa azione concreta."
            description="Con il tuo supporto aiutiamo 22 ragazzi e adulti a vivere sport, relazioni, autonomia e nuove esperienze, oggi e domani."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {impactCards.map((text) => (
              <div key={text} className="rounded-lg border border-primary/20 bg-background p-4 shadow-sm">
                <p className="text-sm leading-7 text-text/80">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <img src={picture} alt="Impatto donazioni" className="border-2 border-primary/80 rounded-2xl" />
      </section>

      <section className="mx-auto w-full max-w-3xl rounded-lg border border-primary/20 bg-base p-6 shadow-lg md:p-8">
        <SectionHeading
          eyebrow="Hai bisogno di aiuto?"
          title="Siamo disponibili per informazioni sulle donazioni."
          description="Se desideri una ricevuta, vuoi segnalare una donazione o hai bisogno di chiarimenti sulle modalita di sostegno, puoi contattarci direttamente."
        />

        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-4 text-sm leading-7 text-text/80">
          <p>
            Per informazioni sulle donazioni puoi scrivere a{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary underline">
              {CONTACT_EMAIL}
            </a>{' '}
            oppure visitare la pagina{' '}
            <a href="/contatti" className="font-semibold text-primary underline">
              contatti
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  )
}

export default DonazioniPage
