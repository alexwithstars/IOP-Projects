import { ReactElement, useEffect, useRef, useCallback } from 'react'
import { useFO } from '@/hooks/useFO'
import { FOAtom } from './FOAtom'
import './FOContainer.css'

export function FOContainer (): ReactElement {
  const { foAtoms } = useFO()
  const container = useRef<HTMLDivElement>(null)
  const counter = useRef(foAtoms.length)

  const handleWheel = useCallback((e: WheelEvent): void => {
    e.preventDefault()
    if (!(e.currentTarget instanceof HTMLElement)) return
    e.currentTarget.scrollLeft += e.deltaY
  }, [])

  useEffect(() => {
    const element = container.current
    if (element == null) return

    element.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      element.removeEventListener('wheel', handleWheel)
    }
  }, [handleWheel])

  useEffect(() => {
    if (container.current === null) return

    if (counter.current < foAtoms.length) {
      counter.current = foAtoms.length
      container.current.scrollLeft = container.current.scrollWidth
    }
  }, [foAtoms])

  return (
    <section className='fo-container'>
      <h2 className='fo-title'>F.O.</h2>
      <div className='fo-wrapper' ref={container}>
        {foAtoms.map((atom, index) => (
          <FOAtom
            key={atom.id}
            index={index}
            last={index === foAtoms.length - 1}
            atom={atom}
          />
        ))}
      </div>
    </section>
  )
}
