import { useEffect, useMemo, useState } from 'react'
import ActionLink from '../components/ActionLink.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import picture from '../assets/aboutusimage.jpg'
import MemberCard from '../components/members/MemberCard.jsx'
import { fetchMembers } from '../lib/api.js'
import { formatMemberPosition, MEMBER_POSITIONS, isPlayerRole, sortMembersByName } from '../lib/members.js'
import { TEAM_NAME } from '../lib/site.js'

const focusAreas = [
  {
    label: 'Calcio per tutti',
    text: 'La squadra accoglie ragazzi con disabilità diverse (sindrome di Down, disturbi psichiatrici, spettro autistico), valorizzando il gioco condiviso più della prestazione e creando un ambiente sereno e partecipato dove nessuno è escluso.',
    tone: 'primary',
  },
  {
    label: 'Percorso sportivo',
    text: 'Nato nel 2016 come semplice sogno, il progetto è cresciuto attraverso la Quarta Categoria fino alle competizioni FIGC Calcio Paralimpico e Sperimentale, conquistando risultati importanti e partecipando a tornei internazionali.',
    tone: 'secondary',
  },
  {
    label: 'Rete territoriale',
    text: 'Soccer Dream Fermana lavora in dialogo con famiglie, volontari, Fermana FC e realtà locali. Il progetto "Il Tetto di un Sogno" a Grottazzolina offre laboratori, spazi di svago e occasioni di autonomia e autodeterminazione.',
    tone: 'accent',
  },
]

const serviceCards = [
  {
    title: 'Allenamenti e partite',
    text: 'Ogni appuntamento sul campo diventa una occasione per crescere in gruppo, imparare regole condivise e vivere il calcio con entusiasmo. Dai campionati regionali ai tornei internazionali, la squadra partecipa regolarmente a manifestazioni che permettono ai ragazzi di fare nuove amicizie e vivere esperienze indimenticabili.',
    tone: 'secondary',
  },
  {
    title: 'Il Tetto di un Sogno',
    text: 'Grazie a una donazione di una palazzina su due piani a Grottazzolina, nasce il progetto per offrire laboratori (cucina, falegnameria), spazi di svago e ritrovo per le famiglie, e un appartamento per permettere ai ragazzi di vivere prime esperienze di autonomia e autodeterminazione.',
    tone: 'accent',
  },
]

const collaborationAreas = [
  {
    title: 'La nascita di Soccer Dream',
    meta: 'Origini',
    description:
      'Nel 2016 un gruppo di genitori, volontari e ragazzi con un sogno condiviso: permettere ai ragazzi con disabilità di giocare a calcio. La prima partecipazione ufficiale in un campionato CSI di calcio a 7 ha segnato l inizio di un percorso straordinario di crescita sportiva e personale.',
  },
  {
    title: 'Il percorso competitivo',
    meta: 'Evoluzione',
    description:
      'Dal 2017 al 2019: dalla Quarta Categoria FIGC (secondi classificati nel 2018), alla vittoria del campionato nel 2019 e partecipazione alle finali nazionali. Nel 2019 costituzione ufficiale come A.S.D. con iscrizione CONI e FIGC Divisione Calcio Paralimpico e Sperimentale, proseguendo fino ai tornei internazionali di Cagliari 2024.',
  },
  {
    title: 'Il Tetto di un Sogno: la nuova casa',
    meta: 'Progetto',
    description:
      'A Grottazzolina il progetto per offrire ai ragazzi e alle famiglie uno spazio proprio con laboratori di cucina e falegnameria, aree di svago, e un appartamento per esperienze di autonomia. Costruito dai volontari e dalle famiglie stesse, è gestito sempre dalla comunità.',
  },
  {
    title: 'Il nostro team inclusivo',
    meta: 'Identita',
    description:
      'Una rosa di 22 ragazzi dai 12 ai 58 anni, con Simona, la nostra super portiera, che ne rappresenta tutta la ricchezza. Giocatori con disabilità diverse lavorano insieme, superando le barriere e mostrando che lo sport veramente inclusivo è possibile.',
  },
  {
    title: 'Sostenere Soccer Dream',
    meta: 'Come aiutare',
    description:
      'Cerchiamo partner che credono nella nostra causa attraverso donazioni per materiali di costruzione, finanziamenti per le attività, e collaborazioni per inserire i ragazzi nel mondo del lavoro tramite tirocini inclusione sociale (T.i.i.s.) presso aziende amiche.',
  },
  {
    title: 'I sogni da inseguire',
    meta: 'Futuro',
    description:
      'Partecipare al bando per la gestione del centro sportivo di Monte Urano, dove i ragazzi già si allenano, aprendo opportunità di tirocinio come custodi, responsabili delle pulizie e di una piccola attività ricettiva. Allargare il raggio d azione e far conoscere il nostro progetto a più famiglie.',
  },
]

const areaStyles = {
  primary: 'border-primary/12 bg-base',
  secondary: 'border-secondary/20 bg-secondary/10',
  accent: 'border-accent/30 bg-accent/18',
}

function groupMembers(members, getGroupKey) {
  return members.reduce((groups, member) => {
    const key = getGroupKey(member)
    const currentGroup = groups.get(key) ?? []
    currentGroup.push(member)
    groups.set(key, currentGroup)
    return groups
  }, new Map())
}

function AboutPage() {
  const [members, setMembers] = useState([])
  const [isLoadingMembers, setIsLoadingMembers] = useState(true)
  const [membersError, setMembersError] = useState('')

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await fetchMembers()
        setMembers(Array.isArray(data) ? data : [])
        setMembersError('')
      } catch (error) {
        setMembers([])
        setMembersError(error.message || 'Impossibile caricare i membri del club.')
      } finally {
        setIsLoadingMembers(false)
      }
    }

    loadMembers()
  }, [])

  const { playerSections, staffSections } = useMemo(() => {
    const sortedMembers = [...members].sort(sortMembersByName)
    const players = sortedMembers.filter((member) => isPlayerRole(member.role))
    const staff = sortedMembers.filter((member) => !isPlayerRole(member.role))
    const groupedPlayers = groupMembers(players, (member) => member.position || 'without-position')
    const groupedStaff = groupMembers(staff, (member) => member.role || 'Staff')
    const playerSectionOrder = [...MEMBER_POSITIONS, 'without-position']
    const orderedPlayerSections = playerSectionOrder
      .map((position) => ({
        key: position,
        title: position === 'without-position' ? 'Ruolo non specificato' : formatMemberPosition(position),
        members: groupedPlayers.get(position) ?? [],
      }))
      .filter((section) => section.members.length > 0)
    const orderedStaffSections = [...groupedStaff.entries()]
      .sort(([firstRole], [secondRole]) => firstRole.localeCompare(secondRole, 'it-IT', { sensitivity: 'base' }))
      .map(([role, membersByRole]) => ({
        key: role,
        title: role,
        members: membersByRole,
      }))

    return {
      playerSections: orderedPlayerSections,
      staffSections: orderedStaffSections,
    }
  }, [members])

  return (
    <main className="space-y-8">
      <PageHero
        eyebrow="Chi siamo"
        title="ASD Soccer Dream Fermana: una squadra, un progetto, una comunita."
        description="Soccer Dream Fermana e una realta sportiva inclusiva del territorio fermano che usa il calcio per creare partecipazione, relazioni e occasioni concrete per i ragazzi."
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
            title="Sport, inclusione e appartenenza dentro e fuori dal campo."
            description="Il progetto e cresciuto negli anni grazie a una rete fatta di famiglie, volontari, tecnici e partner del territorio, con una identita fortemente legata a Fermo e Grottazzolina."
          />
          <div className="mt-5 max-w-3xl space-y-3 text-xs font-medium leading-7 text-text/85 md:mt-6 md:space-y-4 md:text-sm md:text-text/80">
            <p>
              Soccer Dream nasce nel 2016 da un'associazione di volontari, famiglie e ragazzi provenienti da varie esperienze sociali con in testa un sogno: dare la possibilità a questi ragazzi di giocare a calcio. La prima esperienza fu la partecipazione ad un torneo di calcio a 7 del Csi nel fermano, dove la Soccer Dream era l unica squadra con le loro caratteristiche, con cinque ragazzi e due tutor in campo.
            </p>
            <p>
              Nel 2017/2018 abbiamo partecipato al primo campionato della neonata Quarta Categoria con tesseramento CSI, raggiungendo il secondo posto in classifica generale. Nel campionato successivo un inaspettata vittoria, seguita dalla partecipazione alle finali nazionali in Valtellina e dalla Coppa Italia a Novara. Nel 2019 ci siamo costituiti in Asd con regolare iscrizione al Coni e alla Figc che ha creato la divisione Figc Dcps (Divisione Calcio Paralimpico e Sperimentale).
            </p>
            <p>
              La squadra è composta da un gruppo disomogeneo di 22 ragazzi che vanno dai 12 ai 58 anni, età della nostra super portiera Simona. Dentro il nostro team lavorano insieme giocatori con diverse abilità e condizioni, come la sindrome di Down, disturbi psichiatrici e spettro autistico, superando le barriere. Offriamo un'opportunità sportiva inclusiva per ragazzi che, crescendo, incontrano difficoltà nell integrarsi in associazioni sportive tradizionali.
            </p>
            <p>
              Oltre al calcio, i ragazzi hanno la possibilità di conoscere altri luoghi, fare nuove amicizie e vivere esperienze indimenticabili, dalle partecipazioni ai tornei estivi a Coverciano, Montecatini, San Marino, Castellarano, fino all emozione del primo viaggio in aereo durante il torneo internazionale di Cagliari nel dicembre 2024, dove abbiamo incontrato squadre blasonate come Barcellona e Liverpool.
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
          <img src={picture} alt="Allenamento di ASD Soccer Dream Fermana" className="border-2 border-primary rounded-2xl" />
          <div>
            <SectionHeading
              eyebrow="Progetti e attivita"
              title="Un percorso che parte dal calcio e si apre a nuove esperienze."
              description="L evoluzione del progetto punta ad allargare spazi, relazioni e attività, per offrire ai ragazzi luoghi di crescita anche oltre il campo."
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
            title="Collaborazioni che fanno crescere Soccer Dream Fermana."
            description="Il progetto si sviluppa con il sostegno del territorio e con partnership che aiutano a dare continuità alle attività e visibilità ai ragazzi."
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

      <section className="border-t border-primary/12 px-6 py-10 md:px-8 md:py-12">
        <SectionHeading
          eyebrow="Rosa"
          title={`I giocatori di ${TEAM_NAME}`}
          description="22 ragazzi dai 12 ai 58 anni (età della nostra super portiera Simona), con diverse disabilità e condizioni. Giocatori con sindrome di Down, disturbi psichiatrici e spettro autistico che lavorano insieme superando le barriere. La nostra disomogeneità è la caratteristica che ci distingue dalle altre squadre."
        />

        <div className="mt-6">
          {isLoadingMembers ? (
            <div className="rounded-[1.75rem] border border-primary/15 bg-base px-5 py-6 text-sm font-medium text-text/70">
              Caricamento giocatori...
            </div>
          ) : membersError ? (
            <div className="rounded-[1.75rem] border border-accent/20 bg-accent/5 px-5 py-6 text-sm font-medium text-accent">
              {membersError}
            </div>
          ) : playerSections.length > 0 ? (
            <div className="space-y-8">
              {playerSections.map((section) => (
                <div key={section.key} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-text md:text-xl">{section.title}</h3>
                    <div className="h-px flex-1 bg-primary/12" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {section.members.map((player) => (
                      <MemberCard key={player.id} member={player} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-primary/15 bg-base px-5 py-6 text-sm font-medium text-text/70">
              Nessun giocatore disponibile al momento.
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-primary/12 bg-background px-6 py-10 md:px-8 md:py-12">
        <SectionHeading
          eyebrow="Staff"
          title="Staff e collaboratori"
          description="Allenatori, dirigenti e collaboratori mantengono la stessa resa visiva dei giocatori e vengono ordinati per area di responsabilita."
        />

        <div className="mt-6">
          {isLoadingMembers ? (
            <div className="rounded-[1.75rem] border border-primary/15 bg-base px-5 py-6 text-sm font-medium text-text/70">
              Caricamento staff...
            </div>
          ) : membersError ? (
            <div className="rounded-[1.75rem] border border-accent/20 bg-accent/5 px-5 py-6 text-sm font-medium text-accent">
              {membersError}
            </div>
          ) : staffSections.length > 0 ? (
            <div className="space-y-8">
              {staffSections.map((section) => (
                <div key={section.key} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-text md:text-xl">{section.title}</h3>
                    <div className="h-px flex-1 bg-primary/12" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {section.members.map((member) => (
                      <MemberCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] border border-primary/15 bg-base px-5 py-6 text-sm font-medium text-text/70">
              Nessun membro dello staff disponibile al momento.
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default AboutPage
