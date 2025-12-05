import { createContext, PropsWithChildren, useState } from 'react'
import { InventoriesContextProps, InvEntryVars, InvOutVars } from '@/types/Inventories'

export const InventoriesContext = createContext<InventoriesContextProps | null>(null)

export const InventoriesProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [input, setInput] = useState<InvEntryVars>({
    K: 0,
    D: 0,
    h: 0,
    p: 0,
    f: 0,
    qi: []
  })

  const [output, setOutput] = useState<InvOutVars>({
    q: 0,
    TC: 0
  })

  const resetInput = (): void => {
    setInput({
      K: 0,
      D: 0,
      h: 0,
      p: 0,
      f: 0,
      qi: []
    })
  }

  const resetOutput = (): void => {
    setOutput({
      q: 0,
      TC: 0
    })
  }

  return (
    <InventoriesContext.Provider value={{
      input,
      setInput,
      resetInput,
      output,
      setOutput,
      resetOutput
    }}
    >
      {children}
    </InventoriesContext.Provider>
  )
}
