import { InventoriesContext } from '@/contexts/Inventories'
import { UseInventoriesQDMInput, UseInventoriesQDMReturn } from '@/types/Inventories'
import { useContext, useEffect } from 'react'

export const useInventoriesQDM = (): UseInventoriesQDMReturn => {
  const context = useContext(InventoriesContext)

  if (context == null) {
    throw new Error('useInventoriesQDM must be used within an InventoriesProvider')
  }

  const { input, output, setOutput } = context

  const calculateQDM = (input: UseInventoriesQDMInput): UseInventoriesQDMReturn['output'] => {
    const qs = input.qi.map(({ q, p }) => {
      const candidate = Math.sqrt((2 * input.K * input.D) / (input.h * p))
      return { p, qi: Math.max(candidate, q) }
    })
    let q = Infinity
    let TC = Infinity
    qs.forEach(candidate => {
      const TCi =
        candidate.p * input.D +
        input.D * input.K +
        candidate.qi * (input.h * candidate.p) / 2

      if (TCi < TC) {
        TC = TCi
        q = candidate.qi
      }
    })
    return { q, TC }
  }

  const setInput: UseInventoriesQDMReturn['setInput'] = (newInput) => {
    context.setInput(prevInput => ({
      ...prevInput,
      ...newInput
    }))
  }

  useEffect(() => {
    const newOutput = calculateQDM(input)
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
