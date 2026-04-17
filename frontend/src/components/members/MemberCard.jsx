import {
  formatMemberPosition,
  getMemberDisplayValue,
  getMemberRoleLabel,
  isPlayerRole,
} from '../../lib/members.js'
import MemberPhoto from './MemberPhoto.jsx'

function MemberCard({ member }) {
  const player = isPlayerRole(member.role)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-primary/20 bg-base shadow-[0_12px_28px_rgba(0,0,0,0.08)]">
      <MemberPhoto src={member.imageUrl} alt={member.name} className="aspect-square w-full object-cover" />

      <div className="flex flex-1 flex-col p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-primary/8 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-primary">
            {player ? 'Giocatore' : 'Staff'}
          </span>
        </div>

        <h3 className="mt-2 text-sm font-bold tracking-[-0.02em] text-text">{member.name}</h3>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary/15 bg-background px-3 py-2">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-text/55">
              {player ? 'Ruolo in campo' : 'Ruolo'}
            </p>
            <p className="mt-1 text-xs font-semibold text-text">
              {player ? formatMemberPosition(member.position) : getMemberRoleLabel(member)}
            </p>
          </div>

          {player && (
            <div className="rounded-2xl border border-primary/15 bg-background px-3 py-2">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-text/55">Numero maglia</p>
              <p className="mt-1 text-xs font-semibold text-text">{getMemberDisplayValue(member.shirtNumber)}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default MemberCard
