import PlaceholderImage from '../PlaceholderImage.jsx'
import { formatMemberPosition, getMemberDisplayValue, isPlayerRole } from '../../lib/members.js'

function MemberList({ members, onEdit, onDelete, deletingMemberId }) {
  if (members.length === 0) {
    return (
      <div className="rounded-xl border border-primary/20 bg-background px-4 py-8 text-center text-sm text-text/70">
        Nessun membro inserito al momento.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {members.map((member) => {
        const player = isPlayerRole(member.role)
        const isDeleting = deletingMemberId === member.id

        return (
          <article
            key={member.id}
            className="flex flex-col gap-4 rounded-[1.5rem] border border-primary/20 bg-background p-4 md:flex-row md:items-center md:justify-between md:p-5"
          >
            <div className="flex flex-1 items-start gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-primary/15 bg-base">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                ) : (
                  <PlaceholderImage alt={member.name} className="h-full min-h-0 w-full rounded-none border-0 shadow-none" />
                )}
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">{member.role}</p>
                <h3 className="mt-1 text-lg font-bold text-text">{member.name}</h3>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-text/70">
                  <span className="rounded-full border border-primary/15 bg-base px-3 py-1">
                    Posizione: {player ? formatMemberPosition(member.position) : '-'}
                  </span>
                  <span className="rounded-full border border-primary/15 bg-base px-3 py-1">
                    Maglia: {player ? getMemberDisplayValue(member.shirtNumber) : '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onEdit(member)}
                className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-text transition hover:bg-primary/5"
              >
                Modifica
              </button>
              <button
                type="button"
                onClick={() => onDelete(member)}
                disabled={isDeleting}
                className="rounded-lg border border-accent/60 bg-accent/30 px-4 py-2 text-sm font-medium text-text transition hover:bg-accent/20 disabled:opacity-60"
              >
                {isDeleting ? 'Eliminazione...' : 'Elimina'}
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default MemberList
