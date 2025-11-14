import { ReactElement } from 'react'
import './Dijkstra.css'
import { Navbar } from '../components/Navbar'

export function Dijkstra (): ReactElement {
  return (
    <main className='dijkstra-container'>
      <Navbar />
      <h1>Dijkstra Page</h1>
    </main>
  )
}
