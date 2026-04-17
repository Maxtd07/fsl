import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

const privacySections = [
  {
    eyebrow: 'Titolare del trattamento',
    title: 'Chi gestisce i dati',
    text:
      'Il titolare del trattamento è ASD Soccer Dream Fermana. Per richieste relative alla privacy puoi usare il modulo contatti del sito oppure i recapiti pubblici indicati in questa pagina.',
  },
  {
    eyebrow: 'Dati raccolti',
    title: 'Quali informazioni trattiamo',
    text:
      'Raccogliamo i dati necessari a gestire il sito e i servizi di ASD Soccer Dream Fermana, come nome, email, credenziali di accesso, richieste inviate tramite i moduli online, adesioni agli eventi e comunicazioni legate al sostegno delle attività.',
  },
  {
    eyebrow: 'Finalità',
    title: 'Perché usiamo i dati',
    text:
      "Usiamo i dati per creare e gestire i profili utente, consentire l'accesso all'area personale, organizzare la partecipazione agli eventi, rispondere ai messaggi inviati dal sito e curare le comunicazioni di ASD Soccer Dream Fermana.",
  },
  {
    eyebrow: 'Base giuridica',
    title: 'Su quale base trattiamo i dati',
    text:
      "Il trattamento avviene per fornire i servizi richiesti, adempiere agli obblighi previsti dalla legge e, quando necessario, sulla base del consenso espresso dall'utente.",
  },
  {
    eyebrow: 'Conservazione',
    title: 'Per quanto tempo conserviamo i dati',
    text:
      "Conserviamo i dati per il tempo necessario a gestire il rapporto con l'utente, rispettare gli obblighi amministrativi e documentare le attività associative. Quando non sono più necessari, i dati vengono cancellati o resi anonimi.",
  },
  {
    eyebrow: 'Sicurezza',
    title: 'Come proteggiamo le informazioni',
    text:
      'Adottiamo misure tecniche e organizzative adeguate per proteggere le informazioni personali, limitare gli accessi non autorizzati e garantire un uso corretto dei dati raccolti.',
  },
  {
    eyebrow: "Diritti dell'utente",
    title: 'Accesso, rettifica, cancellazione e opposizione',
    text:
      "Puoi chiedere accesso ai tuoi dati, rettifica, cancellazione, limitazione del trattamento, portabilità o opposizione, nei limiti previsti dal GDPR. Puoi anche revocare eventuali consensi e proporre reclamo all'autorità garante competente.",
  },
  {
    eyebrow: 'Cookie',
    title: 'Uso di cookie e tecnologie simili',
    text:
      "Il sito utilizza cookie tecnici e strumenti equivalenti necessari al funzionamento della navigazione, dell'accesso all'area riservata e delle principali funzionalita del servizio.",
  },
]

function PrivacyPage() {
  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Privacy"
        title="Informativa privacy sul trattamento dei dati personali."
        description="Qui trovi una sintesi chiara di come ASD Soccer Dream Fermana raccoglie, utilizza, conserva e protegge i dati personali di utenti, partecipanti e sostenitori."
        tone="neutral"
      />

      <section className="rounded-lg border border-primary/20 bg-base p-6 shadow-lg md:p-8">
        <SectionHeading
          eyebrow="Sintesi"
          title="Trasparenza, attenzione e tutela dei dati."
          description="ASD Soccer Dream Fermana tratta solo i dati necessari alla gestione del sito, delle comunicazioni, delle attivita e delle eventuali donazioni."
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {privacySections.map((section) => (
            <article key={section.title} className="rounded-lg border border-primary/15 bg-background p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{section.eyebrow}</p>
              <h2 className="mt-3 text-xl font-bold text-text">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-text/80">{section.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-secondary/30 bg-secondary/8 p-6 shadow-md md:p-8">
        <SectionHeading
          eyebrow="Contatti privacy"
          title="Come esercitare i tuoi diritti"
          description="Per domande o richieste di accesso, aggiornamento o cancellazione dei dati puoi usare i recapiti pubblici di ASD Soccer Dream Fermana."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-primary/15 bg-base p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Contatti</p>
            <p className="mt-3 text-sm text-text/80">Usa il modulo nella pagina contatti</p>
          </div>
          <div className="rounded-lg border border-primary/15 bg-base p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Telefono</p>
            <p className="mt-3 text-sm text-text/80">+39 340 983 8158</p>
          </div>
          <div className="rounded-lg border border-primary/15 bg-base p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Sede</p>
            <p className="mt-3 text-sm text-text/80">Via Carpenette 5, 63844 Grottazzolina (FM)</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PrivacyPage
