import { createContext, type PropsWithChildren, useEffect, useState } from 'react'
import { useFO } from '@/hooks/useFO'
import type { Restriction, RestrictionAtom, RestrictionBase, RestrictionsContextProps } from '../types/Restrictions'

export const RestrictionsContext = createContext<RestrictionsContextProps | null>(null)

export const RestrictionsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { foAtoms } = useFO()

  const createEmptyRestriction = (): Restriction => {
    return {
      atoms: foAtoms.map(atom => ({ variableId: atom.id, coefficient: 0 })),
      value: 0,
      id: crypto.randomUUID()
    }
  }

  const [restrictions, setRestrictions] = useState<Restriction[]>([createEmptyRestriction()])

  const rectifyAtoms = (restrictionAtoms: RestrictionAtom[]): RestrictionAtom[] => {
    return foAtoms.map(atom => {
      return restrictionAtoms.find(a => a.variableId === atom.id) ?? {
        variableId: atom.id, coefficient: 0
      }
    })
  }

  const updateRestrictions = (): void => {
    setRestrictions(prevRestrictions =>
      prevRestrictions.map(restriction => ({
        ...restriction,
        atoms: rectifyAtoms(restriction.atoms)
      }))
    )
  }

  const addRestriction = (): void => {
    setRestrictions(prevRestrictions => {
      return [
        ...prevRestrictions,
        createEmptyRestriction()
      ]
    })
  }

  const editRestriction = (id: string, newRestriction: RestrictionBase): void => {
    const filteredAtoms = rectifyAtoms(newRestriction.atoms)
    setRestrictions(prevRestrictions =>
      prevRestrictions.map(restriction =>
        restriction.id === id ? { ...restriction, ...newRestriction, atoms: filteredAtoms } : restriction
      )
    )
  }

  const removeRestriction = (id: string): void => {
    if (restrictions.length <= 1) return
    setRestrictions(prevRestrictions => prevRestrictions.filter(restriction => restriction.id !== id))
  }

  useEffect(() => {
    updateRestrictions()
  }, [foAtoms.length])

  return (
    <RestrictionsContext.Provider value={{
      restrictions,
      addRestriction,
      editRestriction,
      removeRestriction
    }}
    >
      {children}
    </RestrictionsContext.Provider>
  )
}
