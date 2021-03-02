import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import useSound from 'use-sound';

import firebase from '../firebase'
import { useGlobalContext } from '../context'

import Player from '../components/Player'

const GameLobby = () => {
  // const history = useHistory()
  // const [unlisten, setUnlisten] = useState(() => {})

  const ref = firebase.firestore().collection("games")
  const { gameCode, setModalData, setInGame, user } = useGlobalContext()

  const [gameData, setGameData] = useState()
  const [playerData, setPlayerData] = useState({})

  const [isHost, setIsHost] = useState(false)

  const deletePlayer = () => {
    if (isHost) { return; }
    ref.doc(gameCode).collection("players").doc(user.uid).delete().catch((err) => console.log(err))
  }

  const getGameData = () => {
    ref.doc(gameCode).onSnapshot((querySnapshot) => {
      try {
        setGameData(querySnapshot.data())
      } catch (error) {
        console.log(error)

        setInGame(false)
        setModalData({ isModalOpen: true, modalContent: "Game Has Vanished ＞﹏＜" })
      }
    })
  }

  const getPlayerData = () => {
    ref.doc(gameCode).collection("players").onSnapshot((querySnapshot) => {
      let playerDocs = {}

      querySnapshot.forEach((doc) => { 
        playerDocs = { ...playerDocs, [doc.id]: doc.data() } 
      })

      setPlayerData(playerDocs)
    })
  }

  const checkIsHost = () => {
    if (gameData.host === user.uid) {
      setIsHost(true)
    }
    else {
      setIsHost(false)
    }
  }

  useEffect(() => {

    getGameData()
    getPlayerData()

    window.addEventListener("beforeunload", deletePlayer)
    // setUnlisten(history.listen((route) => {
    //   console.log(route)
    //   deletePlayer()
    // }))

    return () => {
      window.removeEventListener("beforeunload", deletePlayer)
      // unlisten()
    }
  
  }, [])

  useEffect(() => {
    if (!gameData) { return; }
    checkIsHost()
    console.log(gameData)
  }, [gameData])

  useEffect(() => {
    console.log(isHost);
    if (!isHost) { return; }

    let newScores = {}

    Object.keys(playerData).forEach((playerKey) => { 
      newScores = { ...newScores, [playerKey]: playerData[playerKey].deck.reduce((a, b) => a + b, 0) } 
    })

    ref.doc(gameCode).update({ numPlayers: Object.keys(playerData).length, scores: newScores })
    
  }, [playerData])

  const startGame = () => {
    ref.doc(gameCode).update({ isStarted: true })
  }

  return (
    <div className="center">

      {/* {
        gameData.isStarted && <Game />
      } */}

      {
        isHost && !gameData.isStarted && <button className="btn" onClick={startGame}>Start</button>
      }

      <h1>Players:</h1>
      <div className="players">
        {
          Object.values(playerData).reverse().map((player, c) => {
            return (
              <Player username={player.username} c={c} key={new Date().getTime() + Math.random()} />
            )
          })
        }
      </div>
      
    </div>
  )
}

export default GameLobby
