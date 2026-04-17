import PlaceholderImage from '../PlaceholderImage.jsx'
import { MEMBER_POSITIONS, MEMBER_POSITION_LABELS, isPlayerRole } from '../../lib/members.js'

const fieldClassName =
  'w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/12'

function MemberAdminForm({
  form,
  isSubmitting,
  editingMemberId,
  successMessage,
  errorMessage,
  onSubmit,
  onChange,
  onImageChange,
  onClearImage,
  onCancel,
}) {
  const player = isPlayerRole(form.role)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-text">Nome completo</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => onChange('name', event.target.value)}
              placeholder="Cognome Nome"
              className={fieldClassName}
              required
            />
            <p className="mt-2 text-xs text-text/60">Inserisci il nome nel formato Cognome Nome.</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text">Ruolo</label>
            <input
              type="text"
              value={form.role}
              onChange={(event) => onChange('role', event.target.value)}
              placeholder="Es. Giocatore, Allenatore, Fisioterapista"
              className={fieldClassName}
              required
            />
            <p className="mt-2 text-xs text-text/60">
              Se il ruolo contiene la parola &quot;giocatore&quot;, verranno mostrati posizione e numero di maglia.
            </p>
          </div>

          {player && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-text">Posizione</label>
                <select
                  value={form.position}
                  onChange={(event) => onChange('position', event.target.value)}
                  className={fieldClassName}
                >
                  <option value="">Seleziona posizione</option>
                  {MEMBER_POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      {MEMBER_POSITION_LABELS[position]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-text">Numero maglia</label>
                <input
                  type="number"
                  min="1"
                  value={form.shirtNumber}
                  onChange={(event) => onChange('shirtNumber', event.target.value)}
                  placeholder="Es. 10"
                  className={fieldClassName}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="mb-2 block text-sm font-medium text-text">Immagine</label>
          <div className="overflow-hidden rounded-[1.5rem] border border-primary/20 bg-base">
            {form.imageUrl ? (
              <img src={form.imageUrl} alt={form.name || 'Anteprima membro'} className="aspect-square w-full object-cover" />
            ) : (
              <PlaceholderImage alt="Membro" className="aspect-square w-full min-h-0" />
            )}
          </div>

          <label className="block cursor-pointer rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 py-4 text-center transition hover:bg-primary/10">
            <span className="text-sm font-medium text-primary">Carica immagine</span>
            <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
          </label>

          {form.imageUrl && (
            <button
              type="button"
              onClick={onClearImage}
              className="w-full rounded-xl border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
            >
              Rimuovi immagine
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(76,130,169,0.22)] transition hover:bg-primary/92 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvataggio...' : editingMemberId ? 'Aggiorna membro' : 'Crea membro'}
        </button>

        {editingMemberId && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-full border border-primary/20 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
          >
            Annulla modifica
          </button>
        )}
      </div>
    </form>
  )
}

export default MemberAdminForm
