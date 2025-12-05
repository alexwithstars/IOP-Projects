import { ReactElement, useEffect, useMemo, useState } from 'react'
import './Input.css'
import { CoefficientInput } from '../CoefficientInput'
import { useInventoriesEOQ } from '@/hooks/useInventoriesEOQ'
import { useInventoriesQDM } from '@/hooks/useInventoriesQDM'
import { useInventoriesEPQ } from '@/hooks/useInventoriesEPQ'
import { UseInventoriesQDMInput } from '@/types/Inventories'
import { PlusButton } from '../PlusButton'
import { IconArrowRight, IconX } from '@tabler/icons-react'

interface SimpleInput {
  label: string
  onChange: (value: number) => void
  validation?: (value: number) => boolean
}

export const InputEOQ = (): ReactElement => {
  const { setInput } = useInventoriesEOQ()

  const EOQInputs: SimpleInput[] = useMemo(() => ([
    { label: 'Demanda anual (D)', onChange: value => setInput({ D: value }) },
    { label: 'Costo de ordenar (K)', onChange: value => setInput({ K: value }) },
    { label: 'Costo por unidad (p)', onChange: value => setInput({ p: value }) },
    { label: 'Costo de mantener inventario (h)', onChange: value => setInput({ h: value }) }
  ]), [])

  return (
    <article className='input-container'>
      <h2 className='input-title'>Entrada - (EOQ)</h2>
      <div className='input-content'>
        {EOQInputs.map(({ label, onChange }, index) => (
          <div className='input-item' key={`eoq-input-${index}`}>
            <label className='input-item-label'>
              <span>{label}</span>
              <CoefficientInput
                onChange={onChange}
                fit={false}
              />
            </label>
          </div>
        ))}
      </div>
    </article>
  )
}

interface ListItemProps {
  onChangeQ: (value: number) => void
  onChangeP: (value: number) => void
  index: number
}

export const InputDiscount = (): ReactElement => {
  const [ranges, setRanges] = useState<(UseInventoriesQDMInput['qi'])>([
    { q: 1, p: 0, id: crypto.randomUUID() }
  ])
  const { setInput } = useInventoriesQDM()

  const QDMInputs: SimpleInput[] = useMemo(() => ([
    { label: 'Demanda anual (D)', onChange: value => setInput({ D: value }) },
    { label: 'Costo de ordenar (K)', onChange: value => setInput({ K: value }) },
    {
      label: 'Descuento por cantidad (h%)',
      onChange: value => setInput({ h: value }),
      validation: value => value >= 0 && value <= 100
    },
    {
      label: 'Precio base por unidad (p)',
      onChange: value => {
        setRanges(prevRanges => {
          const newRanges = [...prevRanges]
          newRanges[0] = { ...newRanges[0], p: value }
          return newRanges
        })
      }
    }
  ]), [])

  const ListItem: React.FC<ListItemProps> = useMemo(() => ({ onChangeQ, onChangeP, index }) => (
    <div className='input-list-item'>
      <label className='input-list-item-label'>
        <span>Cantidad mínima ({index})</span>
        <CoefficientInput
          onChange={onChangeQ}
          fit={false}
        />
      </label>
      <IconArrowRight className='input-list-item-midIcon' />
      <label className='input-list-item-label'>
        <span>Costo unitario ($)</span>
        <CoefficientInput
          onChange={onChangeP}
          fit={false}
        />
      </label>
      <IconX
        className='input-list-item-removeIcon' onClick={() => {
          console.log('removing index', index)
          setRanges(prevRanges => prevRanges.filter((_, i) => i !== index))
        }}
      />
    </div>
  ), [])

  useEffect(() => {
    setInput({ qi: ranges })
  }, [ranges])

  return (
    <article className='input-container'>
      <h2 className='input-title'>Entrada - (QDM)</h2>
      <div className='input-content'>
        {QDMInputs.map(({ label, onChange }, index) => (
          <div className='input-item' key={`eoq-input-${index}`}>
            <label className='input-item-label'>
              <span>{label}</span>
              <CoefficientInput
                onChange={onChange}
                fit={false}
              />
            </label>
          </div>
        ))}
      </div>
      <div className='input-list-container'>
        <h3 className='input-list-title'>Rangos de descuento por cantidad</h3>
        <div className='input-list'>
          {ranges.map(({ id }, index) => {
            if (index < 1) return null
            return (
              <ListItem
                key={`qdm-range-${id}`}
                index={index}
                onChangeQ={value => {
                  setRanges(prevRanges => {
                    const newRanges = [...prevRanges]
                    newRanges[index] = { ...newRanges[index], q: value }
                    return newRanges
                  })
                }}
                onChangeP={value => {
                  setRanges(prevRanges => {
                    const newRanges = [...prevRanges]
                    newRanges[index] = { ...newRanges[index], p: value }
                    return newRanges
                  })
                }}
              />
            )
          })}
          <PlusButton
            onClick={() => {
              setRanges(prevRanges => ([...prevRanges, { q: 0, p: 0, id: crypto.randomUUID() }]))
            }}
          />
        </div>
      </div>
    </article>
  )
}

export const InputProduction = (): ReactElement => {
  const { setInput } = useInventoriesEPQ()

  const EPQInputs: SimpleInput[] = useMemo(() => ([
    { label: 'Demanda anual (D)', onChange: value => setInput({ D: value }) },
    { label: 'Costo de ordenar (K)', onChange: value => setInput({ K: value }) },
    { label: 'Costo por unidad (p)', onChange: value => setInput({ p: value }) },
    { label: 'Costo de mantener inventario (h)', onChange: value => setInput({ h: value }) },
    { label: 'Tasa de producción (f)', onChange: value => setInput({ f: value }) }
  ]), [])

  return (
    <article className='input-container'>
      <h2 className='input-title'>Entrada - (EPQ)</h2>
      <div className='input-content'>
        {EPQInputs.map(({ label, onChange, validation }, index) => (
          <div className='input-item' key={`eoq-input-${index}`}>
            <label className='input-item-label'>
              <span>{label}</span>
              <CoefficientInput
                onChange={onChange}
                fit={false}
                validation={validation}
              />
            </label>
          </div>
        ))}
      </div>
    </article>
  )
}
