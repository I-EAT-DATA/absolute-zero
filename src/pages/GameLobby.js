import React, { useState, useEffect, useRef } from 'react'
// import { useHistory } from 'react-router-dom'
// import useSound from 'use-sound';
// import { useDrag, useDrop } from 'react-dnd';

import firebase from '../firebase'
import { useGlobalContext } from '../context'

import Player from '../components/Player'
import Card from '../components/Card'
import HostButton from '../components/HostButton'

// import { ItemTypes } from '../util/items'

const GameLobby = () => {
  // const history = useHistory()
  // const [unlisten, setUnlisten] = useState(() => {})

  const ref = firebase.firestore().collection("games")
  const { gameCode, setModalData, setInGame, playerData, setPlayerData, user } = useGlobalContext()

  const [gameData, setGameData] = useState()
  const [recentChangeType, setRecentChangeType] = useState({})
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0)
  const [players, setPlayers] = useState({})

  const [winner, setWinner] = useState("")

  const [isHost, setIsHost] = useState(false)
  const [canPlay, setCanPlay] = useState(false)

  const faceupCard = useRef(null)
  const [faceupSelected, setFaceupSelected] = useState(true)

  // dragging functionality can come later, get the game working first

  // const [{isDragging}, drag] = useDrag({
  //   item: {
  //     type: ItemTypes.CARD,
  //   },
  //   collect: monitor => ({
  //     isDragging: !!monitor.isDragging()
  //   })
  // })

  // const [{isOver}, drop] = useDrop({
  //   accept: ItemTypes.CARD,
  //   collect: monitor => ({
  //     isOver: !!monitor.isOver()
  //   })
  // })

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

  const getPlayers = () => {
    ref.doc(gameCode).collection("players").onSnapshot((querySnapshot) => {
      let playerDocs = {}
      let changeType = "none";

      querySnapshot.forEach((doc) => { 
        playerDocs = { ...playerDocs, [doc.id]: doc.data() }
      })

      querySnapshot.docChanges().forEach((change) => {
        changeType = change.type
        // if (change.type === "modified") {
        //   console.log("Modified thing: ", change.doc.data());
        // }
      })

      setRecentChangeType(changeType)
      setPlayers(playerDocs)
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

  const checkCanPlay = () => {
    if (gameData.currentTurn === user.uid) {
      setCanPlay(true)
    }
    else {
      setCanPlay(false)
    }
  }

  useEffect(() => {

    getGameData()
    getPlayers()

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
    console.log(gameData);
    checkIsHost()
    checkCanPlay()
  }, [gameData])

  useEffect(() => {
    if (!playerData) { return; }
    ref.doc(gameCode).collection("players").doc(user.uid).update(playerData)
  }, [playerData])

  useEffect(() => {
    if (!isHost) { return; }

    console.log(recentChangeType)

    let newScores = gameData.scores
    let newFaceupCard = gameData.faceupCard
    let newCurrentTurn = gameData.currentTurn

    if (recentChangeType === "added" || recentChangeType === "removed") {
      Object.keys(players).forEach((playerKey) => { 
        newScores = { ...newScores, [playerKey]: 0 } 
      })
    }
    else if (recentChangeType === "modified") {
      // console.log("change faceup card in gamedata and change turn, if change was absolute zero, tally scores and start at player 1 with new deck and faceup")
      newFaceupCard = players[gameData.currentTurn].changedCard

      let newCurrentTurnIndex = currentTurnIndex === Object.keys(players).length - 1 ? 0 : currentTurnIndex + 1

      if (players[gameData.currentTurn].absoluteZeroPressed && players[gameData.currentTurn].deck.reduce((a, b) => a + b, 0) === 0) {
        // TODO: new deck + new faceup

        // Object.keys(players).forEach((playerKey) => { 
        //   newScores = { ...newScores, [playerKey]: gameData.scores[playerKey] + players[playerKey].deck.reduce((a, b) => a + b, 0) } 

        //   let newDeck = playerData.deck.map(() => Math.floor(Math.random() * 20) - 10)
        //   ref.doc(gameCode).collection("players").doc(playerKey).update({ deck: newDeck, absoluteZeroPressed: false })
        // })

        // console.log(newFaceupCard)

        // newCurrentTurnIndex = 0
        // ref.doc(gameCode).collection("players").doc(Object.keys(players)[0]).update({ changedCard: Math.floor(Math.random() * 20) - 10 })
        setWinner(gameData.currentTurn)
      }
      else if (players[gameData.currentTurn].absoluteZeroPressed && players[gameData.currentTurn].deck.reduce((a, b) => a + b, 0) !== 0) {
        ref.doc(gameCode).collection("players").doc(gameData.currentTurn).update({ absoluteZeroPressed: false })
      }

      newCurrentTurn = Object.keys(players)[newCurrentTurnIndex]
      setCurrentTurnIndex(newCurrentTurnIndex)
    }

    ref.doc(gameCode).update({ numPlayers: Object.keys(players).length, scores: newScores, faceupCard: newFaceupCard, currentTurn: newCurrentTurn })
    
  }, [players])

  const startGame = () => {
    ref.doc(gameCode).update({ isStarted: true })
  }

  const selectCard = (isFaceupCard) => {
    setFaceupSelected(isFaceupCard)
  }

  const switchCard = (c) => {
    if (!canPlay) { return; }

    console.log(c);

    let newDeck = players[user.uid].deck.map((card) => card)
    newDeck[c] = faceupSelected ? parseInt(faceupCard.current.firstChild.innerHTML) : Math.floor(Math.random() * 20) - 10
    // ref.doc(gameCode).collection("players").doc(user.uid).update({ deck: newDeck })
    setPlayerData({ ...playerData, deck: newDeck, changedCard: playerData.deck[c] })

    // setCanPlay(false)
  }

  const absoluteZero = () => {
    if (players[user.uid].deck.reduce((a, b) => a + b, 0) !== 0) { return; }

    setPlayerData({ ...playerData, absoluteZeroPressed: true })
  }

  if (winner) {
    return (
      <div className="center">
        <h2>{players[winner].username} Won With Absolute Zero!</h2>

        <div className="card-group">
          {
            players[winner].deck.map((card, c) => {
              return (
                <div key={c} className="card deck">
                  <h2>{card}</h2>
                </div>
              )
            })
          }
        </div>

        <br/>
        <HostButton />

      </div>
    )
  }

  return (
    <div className="center">

      {
        gameData && gameData.isStarted && (
          <div className="game">
            
            <div className="cards">
              <div className="card-group">

                <div className={`card ${!faceupSelected && "selected"}`} onClick={() => selectCard(false)}></div>
                <div className={`card ${faceupSelected && "selected"}`} ref={faceupCard} onClick={() => selectCard(true)}>
                  <h2>{gameData.faceupCard}</h2>
                </div>

              </div>

              <div className="card-group">
                {
                  players[user.uid].deck.map((card, c) => {
                    return (
                      <div key={c} className={`card deck ${!canPlay && "disabled"}`} onClick={() => switchCard(c)}>
                        <h2>{card}</h2>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            
            <br/>
            <button className="btn" onClick={absoluteZero}>Absolute Zero</button>

          </div>
          )
      }

      {
        isHost && !gameData.isStarted && <button className="btn" onClick={startGame}>Start</button>
      }

      <h1 style={{fontSize: "3rem", margin: "10px"}}>Players:</h1>
      <div className="players">
        {
          gameData && Object.keys(players).map((playerKey, c) => {
            return (
              <Player username={players[playerKey].username} absoluteZeroPressed={players[playerKey].absoluteZeroPressed} score={gameData.scores[playerKey]} c={c} key={c} />
            )
          })
        }
      </div>
      
    </div>
  )
}

export default GameLobby
