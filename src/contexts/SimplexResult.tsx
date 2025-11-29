import { createContext, PropsWithChildren, useState } from 'react'
import { SimplexResultContextProps, SimplexState } from '@/types/SimplexResult'

export const SimplexResultContext = createContext<SimplexResultContextProps | null>(null)

export const SimplexResultProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [results, setResults] = useState<SimplexState[]>([])

  const addState = (newResult: SimplexState): void => {
    setResults(prevResults => [...prevResults, newResult])
  }

  const resetResults = (): void => {
    setResults([])
  }

  return (
    <SimplexResultContext.Provider value={{
      results,
      addState,
      resetResults
    }}
    >
      {children}
    </SimplexResultContext.Provider>
  )
}
