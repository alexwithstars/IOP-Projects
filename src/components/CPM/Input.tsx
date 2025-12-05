import { ReactElement, useState } from 'react'
import './Input.css'
import { useCPM } from '@/hooks/useCPM'
import { CoefficientInput } from '../CoefficientInput'
import { IconX } from '@tabler/icons-react'
import { PlusButton } from '../PlusButton'

export const Input = (): ReactElement => {
  const { tasks, addTask, removeTask } = useCPM()
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskDuration, setNewTaskDuration] = useState(0)
  const [selectedPredecessors, setSelectedPredecessors] = useState<Set<string>>(new Set())

  const handleAddTask = (): void => {
    if (newTaskName.trim() === '' || newTaskDuration <= 0) return

    addTask({
      name: newTaskName.trim(),
      duration: newTaskDuration,
      predecessors: Array.from(selectedPredecessors)
    })

    setNewTaskName('')
    setNewTaskDuration(0)
    setSelectedPredecessors(new Set())
  }

  const handleRemoveTask = (id: string): void => {
    removeTask(id)
    setSelectedPredecessors(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const togglePredecessor = (taskId: string): void => {
    setSelectedPredecessors(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  return (
    <article className='input-container cpm-input-container'>
      <h2 className='input-title'>Tareas del Proyecto</h2>

      <div className='cpm-input-new-task'>
        <div className='cpm-input-task-basic'>
          <label className='input-item-label'>
            <span>Nombre de tarea</span>
            <input
              className='cpm-task-name-input'
              type='text'
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder='ej: Tarea A'
            />
          </label>
          <label className='input-item-label'>
            <span>Duración</span>
            <CoefficientInput
              value={newTaskDuration}
              onChange={setNewTaskDuration}
              fit={false}
              validation={(val) => val > 0}
            />
          </label>
        </div>

        {tasks.length > 0 && (
          <div className='cpm-predecessors-section'>
            <span className='cpm-predecessors-title'>Antecesores:</span>
            <div className='cpm-predecessors-list'>
              {tasks.map(task => (
                <button
                  key={task.id}
                  type='button'
                  className={`cpm-predecessor-badge ${selectedPredecessors.has(task.id) ? 'selected' : ''}`}
                  onClick={() => togglePredecessor(task.id)}
                >
                  {task.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <PlusButton onClick={handleAddTask} />
      </div>

      <div className='cpm-tasks-list'>
        <h3 className='cpm-tasks-list-title'>Tareas agregadas</h3>
        {tasks.length === 0
          ? <p className='cpm-empty-message'>No hay tareas agregadas</p>
          : tasks.map(task => (
            <div key={task.id} className='cpm-task-item'>
              <div className='cpm-task-info'>
                <span className='cpm-task-name'>{task.name}</span>
                <span className='cpm-task-duration'>Duración: {task.duration}</span>
                {task.predecessors.length > 0 && (
                  <span className='cpm-task-predecessors'>
                    Antecesores: {task.predecessors.map(predId =>
                    tasks.find(t => t.id === predId)?.name ?? predId
                  ).join(', ')}
                  </span>
                )}
              </div>
              <IconX
                className='cpm-task-remove'
                onClick={() => handleRemoveTask(task.id)}
              />
            </div>
          ))}
      </div>
    </article>
  )
}
