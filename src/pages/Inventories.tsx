import { ReactElement } from 'react'
import './Inventories.css'
import { Navbar } from '../components/Navbar'

export function Inventories (): ReactElement {
  return (
    <main className='inventories-container'>
      <Navbar />
      <h1>Inventories Page</h1>
    </main>
  )
}
