import React, { useState, useEffect } from 'react'

import { useGlobalContext } from '../context'
import { useQuery } from '../hooks/useQuery'
import firebase from '../firebase'

import BuzzerRoom from './BuzzerRoom'
import Modal from '../components/Modal';

const JoinGame = () => {
  const query = useQuery();
  const { playerData, setPlayerData, buzzerCode, setBuzzerCode, modalData, setModalData, inRoom, setInRoom, user } = useGlobalContext()
  
  const ref = firebase.firestore().collection('rooms')

  const tryJoinRoom = (e) => {
    e.preventDefault()

    if (!buzzerCode || !playerData.username) {
      setModalData({ isModalOpen: true, modalContent: "Ur leaving fields feeling left out :`(" })
      return; 
    }

    ref.doc(buzzerCode).get()
      .then((doc) => {

        if (doc.exists) {
          ref.doc(buzzerCode).collection("players").doc(user.uid).set(playerData).catch((err) => console.log(err))

          setInRoom(true)
				} 
				else {
					setModalData({ isModalOpen: true, modalContent: "Room Not Found :O" })
        }
      })
      .catch((error) => {
				console.log("Error getting document:", error)
        setModalData({ isModalOpen: true, modalContent: "Error Getting Room :`(" })   
		})
  }

  const tryPopulateCode = () => {
    const code = query.get("code")
    if (code && code.length <= 6) { 
      setBuzzerCode(code)
    }
  }

  useEffect(() => {
    tryPopulateCode()
  }, [])

  if (inRoom) {
    return (
      <BuzzerRoom />
    )
  }

  return (
    <form className="join-form" onSubmit={tryJoinRoom}>

      <input className="input" name="username" placeholder="Username" maxLength = "12" autoFocus value={playerData.username} onChange={(e) => setPlayerData({ ...playerData, username: e.target.value })} />
      <input className="input" name="buzzerCode" placeholder="Buzzer Code" maxLength = "6" value={buzzerCode} onChange={(e) => setBuzzerCode(e.target.value)} />

      <button className="btn" type="submit">Join Room</button>

      {modalData.isModalOpen && <Modal modalContent={modalData.modalContent} closeModal={() => { setModalData({ isModalOpen: false, modalContent: "" }) }} />}

    </form>
  )
}

export default JoinGame
