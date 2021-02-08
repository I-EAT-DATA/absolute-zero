import React from 'react'
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="join-form">
      <h1 style={{fontSize: "7rem"}}>404</h1>
      <h1 style={{marginBottom: "50px"}}>This is not the page you're looking for, move along.</h1>
      <Link to="/" className="btn">Back to Tatooine</Link>
    </div>
  )
}

export default NotFound
