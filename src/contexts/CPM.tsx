import { createContext, PropsWithChildren, useState, useEffect } from 'react'
import type { Task, TaskInput, CPMContextProps, CPMResult, Node, Edge } from '@/types/CPM'

export const CPMContext = createContext<CPMContextProps | null>(null)

const calculateCPM = (tasks: Task[]): CPMResult | null => {
  if (tasks.length === 0) {
    return null
  }

  // Construir grafo de dependencias
  const taskMap = new Map<string, Task>()
  tasks.forEach(task => taskMap.set(task.id, task))

  // Validar que todos los predecesores existan
  for (const task of tasks) {
    for (const predId of task.predecessors) {
      if (!taskMap.has(predId)) {
        return null
      }
    }
  }

  // Detectar ciclos usando DFS
  const visited = new Set<string>()
  const recStack = new Set<string>()

  const hasCycle = (taskId: string): boolean => {
    visited.add(taskId)
    recStack.add(taskId)

    const task = taskMap.get(taskId)
    if (task !== undefined) {
      for (const predId of task.predecessors) {
        if (!visited.has(predId)) {
          if (hasCycle(predId)) return true
        } else if (recStack.has(predId)) {
          return true
        }
      }
    }

    recStack.delete(taskId)
    return false
  }

  for (const task of tasks) {
    if (!visited.has(task.id)) {
      if (hasCycle(task.id)) {
        return null
      }
    }
  }

  // Calcular tiempos tempranos (forward pass)
  const earliestStart = new Map<string, number>()
  const earliestFinish = new Map<string, number>()

  const calculateEarly = (taskId: string): number => {
    const cachedFinish = earliestFinish.get(taskId)
    if (cachedFinish !== undefined) {
      return cachedFinish
    }

    const task = taskMap.get(taskId)
    if (task === undefined) return 0

    let maxPredFinish = 0

    for (const predId of task.predecessors) {
      maxPredFinish = Math.max(maxPredFinish, calculateEarly(predId))
    }

    earliestStart.set(taskId, maxPredFinish)
    const finishTime = maxPredFinish + task.duration
    earliestFinish.set(taskId, finishTime)
    return finishTime
  }

  tasks.forEach(task => calculateEarly(task.id))

  const projectDuration = Math.max(...Array.from(earliestFinish.values()))

  // Calcular tiempos tardíos (backward pass)
  const latestStart = new Map<string, number>()
  const latestFinish = new Map<string, number>()

  // Inicializar tareas finales
  tasks.forEach(task => {
    if (earliestFinish.get(task.id) === projectDuration) {
      latestFinish.set(task.id, projectDuration)
      latestStart.set(task.id, projectDuration - task.duration)
    }
  })

  // Construir grafo inverso
  const successors = new Map<string, string[]>()
  tasks.forEach(task => {
    task.predecessors.forEach(predId => {
      if (!successors.has(predId)) {
        successors.set(predId, [])
      }
      const predSuccessors = successors.get(predId)
      if (predSuccessors !== undefined) {
        predSuccessors.push(task.id)
      }
    })
  })

  const calculateLate = (taskId: string): number => {
    const cachedStart = latestStart.get(taskId)
    if (cachedStart !== undefined) {
      return cachedStart
    }

    const task = taskMap.get(taskId)
    if (task === undefined) return 0

    const taskSuccessors = successors.get(taskId) ?? []

    let minSuccStart = projectDuration
    for (const succId of taskSuccessors) {
      minSuccStart = Math.min(minSuccStart, calculateLate(succId))
    }

    latestFinish.set(taskId, minSuccStart)
    const startTime = minSuccStart - task.duration
    latestStart.set(taskId, startTime)
    return startTime
  }

  tasks.forEach(task => calculateLate(task.id))

  // Crear nodos (incluyendo nodo de inicio y fin)
  const nodes: Node[] = []
  const nodePositions = new Map<string, { x: number, y: number }>()

  // Identificar tareas iniciales (sin predecesores) y finales (sin sucesores)
  const initialTasks = tasks.filter(task => task.predecessors.length === 0)
  const finalTasks = tasks.filter(task => {
    const hasSuccessors = successors.get(task.id)
    return hasSuccessors === undefined || hasSuccessors.length === 0
  })

  // Crear nodo de inicio (ID especial)
  const startNodeId = 'START_NODE'
  nodes.push({
    id: startNodeId,
    x: 50,
    y: 100,
    earliestStart: 0,
    earliestFinish: 0,
    latestStart: 0,
    latestFinish: 0,
    slack: 0
  })

  // Ordenamiento topológico para posicionar nodos de tareas
  const inDegree = new Map<string, number>()
  tasks.forEach(task => {
    inDegree.set(task.id, task.predecessors.length)
  })

  const levels: string[][] = []
  const queue: string[] = []

  tasks.forEach(task => {
    if (task.predecessors.length === 0) {
      queue.push(task.id)
    }
  })

  while (queue.length > 0) {
    const currentLevel: string[] = []
    const levelSize = queue.length

    for (let i = 0; i < levelSize; i++) {
      const taskId = queue.shift()
      if (taskId === undefined) continue

      currentLevel.push(taskId)

      const taskSuccessors = successors.get(taskId) ?? []
      taskSuccessors.forEach(succId => {
        const currentDegree = inDegree.get(succId)
        if (currentDegree === undefined) return

        const degree = currentDegree - 1
        inDegree.set(succId, degree)
        if (degree === 0) {
          queue.push(succId)
        }
      })
    }

    levels.push(currentLevel)
  }

  // Posicionar nodos de tareas
  levels.forEach((level, levelIndex) => {
    level.forEach((taskId, taskIndex) => {
      const x = (levelIndex + 1) * 200 + 50
      const y = taskIndex * 120 + 100
      nodePositions.set(taskId, { x, y })

      const es = earliestStart.get(taskId) ?? 0
      const ef = earliestFinish.get(taskId) ?? 0
      const ls = latestStart.get(taskId) ?? 0
      const lf = latestFinish.get(taskId) ?? 0
      const slack = ls - es

      nodes.push({
        id: taskId,
        x,
        y,
        earliestStart: es,
        earliestFinish: ef,
        latestStart: ls,
        latestFinish: lf,
        slack
      })
    })
  })

  // Crear nodo final
  const endNodeId = 'END_NODE'
  const maxX = Math.max(...nodes.map(n => n.x), 50)
  nodes.push({
    id: endNodeId,
    x: maxX + 200,
    y: 100,
    earliestStart: projectDuration,
    earliestFinish: projectDuration,
    latestStart: projectDuration,
    latestFinish: projectDuration,
    slack: 0
  })

  // Crear aristas (incluyendo desde nodo inicio y hacia nodo fin)
  const edges: Edge[] = []
  const criticalTasks = new Set<string>()

  // Aristas desde nodo de inicio a tareas iniciales
  initialTasks.forEach(task => {
    edges.push({
      from: startNodeId,
      to: task.id,
      taskName: task.name,
      duration: task.duration,
      isCritical: (latestStart.get(task.id) ?? 0) === 0
    })
  })

  tasks.forEach(task => {
    const taskLS = latestStart.get(task.id) ?? 0
    const taskES = earliestStart.get(task.id) ?? 0
    const slack = taskLS - taskES
    if (slack === 0) {
      criticalTasks.add(task.id)
    }

    task.predecessors.forEach(predId => {
      const predTask = taskMap.get(predId)
      if (predTask === undefined) return

      const predLS = latestStart.get(predId) ?? 0
      const predES = earliestStart.get(predId) ?? 0
      const isCritical = (taskLS - taskES) === 0 && (predLS - predES) === 0

      edges.push({
        from: predId,
        to: task.id,
        taskName: task.name,
        duration: task.duration,
        isCritical
      })
    })
  })

  // Aristas desde tareas finales al nodo final
  finalTasks.forEach(task => {
    const taskLS = latestStart.get(task.id) ?? 0
    const taskES = earliestStart.get(task.id) ?? 0
    edges.push({
      from: task.id,
      to: endNodeId,
      taskName: '',
      duration: 0,
      isCritical: (taskLS - taskES) === 0
    })
  })

  // Construir ruta crítica ordenada
  const criticalPath: string[] = []
  if (criticalTasks.size > 0) {
    // Encontrar tareas iniciales (sin predecesores o con predecesores no críticos)
    const startTasks = Array.from(criticalTasks).filter(taskId => {
      const task = taskMap.get(taskId)
      if (task === undefined) return false
      return task.predecessors.length === 0 ||
             task.predecessors.every(predId => !criticalTasks.has(predId))
    })

    // Hacer DFS desde cada tarea inicial para construir la ruta
    const visited = new Set<string>()
    const buildPath = (taskId: string): void => {
      if (visited.has(taskId)) return
      visited.add(taskId)
      criticalPath.push(taskId)

      // Encontrar siguiente tarea crítica
      const nextTasks = edges
        .filter(e => e.from === taskId && e.isCritical)
        .map(e => e.to)

      nextTasks.forEach(nextId => {
        if (criticalTasks.has(nextId)) {
          buildPath(nextId)
        }
      })
    }

    startTasks.forEach(taskId => buildPath(taskId))
  }

  return {
    nodes,
    edges,
    criticalPath,
    projectDuration
  }
}

export const CPMProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [result, setResult] = useState<CPMResult | null>(null)

  useEffect(() => {
    setResult(calculateCPM(tasks))
  }, [tasks])

  const addTask = (taskInput: TaskInput): void => {
    const newTask: Task = {
      ...taskInput,
      id: crypto.randomUUID()
    }
    setTasks(prevTasks => [...prevTasks, newTask])
  }

  const removeTask = (id: string): void => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.filter(task => task.id !== id)
      // Limpiar referencias en predecesores
      return newTasks.map(task => ({
        ...task,
        predecessors: task.predecessors.filter(predId => predId !== id)
      }))
    })
  }

  const updateTask = (id: string, updates: Partial<TaskInput>): void => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    )
  }

  return (
    <CPMContext.Provider value={{
      tasks,
      result,
      addTask,
      removeTask,
      updateTask
    }}
    >
      {children}
    </CPMContext.Provider>
  )
}
