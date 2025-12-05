import { useContext } from 'react'
import { CPMContext } from '@/contexts/CPM'
import type { CPMContextProps } from '@/types/CPM'

export const useCPM = (): CPMContextProps => {
  const context = useContext(CPMContext)
  if (context === null) {
    throw new Error('useCPM must be used within a CPMProvider')
  }
  return context
}
