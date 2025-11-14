import { ReactElement } from 'react'
import { Navbar } from '../components/Navbar'
import './Hungarian.css'

export function Hungarian (): ReactElement {
  return (
    <main className='hungarian-container'>
      <Navbar />
      <h1>Hungarian Page</h1>
    </main>
  )
}
