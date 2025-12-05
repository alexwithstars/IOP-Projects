import { Icon } from '@tabler/icons-react'
import './ModeSelector.css'
import { useEffect, useState } from 'react'

export interface Mode {
  name: string
  icon: Icon
}

interface ModeSelectorProps {
  options: Mode[]
  onSelect: (selected: number) => void
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ options, onSelect }) => {
  const [selected, setSelected] = useState(0)
  const [selectedElement, setSelectedElement] = useState<HTMLDivElement | null>(null)
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties & {
    '--width': string
    '--left': string
  }>({ '--width': '0px', '--left': '0px' })

  useEffect(() => {
    if (selectedElement === null) return
    setIndicatorStyle({
      '--width': `${selectedElement.clientWidth}px`,
      '--left': `${selectedElement.offsetLeft}px`
    })
  }, [selectedElement])

  useEffect(() => {
    onSelect(selected)
  }, [selected])

  useEffect(() => {
    const target = document.querySelector('.mode-selector-item.selected')
    if (!(target instanceof HTMLDivElement)) return
    setSelectedElement(target)
    onSelect(0)
  }, [])

  return (
    <section className='mode-selector-container'>
      <div className='mode-selector-indicator' style={indicatorStyle} />
      {options.map(({ name, icon: IconComponent }, index) => {
        return (
          <div
            key={`mds${index}`}
            className={`mode-selector-item ${(selected === index ? 'selected' : '')}`}
            onClick={(e) => {
              setSelectedElement(e.currentTarget)
              setSelected(index)
            }}
          >
            <IconComponent />
            <span>{name}</span>
          </div>
        )
      })}
    </section>
  )
}
