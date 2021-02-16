import React from 'react'
import { Link } from 'react-router-dom';

const Menu = () => {

  return (
    <div className="menu center">

      <h1>Absolute Zero</h1>

      <div className="menu-buttons">
        <Link className="btn" to="/control">Host Game</Link>
        <Link className="btn" to="/game">Join Game</Link>
        <Link className="btn" to="/find">Find Game</Link>
      </div>

    </div>
  )
}

export default Menu
