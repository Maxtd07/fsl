import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'

const privacySections = [
  {
    eyebrow: 'Titolare del trattamento',
    title: 'Chi gestisce i dati',
    text:
      "Il titolare del trattamento e l'Associazione Disabili. Per richieste privacy puoi scrivere all'indirizzo email o contattare l'associazione al numero pubblicato nella pagina contatti.",
  },
  {
    eyebrow: 'Dati raccolti',
    title: 'Quali informazioni trattiamo',
    text:
      "Raccogliamo nome, email, credenziali di accesso cifrate, dati relativi alle iscrizioni agli eventi e dati di pagamento strettamente necessari alla gestione delle donazioni, inclusi identificativi PayPal e stato del pagamento. Non memorizziamo numeri completi di carte di pagamento.",
  },
  {
    eyebrow: 'Finalita',
    title: 'Perche usiamo i dati',
    text:
      "Usiamo i dati per creare e gestire account, consentire l'accesso all'area utente, registrare le iscrizioni agli eventi, inviare conferme e promemoria email, produrre allegati calendario .ics, amministrare le donazioni e rispondere ai messaggi inviati dal form contatti.",
  },
  {
    eyebrow: 'Base giuridica',
    title: 'Su quale base trattiamo i dati',
    text:
      "Il trattamento avviene per eseguire servizi richiesti dall'utente, adempiere a obblighi legali e, dove necessario, sulla base del consenso espresso tramite le azioni volontarie sul sito come registrazione, iscrizione agli eventi o invio di richieste.",
  },
  {
    eyebrow: 'Conservazione',
    title: 'Per quanto tempo conserviamo i dati',
    text:
      "Conserviamo i dati per il tempo necessario a gestire il rapporto con l'utente, rispettare obblighi amministrativi e garantire la tracciabilita delle donazioni. Le credenziali sono salvate in forma protetta e i dati non piu necessari vengono cancellati o anonimizzati.",
  },
  {
    eyebrow: 'Sicurezza',
    title: 'Come proteggiamo le informazioni',
    text:
      "Applichiamo misure tecniche e organizzative standard, tra cui autenticazione con token JWT, hashing delle password, accesso amministrativo protetto, validazione dei dati, limitazione dei privilegi e tracciamento dei flussi di pagamento tramite provider esterno sicuro.",
  },
  {
    eyebrow: 'Diritti dell utente',
    title: 'Accesso, rettifica, cancellazione e opposizione',
    text:
      "Puoi chiedere accesso ai tuoi dati, rettifica, cancellazione, limitazione del trattamento, portabilita o opposizione, nei limiti previsti dal GDPR. Puoi anche revocare eventuali consensi e proporre reclamo all'autorita garante competente.",
  },
  {
    eyebrow: 'Cookie',
    title: 'Uso di cookie e tecnologie simili',
    text:
      "Il sito usa cookie tecnici e strumenti equivalenti necessari al funzionamento della sessione, della navigazione e dell'autenticazione. Eventuali strumenti di terze parti, come PayPal, possono impostare propri cookie secondo le rispettive informative.",
  },
]

function PrivacyPage() {
  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Privacy"
        title="Informativa privacy e trattamento dati conforme al GDPR."
        description="Questa pagina spiega in modo chiaro come raccogliamo, utilizziamo, conserviamo e proteggiamo i dati personali di utenti, iscritti agli eventi e donatori."
        tone="neutral"
      />

      <section className="rounded-lg border border-primary/20 bg-base p-6 shadow-lg md:p-8">
        <SectionHeading
          eyebrow="Sintesi"
          title="Trasparenza, minimizzazione e protezione dei dati."
          description="L'associazione tratta solo i dati necessari alla gestione del sito, delle donazioni, delle iscrizioni agli eventi e delle comunicazioni con gli utenti."
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {privacySections.map((section) => (
            <article
              key={section.title}
              className="rounded-lg border border-primary/15 bg-background p-5 shadow-sm"
            >
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
          description="Per domande, richieste di accesso o cancellazione dati puoi contattare l'associazione usando i recapiti pubblicati. La richiesta verra gestita con le procedure standard previste dal GDPR."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-primary/15 bg-base p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Email</p>
            <p className="mt-3 text-sm text-text/80">info@example.com</p>
          </div>
          <div className="rounded-lg border border-primary/15 bg-base p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Telefono</p>
            <p className="mt-3 text-sm text-text/80">+39 123 456 789</p>
          </div>
          <div className="rounded-lg border border-primary/15 bg-base p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Sede</p>
            <p className="mt-3 text-sm text-text/80">Via Principale 123, Città (XX) 12345</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PrivacyPage
