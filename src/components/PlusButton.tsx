import './PlusButton.css'

interface PlusButtonProps {
  onClick: () => void
  active?: boolean
}

export const PlusButton: React.FC<PlusButtonProps> = ({ onClick, active = true }) => {
  return (
    <button
      type='button'
      className={`plus-button ${active ? 'active' : ''}`}
      onClick={() => active && onClick()}
      disabled={!active}
    > +
    </button>
  )
}
