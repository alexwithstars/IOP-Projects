import './Navbar.css'
import { ROUTES } from '../const/routes'
import { NavLink } from 'react-router'

interface NavbarProps {
  color?: string
  backgroundColor?: string
  titleColor?: string
  title?: string
}

export const Navbar: React.FC<NavbarProps> = ({
  color = 'var(--primary500)',
  backgroundColor = 'var(--primary900)',
  titleColor = 'var(--primary200)',
  title
}) => {
  const style: React.CSSProperties & {
    '--nav-color': string
    '--nav-background': string
    '--title-color': string
  } = {
    '--nav-color': color,
    '--nav-background': backgroundColor,
    '--title-color': titleColor
  }
  return (
    <nav className='navbar' style={style}>
      {title !== undefined && <span className='nav-title'>{title}</span>}
      <div className='nav-links'>
        {
          Object.values(ROUTES).map(({ icon: IconComponent, ...route }) => (
            <NavLink
              key={route.name}
              to={route.path}
              className='nav-link'
            >
              <IconComponent className='nav-link-icon' />
              <span className='nav-link-text'>{route.name}</span>
            </NavLink>
          ))
        }
      </div>
    </nav>
  )
}
