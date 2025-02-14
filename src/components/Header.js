import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import Button from './Button'

const Header = ({ title, onAdd, showAdd }) => {
const location = useLocation()

  return (
    <header className='header'>
      <h1>{title}</h1>
      {location.pathname === '/' && (
        <Button 
          color={showAdd ? 'Red' : 'green'} 
          text={showAdd ? 'Close' : 'Add'} 
          onClick={ onAdd }
        />
      )}
    </header>
  )
}

export default Header

Header.defaultProps = {
  title: 'Todo List',
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
}