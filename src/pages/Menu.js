import React from 'react'
import { Link } from 'react-router-dom';

const Menu = () => {

  return (
    <div className="menu">

      <h1>Buzzer</h1>
      <Link className="btn" to="/control">Host Room</Link>
      <Link className="btn" to="/join">Join Room</Link>

    </div>
  )
}

export default Menu
