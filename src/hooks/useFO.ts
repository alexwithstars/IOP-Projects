import { useContext } from 'react'
import { FOContext } from '../contexts/FO'
import type { UseFOReturn } from '../types/FO'

export function useFO (): UseFOReturn {
  const context = useContext(FOContext)
  if (context == null) {
    throw new Error('useFO must be used within a FOProvider')
  }

  return context
}
