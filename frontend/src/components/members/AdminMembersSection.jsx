import { useEffect, useState } from 'react'
import {
  createMember,
  deleteMember,
  fetchMembers,
  updateMember,
} from '../../lib/api.js'
import { isPlayerRole, sortMembersByName } from '../../lib/members.js'
import MemberAdminForm from './MemberAdminForm.jsx'
import MemberList from './MemberList.jsx'

const emptyMemberForm = {
  name: '',
  role: '',
  position: '',
  shirtNumber: '',
  imageUrl: '',
}

function AdminMembersSection() {
  const [members, setMembers] = useState([])
  const [memberForm, setMemberForm] = useState(emptyMemberForm)
  const [editingMemberId, setEditingMemberId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingMemberId, setDeletingMemberId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await fetchMembers()
        setMembers(Array.isArray(data) ? data.sort(sortMembersByName) : [])
      } catch (error) {
        setErrorMessage(error.message || 'Errore nel caricamento dei membri.')
        setMembers([])
      } finally {
        setIsLoading(false)
      }
    }

    loadMembers()
  }, [])

  const resetFeedback = () => {
    setErrorMessage('')
    setSuccessMessage('')
  }

  const resetForm = () => {
    setEditingMemberId(null)
    setMemberForm(emptyMemberForm)
  }

  const handleFieldChange = (field, value) => {
    resetFeedback()

    setMemberForm((current) => {
      const next = { ...current, [field]: value }

      if (field === 'role' && !isPlayerRole(value)) {
        next.position = ''
        next.shirtNumber = ''
      }

      return next
    })
  }

  const handleImageChange = (event) => {
    const input = event.target

    resetFeedback()

    if ((input.files?.length ?? 0) > 1) {
      setErrorMessage('Puoi caricare una sola foto per persona. Per cambiarla, sostituisci l immagine corrente.')
      input.value = ''
      return
    }

    const file = input.files?.[0]
    if (!file) {
      input.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      setMemberForm((current) => ({
        ...current,
        imageUrl: loadEvent.target?.result ?? '',
      }))
      input.value = ''
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    resetFeedback()
    setIsSubmitting(true)

    const player = isPlayerRole(memberForm.role)
    const payload = {
      name: memberForm.name,
      role: memberForm.role,
      position: player ? memberForm.position || null : null,
      shirtNumber: player && memberForm.shirtNumber !== '' ? Number(memberForm.shirtNumber) : null,
      imageUrl: memberForm.imageUrl || null,
    }

    try {
      const savedMember = editingMemberId
        ? await updateMember(editingMemberId, payload)
        : await createMember(payload)

      setMembers((current) => {
        const nextMembers = editingMemberId
          ? current.map((member) => (member.id === editingMemberId ? savedMember : member))
          : [...current, savedMember]

        return nextMembers.sort(sortMembersByName)
      })

      setSuccessMessage(editingMemberId ? 'Membro aggiornato con successo.' : 'Membro creato con successo.')
      resetForm()
    } catch (error) {
      setErrorMessage(error.message || 'Errore nella gestione del membro.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (member) => {
    resetFeedback()
    setEditingMemberId(member.id)
    setMemberForm({
      name: member.name ?? '',
      role: member.role ?? '',
      position: member.position ?? '',
      shirtNumber: member.shirtNumber ?? '',
      imageUrl: member.imageUrl ?? '',
    })
  }

  const handleDelete = async (member) => {
    if (!window.confirm(`Vuoi eliminare il membro ${member.name}?`)) {
      return
    }

    resetFeedback()
    setDeletingMemberId(member.id)

    try {
      await deleteMember(member.id)
      setMembers((current) => current.filter((currentMember) => currentMember.id !== member.id))

      if (editingMemberId === member.id) {
        resetForm()
      }

      setSuccessMessage('Membro eliminato con successo.')
    } catch (error) {
      setErrorMessage(error.message || 'Errore durante l eliminazione del membro.')
    } finally {
      setDeletingMemberId(null)
    }
  }

  return (
    <section className="rounded-[2rem] border-2 border-primary/20 bg-base p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08)] md:p-8">
      <div className="mb-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
          {editingMemberId ? 'Modifica membro' : 'Gestione membri'}
        </h2>
        <p className="text-sm text-text/70">
          Inserisci giocatori e staff. I campi posizione e numero maglia vengono gestiti solo quando il ruolo contiene
          la parola &quot;giocatore&quot;.
        </p>
      </div>

      <MemberAdminForm
        form={memberForm}
        isSubmitting={isSubmitting}
        editingMemberId={editingMemberId}
        successMessage={successMessage}
        errorMessage={errorMessage}
        onSubmit={handleSubmit}
        onChange={handleFieldChange}
        onImageChange={handleImageChange}
        onClearImage={() => handleFieldChange('imageUrl', '')}
        onCancel={resetForm}
      />

      <div className="mt-8 border-t border-primary/12 pt-6">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Membri registrati</h3>

        {isLoading ? (
          <div className="rounded-xl border border-primary/20 bg-background px-4 py-8 text-center text-sm text-text/70">
            Caricamento membri...
          </div>
        ) : (
          <MemberList
            members={members}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingMemberId={deletingMemberId}
          />
        )}
      </div>
    </section>
  )
}

export default AdminMembersSection
