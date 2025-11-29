import { useContext } from 'react'
import { RestrictionsContext } from '@/contexts/Restrictions'
import type { UseRestrictionsReturn } from '@/types/Restrictions'

export function useRestrictions (): UseRestrictionsReturn {
  const context = useContext(RestrictionsContext)
  if (context == null) {
    throw new Error('useRestrictions must be used within a RestrictionsProvider')
  }

  return context
}
