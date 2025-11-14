export interface RestrictionAtom {
  coefficient: number
  variableId: string
}

export interface RestrictionBase {
  atoms: RestrictionAtom[]
  value: number
}

export interface Restriction extends RestrictionBase {
  id: string
}

export interface RestrictionsContextProps {
  restrictions: Restriction[]
  addRestriction: () => void
  editRestriction: (id: Restriction['id'], newRestriction: RestrictionBase) => void
  removeRestriction: (id: Restriction['id']) => void
}

export interface UseRestrictionsReturn {
  restrictions: Restriction[]
  addRestriction: () => void
  editRestriction: (id: Restriction['id'], newRestriction: RestrictionBase) => void
  removeRestriction: (id: Restriction['id']) => void
}
