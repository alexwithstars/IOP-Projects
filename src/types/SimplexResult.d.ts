
type FixedArray<T, N extends number> = T[] & { length: N }
type FixedMatrix<T, Rows extends number, Cols extends number> = FixedArray<FixedArray<T, Cols>, Rows>

export interface SimplexState {
  table: number[][]
  outVariables: Array<number | null>
}

export type SimplexResult = SimplexState[]

export interface SimplexResultContextProps {
  results: SimplexState[]
  addState: (newResult: SimplexState) => void
  resetResults: () => void
}

export interface UseSimplexResultReturn {
  results: SimplexState[]
  solution: number[] | null
  variablesSize: number
  restrictionsSize: number
}
