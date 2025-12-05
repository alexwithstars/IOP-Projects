import { InventoriesContext } from '@/contexts/Inventories'
import { UseInventoriesEPQInput, UseInventoriesEPQReturn } from '@/types/Inventories'
import { useContext, useEffect } from 'react'

export const useInventoriesEPQ = (): UseInventoriesEPQReturn => {
  const context = useContext(InventoriesContext)

  if (context == null) {
    throw new Error('useInventoriesEPQ must be used within an InventoriesProvider')
  }

  const { input, output, setOutput } = context

  const calculateEPQ = (input: UseInventoriesEPQInput): UseInventoriesEPQReturn['output'] => {
    const q = Math.sqrt((2 * input.K * input.D) / input.h * (1 - input.D / input.f))
    const TC = Math.sqrt(2 * input.K * input.D * input.h / (1 - input.D / input.f)) + input.p * input.D
    return { q, TC }
  }

  const setInput: UseInventoriesEPQReturn['setInput'] = (newInput) => {
    context.setInput(prevInput => ({
      ...prevInput,
      ...newInput
    }))
  }

  useEffect(() => {
    const newOutput = calculateEPQ(input)
    setOutput(newOutput)
  }, [input])

  useEffect(() => {
    context.resetInput()
    context.resetOutput()
  }, [])

  return {
    output,
    setInput
  }
}
