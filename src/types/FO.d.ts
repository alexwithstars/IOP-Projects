export interface FOAtomBase {
  coefficient: number
}

export interface FOAtom extends FOAtomBase {
  id: string
}

export interface FOContextProps {
  foAtoms: FOAtom[]
  addFOAtom: (atom: FOAtomBase) => void
  editCoefficient: (id: FOAtom['id'], newCoefficient: number) => void
  getFOAtom: (id: FOAtom['id']) => FOAtom | undefined
  removeFOAtom: (id: FOAtom['id']) => void
}

export interface UseFOReturn {
  foAtoms: FOAtom[]
  addFOAtom: (atom: FOAtomBase) => void
  editCoefficient: (id: FOAtom['id'], newCoefficient: number) => void
  removeFOAtom: (id: FOAtom['id']) => void
}
