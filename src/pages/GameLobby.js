import React, { useState, useEffect, useRef } from 'react'
// import { useHistory } from 'react-router-dom'
// import useSound from 'use-sound';
// import { useDrag, useDrop } from 'react-dnd';

import firebase from '../firebase'
import { useGlobalContext } from '../context'

import Player from '../components/Player'

// import { ItemTypes } from '../util/items'

const GameLobby = () => {
  // const history = useHistory()
  // const [unlisten, setUnlisten] = useState(() => {})

  const ref = firebase.firestore().collection("games")
  const { gameCode, setModalData, setInGame, playerData, setPlayerData, user } = useGlobalContext()

  const [gameData, setGameData] = useState()
  const [changes, setChanges] = useState({})
  const [players, setPlayers] = useState({})

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

  const getPlayerData = () => {
    ref.doc(gameCode).collection("players").onSnapshot((querySnapshot) => {
      let playerDocs = {}
      let changesObj = {}

      querySnapshot.forEach((doc) => { 
        playerDocs = { ...playerDocs, [doc.id]: doc.data() }
      })

      // querySnapshot.docChanges().forEach((changes) => {
      //   playersChangesDocs = { ...playersChangesDocs, [changes.doc.id]: changes.doc.data() }
      // })

      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "modified") {
          console.log("Modified thing: ", change.doc.data());
        }
      })

      setChanges({})
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
    checkCanPlay()
  }, [gameData])

  useEffect(() => {
    if (!playerData) { return; }
    ref.doc(gameCode).collection("players").doc(user.uid).update(playerData)
  }, [playerData])

  useEffect(() => {
    if (!isHost) { return; }

    console.log(changes)

    let newScores = {}

    Object.keys(players).forEach((playerKey) => { 
      newScores = { ...newScores, [playerKey]: players[playerKey].deck.reduce((a, b) => a + b, 0) } 
    })

    ref.doc(gameCode).update({ numPlayers: Object.keys(players).length, scores: newScores })
    
  }, [players])

  const startGame = () => {
    ref.doc(gameCode).update({ isStarted: true })
  }

  const selectCard = (isFaceupCard) => {
    setFaceupSelected(isFaceupCard)
  }

  const switchCard = (c) => {
    if (!canPlay) { return; }
    // console.log(e.target);
    // console.log(faceupCard.current.firstChild.innerHTML);

    let newDeck = playerData.deck.map((card) => card)
    newDeck[c] = faceupSelected ? parseInt(faceupCard.current.firstChild.innerHTML) : Math.floor(Math.random() * 20) - 10
    setPlayerData({ ...playerData, deck: newDeck })

    // setCanPlay(false)
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
                  playerData.deck.map((card, c) => {
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
          Object.values(players).reverse().map((player, c) => {
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
