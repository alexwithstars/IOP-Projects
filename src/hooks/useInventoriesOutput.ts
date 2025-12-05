import { InventoriesContext } from '@/contexts/Inventories'
import { UseInventoriesOutputReturn } from '@/types/Inventories'
import { useContext } from 'react'

export const useInventoriesOutput = (): UseInventoriesOutputReturn => {
  const context = useContext(InventoriesContext)

  if (context == null) {
    throw new Error('useInventoriesOutput must be used within an InventoriesProvider')
  }

  const { output } = context

  return {
    output
  }
}
