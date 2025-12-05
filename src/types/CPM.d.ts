export interface Task {
  id: string
  name: string
  duration: number
  predecessors: string[]
}

export interface TaskInput {
  name: string
  duration: number
  predecessors: string[]
}

export interface Node {
  id: string
  x: number
  y: number
  earliestStart: number
  earliestFinish: number
  latestStart: number
  latestFinish: number
  slack: number
}

export interface Edge {
  from: string
  to: string
  taskName: string
  duration: number
  isCritical: boolean
}

export interface CPMResult {
  nodes: Node[]
  edges: Edge[]
  criticalPath: string[]
  projectDuration: number
}

export interface CPMContextProps {
  tasks: Task[]
  result: CPMResult | null
  addTask: (task: TaskInput) => void
  removeTask: (id: string) => void
  updateTask: (id: string, task: Partial<TaskInput>) => void
}
