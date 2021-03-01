import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import useSound from 'use-sound';

import firebase from '../firebase'
import { useGlobalContext } from '../context'

const GameRoom = () => {
  const history = useHistory()
  let unlisten = () => {}

  const ref = firebase.firestore().collection("games")
  const { gameCode, setModalData, setInGame, user } = useGlobalContext()

  const [gameData, setGameData] = useState([])
  const [playerData, setPlayerData] = useState([])

  const [isHost, setIsHost] = useState()

  const deletePlayer = () => {
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
      const playerDocs = []

      querySnapshot.forEach((doc) => {
        playerDocs.push(doc.data())
      })

      if (isHost) {
        ref.doc(gameCode).update({  })
      }

      setPlayerData(playerDocs)
    })
  }

  const checkIsHost = () => {
    if (gameData.host == user.uid) {
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
    unlisten = history.listen((route) => {
      console.log(route)
      deletePlayer()
    })

    return () => {
      window.removeEventListener("beforeunload", deletePlayer)
      unlisten()
    }
  
  }, [])

  useEffect(() => {
    if (!gameData) { return; }
    checkIsHost()
  }, [gameData])

  return (
    <div className="center">

      {
        playerData.map((player, c) => {
          return (
            <div key={new Date().getTime() + Math.random()}>
              <h1>{player.username}</h1>
              <h4>{c + 1}</h4>
            </div>
          )
        })
      }

      {
        isHost && <button className="btn">Yey</button>
      }
      
    </div>
  )
}

export default GameRoom
