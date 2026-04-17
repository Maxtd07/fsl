import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import picture from '../assets/sostieniimage.jpeg'

const donationCards = [
  'Scegli se sostenere ASD Soccer Dream Fermana con il 5 per mille oppure contattandoci per una donazione diretta.',
  'Il tuo contributo aiuta a sostenere attivita sportive inclusive, trasferte, materiali e nuovi spazi per i ragazzi.',
  'Se hai bisogno di ricevuta o dettagli operativi, puoi usare il modulo contatti o chiamarci direttamente.',
]

const impactCards = [
  'Ogni contributo sostiene un progetto sportivo che mette al centro partecipazione, benessere e relazioni autentiche per i ragazzi e le famiglie.',
  'Le donazioni possono aiutare anche la crescita del progetto Insieme Fermana, pensato per dare alla societa una sede e nuovi laboratori.',
]

function DonazioniPage() {
  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Donazioni"
        title="Sostieni ASD Soccer Dream Fermana."
        description="Ogni contributo aiuta la squadra a far crescere attivita sportive inclusive, nuove opportunita per i ragazzi e il progetto Insieme Fermana."
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
          description="Qui trovi le modalita pubbliche che possiamo indicare con certezza. Per coordinate di versamento aggiornate puoi anche contattarci direttamente."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="rounded-lg border border-primary/20 bg-base px-6 py-8 shadow-md transition hover:shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-text">Dona il 5 per mille</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Nella dichiarazione dei redditi puoi destinare il 5 per mille ad ASD Soccer Dream Fermana firmando nell apposito riquadro.</p>
              <p className="font-semibold text-primary">Codice Fiscale:</p>
              <p className="rounded-lg bg-primary/8 p-3 font-mono text-base tracking-wide text-text">02395020445</p>
              <p className="pt-2 text-xs text-text/60">Non ti costa nulla e sostiene concretamente il progetto sportivo e sociale della societa.</p>
            </div>
          </article>

          <article className="rounded-lg border border-secondary/20 bg-base px-6 py-8 shadow-md transition hover:shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-text">Donazione diretta</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Se desideri fare una donazione economica, contattaci prima di effettuare il versamento cosi possiamo fornirti le coordinate piu aggiornate.</p>
              <p className="font-semibold text-secondary">Telefono:</p>
              <p className="rounded-lg bg-secondary/8 p-3 font-mono text-base tracking-wide text-text">+39 340 983 8158</p>
              <p className="pt-2 text-xs text-text/60">Ti aiutiamo anche se hai bisogno di una ricevuta o di informazioni sul progetto.</p>
            </div>
          </article>

          <article className="rounded-lg border border-accent/20 bg-base px-6 py-8 shadow-md transition hover:shadow-lg">
            <h3 className="mb-4 text-lg font-bold text-text">Perche donare</h3>
            <div className="space-y-3 text-sm text-text/85">
              <p>Il sostegno aiuta ASD Soccer Dream Fermana a tenere vive attivita sportive, partecipazione agli eventi e sviluppo di nuovi spazi dedicati ai ragazzi.</p>
              <p className="font-semibold text-text">Sede:</p>
              <p className="rounded-lg bg-accent/8 p-3 text-text">Via Carpenette 5, 63844 Grottazzolina (FM)</p>
              <p className="font-semibold text-text">Pagina Facebook:</p>
              <p className="rounded-lg break-all bg-accent/8 p-3 font-mono text-base tracking-wide text-text">facebook.com/ASDSOCCERDREAM</p>
              <p className="pt-2 text-xs text-text/60">Scrivici per conoscere il modo piu adatto per contribuire.</p>
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
            description="Con il tuo supporto possiamo rafforzare il progetto sportivo, sostenere le famiglie e dare continuita alle iniziative di ASD Soccer Dream Fermana."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {impactCards.map((text) => (
              <div key={text} className="rounded-lg border border-primary/20 bg-background p-4 shadow-sm">
                <p className="text-sm leading-7 text-text/80">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <img src={picture} alt="Sostegno ai progetti di ASD Soccer Dream Fermana" className="border-2 border-primary/80 rounded-2xl" />
      </section>

      <section className="mx-auto w-full max-w-3xl rounded-lg border border-primary/20 bg-base p-6 shadow-lg md:p-8">
        <SectionHeading
          eyebrow="Hai bisogno di aiuto?"
          title="Siamo disponibili per informazioni sulle donazioni."
          description="Se desideri una ricevuta, vuoi segnalare una donazione o ti servono coordinate aggiornate, puoi contattarci direttamente."
        />

        <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-4 text-sm leading-7 text-text/80">
          <p>
            Per informazioni sulle donazioni puoi chiamare il numero{' '}
            <a href="tel:+393409838158" className="font-semibold text-primary underline">
              +39 340 983 8158
            </a>{' '}
            oppure usare la pagina{' '}
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
