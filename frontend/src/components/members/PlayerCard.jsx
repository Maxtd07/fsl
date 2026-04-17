import PlaceholderImage from '../PlaceholderImage.jsx'
import { formatMemberPosition, getMemberDisplayValue } from '../../lib/members.js'

function PlayerCard({ member }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border-2 border-primary/20 bg-base shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
      {member.imageUrl ? (
        <img src={member.imageUrl} alt={member.name} className="aspect-[4/3] w-full object-cover" />
      ) : (
        <PlaceholderImage alt={member.name} className="aspect-[4/3] w-full" />
      )}

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary">Giocatore</p>
        <h3 className="mt-3 text-lg font-bold tracking-[-0.02em] text-text">{member.name}</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary/15 bg-background px-4 py-3">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-text/55">Ruolo in campo</p>
            <p className="mt-2 text-sm font-semibold text-text">{formatMemberPosition(member.position)}</p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-background px-4 py-3">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-text/55">Numero maglia</p>
            <p className="mt-2 text-sm font-semibold text-text">{getMemberDisplayValue(member.shirtNumber)}</p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default PlayerCard
