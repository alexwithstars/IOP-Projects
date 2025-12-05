import { ReactElement, useRef, useEffect, useState } from 'react'
import './GraphCanvas.css'
import { useCPM } from '@/hooks/useCPM'

export const GraphCanvas = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { result } = useCPM()

  const [transform, setTransform] = useState({ x: 50, y: 50, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (canvas === null || container === null) return

    canvas.width = container.clientWidth
    canvas.height = container.clientHeight

    const ctx = canvas.getContext('2d')
    if (ctx === null) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (result === null || result.nodes.length === 0) {
      ctx.fillStyle = '#64748b'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Agrega tareas para ver el grafo', canvas.width / 2, canvas.height / 2)
      return
    }

    ctx.save()
    ctx.translate(transform.x, transform.y)
    ctx.scale(transform.scale, transform.scale)

    // Dibujar aristas
    result.edges.forEach(edge => {
      const fromNode = result.nodes.find(n => n.id === edge.from)
      const toNode = result.nodes.find(n => n.id === edge.to)

      if (fromNode === undefined || toNode === undefined) return

      ctx.beginPath()
      ctx.moveTo(fromNode.x, fromNode.y)
      ctx.lineTo(toNode.x, toNode.y)

      if (edge.isCritical) {
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 3
      } else {
        ctx.strokeStyle = '#64748b'
        ctx.lineWidth = 2
      }

      ctx.stroke()

      // Dibujar flecha
      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x)
      const arrowSize = 10
      const arrowX = toNode.x - Math.cos(angle) * 40
      const arrowY = toNode.y - Math.sin(angle) * 40

      ctx.beginPath()
      ctx.moveTo(arrowX, arrowY)
      ctx.lineTo(
        arrowX - arrowSize * Math.cos(angle - Math.PI / 6),
        arrowY - arrowSize * Math.sin(angle - Math.PI / 6)
      )
      ctx.moveTo(arrowX, arrowY)
      ctx.lineTo(
        arrowX - arrowSize * Math.cos(angle + Math.PI / 6),
        arrowY - arrowSize * Math.sin(angle + Math.PI / 6)
      )
      ctx.stroke()

      // Dibujar etiqueta con nombre y duración de la tarea (solo si no es arista vacía)
      if (edge.taskName !== '') {
        const midX = (fromNode.x + toNode.x) / 2
        const midY = (fromNode.y + toNode.y) / 2

        const label = `${edge.taskName} (${edge.duration})`
        ctx.font = 'bold 14px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        // Fondo para el texto
        const textMetrics = ctx.measureText(label)
        const padding = 6
        ctx.fillStyle = '#1e293b'
        ctx.fillRect(
          midX - textMetrics.width / 2 - padding,
          midY - 10,
          textMetrics.width + padding * 2,
          20
        )

        ctx.fillStyle = edge.isCritical ? '#ef4444' : '#cbd5e1'
        ctx.fillText(label, midX, midY)
      }
    })

    // Dibujar nodos
    result.nodes.forEach(node => {
      const isCritical = result.criticalPath.includes(node.id)
      const radius = 35
      const isStartOrEnd = node.id === 'START_NODE' || node.id === 'END_NODE'

      // Círculo del nodo
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI)
      ctx.fillStyle = isCritical ? '#dc2626' : '#334155'
      ctx.fill()
      ctx.strokeStyle = isCritical ? '#ef4444' : '#64748b'
      ctx.lineWidth = 3
      ctx.stroke()

      // Tiempos en el nodo
      ctx.fillStyle = '#f1f5f9'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      if (isStartOrEnd) {
        // Para nodos de inicio/fin, mostrar solo el nombre
        ctx.font = 'bold 14px sans-serif'
        ctx.fillText(node.id === 'START_NODE' ? 'Inicio' : 'Fin', node.x, node.y)
      } else {
        // Para nodos de tareas, mostrar ES y EF
        ctx.fillText(`ES: ${node.earliestStart}`, node.x, node.y - 8)
        ctx.fillText(`EF: ${node.earliestFinish}`, node.x, node.y + 8)
      }
    })
  }, [result, transform])

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>): void => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(3, prev.scale * delta))
    }))
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!isDragging) return
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }))
  }

  const handleMouseUp = (): void => {
    setIsDragging(false)
  }

  const handleMouseLeave = (): void => {
    setIsDragging(false)
  }

  return (
    <div className='graph-canvas-container' ref={containerRef}>
      <canvas
        ref={canvasRef}
        className='graph-canvas'
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      {result !== null && result.projectDuration > 0 && (
        <div className='graph-info'>
          <div className='graph-info-item'>
            <span className='graph-info-label'>Duración del proyecto:</span>
            <span className='graph-info-value'>{result.projectDuration}</span>
          </div>
          <div className='graph-info-item'>
            <span className='graph-info-label'>Ruta crítica:</span>
            <div className='critical-path-badges'>
              {result.criticalPath
                .map(taskId => result.edges.find(e => e.to === taskId))
                .filter(edge => edge !== undefined)
                .map(edge => (
                  <span key={edge.to} className='critical-path-badge'>{edge.taskName}</span>
                ))}
            </div>
          </div>
        </div>
      )}
      <div className='graph-controls'>
        <button onClick={() => setTransform({ x: 50, y: 50, scale: 1 })}>
          Reset
        </button>
      </div>
    </div>
  )
}
