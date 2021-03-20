import React from 'react'

const Player = ({ username, score, c }) => {
  return (
    <div className="player">
      <h1>{username}</h1>
      <h2 className="score">{score}</h2>
      {/* <h2 style={{textAlign: "left", margin: "5px", padding: "2px", background: "#35504f"}}>{score}</h2> */}
      {/* <h2 style={{textAlign: "right", margin: "5px"}}>{c + 1}</h2> */}
    </div>
  )
}

export default Player
