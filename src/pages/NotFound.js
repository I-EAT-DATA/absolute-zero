import React from 'react'
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div>
      <h1>404</h1>
      <h4>This is not the page you're looking for, move along.</h4>
      <Link to="/">Back to Tatooine</Link>
    </div>
  )
}

export default NotFound
