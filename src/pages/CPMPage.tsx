import { ReactElement } from 'react'
import { Navbar } from '@/components/Navbar'
import './CPMPage.css'

export function CPMPage (): ReactElement {
  return (
    <main className='cpm-container'>
      <Navbar />
      <h1>CPM Page</h1>
    </main>
  )
}
