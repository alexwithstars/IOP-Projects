export interface InvEntryVars {
  K: number
  D: number
  h: number
  p: number
  f: number
  qi: Array<{
    q: number
    p: number
    id: string
  }>
}

export interface InvOutVars {
  q: number
  TC: number
}

export interface InventoriesContextProps {
  input: InvEntryVars
  setInput: React.Dispatch<React.SetStateAction<InvEntryVars>>
  resetInput: () => void
  output: InvOutVars
  setOutput: React.Dispatch<React.SetStateAction<InvOutVars>>
  resetOutput: () => void
}

export type UseInventoriesEOQInput = Pick<InvEntryVars, 'K' | 'D' | 'h' | 'p'>

export type UseInventoriesQDMInput = Pick<InvEntryVars, 'K' | 'D' | 'h' | 'qi'>

export type UseInventoriesEPQInput = Pick<InvEntryVars, 'K' | 'D' | 'h' | 'f' | 'p'>

export interface UseInventoriesEOQReturn {
  output: InvOutVars
  setInput: (newInput: Partial<UseInventoriesEOQInput>) => void
}

export interface UseInventoriesQDMReturn {
  output: InvOutVars
  setInput: (newInput: Partial<UseInventoriesQDMInput>) => void
}

export interface UseInventoriesEPQReturn {
  output: InvOutVars
  setInput: (newInput: Partial<UseInventoriesEPQInput>) => void
}

export interface UseInventoriesOutputReturn {
  output: InvOutVars
}
