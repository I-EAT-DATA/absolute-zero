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
    if (!isHost) { return; }

    console.log(playerData)

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

      {
        gameData && gameData.isStarted && (
          <div className="game">
            
            <div className="cards">
              <div className="card-group">

                <div className="card"></div>
                <div className="card">
                  <h2>{gameData.faceupCard}</h2>
                </div>

              </div>

              <div className="card-group">
                {
                  playerData[user.uid].deck.map((card, c) => {
                    return (
                      <div key={c} className="card">
                        <h2>{card}</h2>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            
            <br/>
            <button className="btn">Absolute Zero</button>

          </div>
          )
      }

      {
        isHost && !gameData.isStarted && <button className="btn" onClick={startGame}>Start</button>
      }

      <h1 style={{fontSize: "3rem", margin: "10px"}}>Players:</h1>
      <div className="players">
        {
          Object.values(playerData).reverse().map((player, c) => {
            return (
              <Player username={player.username} c={c} key={c} />
            )
          })
        }
      </div>
      
    </div>
  )
}

export default GameLobby
