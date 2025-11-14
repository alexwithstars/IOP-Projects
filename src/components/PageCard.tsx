import { Link } from 'react-router'
import './PageCard.css'
import type { Icon } from '@tabler/icons-react'

interface PageCardProps {
  title: string
  to: string
  icon: Icon
}

export const PageCard: React.FC<PageCardProps> = ({ title, to, icon: IconComponent }) => {
  return (
    <Link to={to} className='page-card'>
      <div className='page-card__icon-container'>
        <IconComponent />
      </div>
      <h2 className='page-card__title'>{title}</h2>
    </Link>
  )
}
