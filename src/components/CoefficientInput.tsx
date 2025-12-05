import { useEffect, useState } from 'react'
import './CoefficientInput.css'

interface CoefficientInputProps {
  value?: number
  index?: number
  fit?: boolean
  onChange: (newValue: number) => void
  validation?: (value: number) => boolean
}

export const CoefficientInput: React.FC<CoefficientInputProps> = ({
  value, index = -1, onChange, validation = () => true, fit = true
}) => {
  const [refinedStringValue, setRefinedStringValue] = useState(() => {
    if (value === undefined || value === 0) return ''
    return value.toString()
  })

  const atomStyle: React.CSSProperties & { '--size': string } = {
    '--size': `${Math.max(refinedStringValue.length, 3)}ch`
  }

  const checkValidity = (val: string): boolean => {
    const neutralState = /^\d{0,10}\.?\d{0,5}$/
    return neutralState.test(val)
  }

  const handleInputChange = (e: React.InputEvent<HTMLInputElement>): void => {
    const inputValue = e.currentTarget.value.trim()

    if (!checkValidity(inputValue)) return

    const newCoefficient = parseFloat(inputValue)
    if (!isNaN(newCoefficient) && !validation(newCoefficient)) return

    setRefinedStringValue(inputValue)

    if (!isNaN(newCoefficient)) {
      onChange(newCoefficient)
    } else {
      onChange(0)
    }
  }

  const handleInputBlur = (): void => {
    const newValue = parseFloat(refinedStringValue)
    if (isNaN(newValue) || newValue === 0) setRefinedStringValue('')
    else setRefinedStringValue(newValue.toString())
  }

  useEffect(() => {
    if (value === undefined || value === 0) {
      setRefinedStringValue('')
      return
    }
    setRefinedStringValue(value.toString())
  }, [value])

  return (
    <div className='coefficient-input'>
      <input
        className='coefficient-input-value'
        style={fit ? atomStyle : {}}
        value={refinedStringValue}
        onInput={handleInputChange}
        onBlur={handleInputBlur}
        placeholder='0'
      />
      {index !== -1 && (
        <span className='coefficient-variable'>X<sub>{index + 1}</sub></span>
      )}
    </div>
  )
}
