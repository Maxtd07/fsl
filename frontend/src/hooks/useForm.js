import { useState } from 'react'

/**
 * Custom hook per gestire il state di form
 * Riduce la ripetizione di: form state, editing, submitting, errors, success
 * @param {Object} initialState - Stato iniziale del form
 * @param {Function} onSubmitFn - Callback per il submit (async)
 * @returns {Object} - Tutti gli state e handler del form
 */
export function useForm(initialState, onSubmitFn) {
  const [formData, setFormData] = useState(initialState)
  const [editingId, setEditingId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (field, value) => {
    setError('')
    setSuccess('')
    setFormData(current => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await onSubmitFn(formData, editingId)
      const message = editingId ? 'Aggiornato con successo' : 'Creato con successo'
      setSuccess(message)
      reset()
    } catch (err) {
      setError(err.message || 'Errore durante l\'operazione')
    } finally {
      setIsSubmitting(false)
    }
  }

  const reset = () => {
    setFormData(initialState)
    setEditingId(null)
    setError('')
    setSuccess('')
  }

  const setEditingData = (id, data) => {
    setEditingId(id)
    setFormData(data)
  }

  return {
    formData,
    editingId,
    isSubmitting,
    error,
    success,
    handleChange,
    handleSubmit,
    reset,
    setEditingData,
    clearMessages: () => {
      setError('')
      setSuccess('')
    },
  }
}
