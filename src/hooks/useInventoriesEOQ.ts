import { InventoriesContext } from '@/contexts/Inventories'
import { UseInventoriesEOQInput, UseInventoriesEOQReturn } from '@/types/Inventories'
import { useContext, useEffect } from 'react'

export const useInventoriesEOQ = (): UseInventoriesEOQReturn => {
  const context = useContext(InventoriesContext)

  if (context == null) {
    throw new Error('useInventoriesEOQ must be used within an InventoriesProvider')
  }

  const { input, output, setOutput } = context

  const calculateEOQ = (input: UseInventoriesEOQInput): UseInventoriesEOQReturn['output'] => {
    const q = Math.sqrt((2 * input.K * input.D) / input.h)
    const TC = (input.K * input.D) / q + (input.h * q) / 2 + (input.p * input.D)
    return { q, TC }
  }

  const setInput: UseInventoriesEOQReturn['setInput'] = (newInput) => {
    context.setInput(prevInput => ({
      ...prevInput,
      ...newInput
    }))
  }

  useEffect(() => {
    const newOutput = calculateEOQ(input)
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
