import React from 'react'
import { useHistory } from 'react-router-dom'

const OpenGame = ({ gameCode, numPlayers }) => {
  const history = useHistory()

  const gotoJoinGame = () => {
    history.push(`/game?code=${gameCode}`)
  }

  return (
    <div className="open-game" onClick={gotoJoinGame}>

      <h1>{gameCode}</h1>
      <h4>{numPlayers}/4</h4>

    </div>
  )
}

export default OpenGame