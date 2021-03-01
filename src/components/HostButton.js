import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import firebase from '../firebase'
import { useGlobalContext } from '../context'

const HostButton = () => {
  const ref = firebase.firestore().collection("games")
  const { gameCode, setGameCode, playerData, user } = useGlobalContext()

  const history = useHistory()
  let unlisten = () => {}

  // const [gameCode, setGameCode] = useState()

  const deleteRoom = () => {
    console.log(gameCode)
    ref.doc(gameCode).delete().catch((err) => console.log(err))
    window.location.reload()
  }

  const createGame = () => {
    const newGameCode = Math.random().toString().substr(2, 6)
    setGameCode(newGameCode)

    const gameData = {
      host: user.uid , 
      isPrivate: false, 
      isStarted: false, 
      numPlayers: 1, 
      scores: { 
        [user.uid]: playerData.deck.reduce((a, b) => a + b, 0)
      }
    }

    ref.doc(newGameCode).set(gameData).catch((err) => console.log(err))

    // ref.doc(newGameCode).collection("players").doc("temp").set({})
  }

  useEffect(() => {
    if (!gameCode) { return; }
    window.addEventListener("beforeunload", deleteRoom)

    unlisten = history.listen((route) => {
      console.log(route.pathname)
      if (route.pathname === "/game") { return; }
      deleteRoom()

      window.removeEventListener("beforeunload", deleteRoom)
      unlisten()
    })

    history.push(`/game?code=${gameCode}`)

  }, [gameCode])

  return (
    <button className="btn" onClick={createGame}>Host Game</button>
  )
}

export default HostButton
