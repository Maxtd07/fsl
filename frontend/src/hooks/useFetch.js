import { useState, useEffect } from 'react'

/**
 * Custom hook per gestire il fetching di dati
 * Semplifica il pattern: loading -> data -> error
 * @param {Function} fetchFn - Funzione che esegue il fetch
 * @param {Array} dependencies - Array di dipendenze per useEffect
 * @returns {Object} { data, isLoading, error, setData, refetch }
 */
export function useFetch(fetchFn, dependencies = []) {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError('')
      const result = await fetchFn()
      setData(Array.isArray(result) ? result : result || [])
    } catch (err) {
      setError(err.message || 'Errore nel caricamento dei dati')
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, dependencies)

  return {
    data,
    isLoading,
    error,
    setData,
    refetch: fetchData,
  }
}
