import { SimplexResultContext } from '../contexts/SimplexResult'
import { useCallback, useContext, useEffect, useState } from 'react'
import { SimplexState, UseSimplexResultReturn } from '../types/SimplexResult'
import { useFO } from './useFO'
import { useRestrictions } from './useRestrictions'
import { Restriction } from '../types/Restrictions'
import { FOAtom } from '../types/FO'

interface calcReturn {
  table: SimplexState['table']
  pivRow: number
  pivCol: number
}

export const useSimplexResult = (): UseSimplexResultReturn => {
  const context = useContext(SimplexResultContext)
  const [solution, setSolution] = useState<UseSimplexResultReturn['solution']>(null)

  if (context == null) {
    throw new Error('useSimplexResult must be used within a SimplexResultProvider')
  }

  const { foAtoms } = useFO()
  const { restrictions } = useRestrictions()

  const { results, addState, resetResults } = context

  const iterateTable = useCallback((table: SimplexState['table'], xs: number, rs: number): calcReturn | null => {
    if (table.length === 0 || table[0].length === 0) {
      throw new Error('Table is empty')
    }
    if (xs === 0 || rs === 0) {
      throw new Error('Number of variables or restrictions is zero')
    }
    if (table.length !== rs + 1 ||
      table.some(row => row.length !== xs + rs + 2)
    ) {
      throw new Error('Table dimensions do not match the number of variables and restrictions')
    }

    let pivCol = -1; let mn = 0
    for (let i = 1; i <= xs; i++) {
      if (table[0][i] < mn) {
        mn = table[0][i]
        pivCol = i
      }
    }

    if (pivCol === -1) return null

    let pivRow = -1; let minRatio = Infinity
    for (let i = 1; i <= rs; i++) {
      const ratio = table[i][table[i].length - 1] / table[i][pivCol]
      if (ratio > 0 && ratio < minRatio) {
        minRatio = ratio
        pivRow = i
      }
    }

    if (pivRow === -1) throw new Error('Linear program is unbounded')

    const pivot = table[pivRow][pivCol]

    const newPivotRow = table[pivRow].map(value => value / pivot)

    const newTable = table.map((row, rIdx) => {
      if (rIdx === pivRow) return newPivotRow
      return row.map((value, cIdx) => value - newPivotRow[cIdx] * row[pivCol])
    })

    pivRow--
    pivCol--

    return { table: newTable, pivRow, pivCol }
  }, [])

  const calculateSolution = useCallback((
    { atoms, restrictions }:
    { atoms: FOAtom[], restrictions: Restriction[] }
  ): calcReturn[] | null => {
    if (atoms.length === 0 || restrictions.length === 0) {
      return null
    }

    const xs = atoms.length
    const rs = restrictions.length

    const initialTable: number[][] = []

    // Objective function row
    initialTable.push([])
    initialTable[0] = new Array(xs + rs + 2).fill(0)
    initialTable[0][0] = 1
    for (let i = 1; i <= xs; i++) {
      initialTable[0][i] = -atoms[i - 1].coefficient
    }

    // Restriction rows
    restrictions.forEach((restriction, rIdx) => {
      const newRow = []
      newRow.push(0)
      newRow.push(...restriction.atoms.map(atom => atom.coefficient))
      const slackVariables = new Array(rs).fill(0)
      slackVariables[rIdx] = 1
      newRow.push(...slackVariables)
      newRow.push(restriction.value)
      initialTable.push(newRow)
    })

    const calcResults: calcReturn[] = []
    let currentResult: calcReturn | null = { table: initialTable, pivRow: -1, pivCol: -1 }
    while (currentResult !== null) {
      calcResults.push(currentResult)
      try {
        currentResult = iterateTable(currentResult.table, xs, rs)
      } catch (error) {
        // console.warn('Simplex iteration error:', error)
        break
      }
    }

    return calcResults
  }, [])

  useEffect(() => {
    resetResults()

    // Calculate Simplex results
    const results = calculateSolution({ atoms: foAtoms, restrictions })
    if (results === null) return
    const outVariables: SimplexState['outVariables'] = Array(restrictions.length).fill(null)

    // Store each state in context
    results.forEach(({ table, pivCol, pivRow }) => {
      if (pivRow !== -1 || pivCol !== -1) {
        outVariables[pivRow] = pivCol
      }
      addState({ table, outVariables: [...outVariables] })
    })

    // Calculate solution array
    const solutionArray: UseSimplexResultReturn['solution'] = Array(foAtoms.length + 1).fill(0)
    const lastTable = results[results.length - 1].table
    outVariables.forEach((varIdx, rIdx) => {
      if (varIdx == null) return
      const coefficient = lastTable[rIdx + 1].at(-1) ?? 0
      solutionArray[varIdx + 1] = coefficient
    })
    solutionArray[0] = lastTable[0].at(-1) ?? 0
    setSolution(solutionArray)
  }, [foAtoms, restrictions])

  return {
    results,
    solution,
    variablesSize: foAtoms.length,
    restrictionsSize: restrictions.length
  }
}
