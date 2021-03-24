import React from 'react'

const Card = ({c, canPlay, card}) => {
  return (
    <div key={c} className={`card deck ${!canPlay && "disabled"}`}>
      <h2>{card}</h2>
    </div>
  )
}

export default Card
