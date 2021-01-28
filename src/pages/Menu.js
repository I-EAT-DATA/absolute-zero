import React from 'react'
import { Link } from 'react-router-dom';

const Menu = () => {

  return (
    <div>

      <h1>Buzzer</h1>
      <Link to="/control">Host Room</Link>
      <Link to="/join">Join Room</Link>

    </div>
  )
}

export default Menu
