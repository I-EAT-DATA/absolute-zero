import React, { useState, useEffect } from 'react'

import { useGlobalContext } from '../context'
import { useQuery } from '../hooks/useQuery'
import firebase from '../firebase'

import Game from './Game'
import Modal from '../components/Modal';

const JoinGame = () => {
  const query = useQuery();
  const { playerData, setPlayerData, gameCode, setGameCode, modalData, setModalData, inGame, setInGame, user } = useGlobalContext()
  
  const ref = firebase.firestore().collection('games')

  const tryJoinRoom = (e) => {
    e.preventDefault()

    if (!gameCode || !playerData.username) {
      closeModal()
      setModalData({ isModalOpen: true, modalContent: "Ur leaving fields feeling left out :`(" })
      return; 
    }

    ref.doc(gameCode).get()
      .then((doc) => {

        if (doc.exists) {
          ref.doc(gameCode).collection("players").doc(user.uid).set(playerData).catch((err) => console.log(err))

          setInGame(true)
				} 
				else {
          closeModal()
					setModalData({ isModalOpen: true, modalContent: "Room Not Found :O" })
        }
      })
      .catch((error) => {
				console.log("Error getting document:", error)
        closeModal()
        setModalData({ isModalOpen: true, modalContent: "Error Getting Room :`(" })   
		})
  }

  const tryPopulateCode = () => {
    const code = query.get("code")
    if (code && code.length <= 6) { 
      setGameCode(code)
    }
  }

  useEffect(() => {
    tryPopulateCode()
  }, [])

  const closeModal = () => {
    setModalData({ isModalOpen: false, modalContent: "" })
  }

  if (inGame) {
    return (
      <Game />
    )
  }

  return (
    <form className="join-game center" onSubmit={tryJoinRoom}>

      <input className="input" name="username" placeholder="Username" maxLength = "12" autoFocus value={playerData.username} onChange={(e) => setPlayerData({ ...playerData, username: e.target.value })} />
      <input className="input" name="gameCode" placeholder="Game Code" maxLength = "6" value={gameCode} onChange={(e) => setGameCode(e.target.value)} />

      <button className="btn" type="submit">Join Room</button>

      {modalData.isModalOpen && <Modal modalContent={modalData.modalContent} closeModal={closeModal} />}

    </form>
  )
}

export default JoinGame
