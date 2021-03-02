import React from 'react'

const Player = ({ username, c }) => {
  return (
    <div className="player">
      <h1>{username}</h1>
      <h2 style={{textAlign: "right", margin: "5px"}}>{c + 1}</h2>
    </div>
  )
}

export default Player
