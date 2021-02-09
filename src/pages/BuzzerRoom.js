import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import useSound from 'use-sound';

import firebase from '../firebase'
import { useGlobalContext } from '../context'

import buzz from '../assets/buzzer.wav'

const BuzzerRoom = () => {
  const history = useHistory()
  let unlisten = () => {}

  const ref = firebase.firestore().collection("rooms")
  const { buzzerCode, setModalData, setInRoom, user } = useGlobalContext()

  const [buzzerLocked, setBuzzerLocked] = useState(false)

  const [playBuzz] = useSound(buzz)

  const deletePlayer = () => {
    ref.doc(buzzerCode).collection("players").doc(user.uid).delete().catch((err) => console.log(err))
  }

  useEffect(() => {

    ref.doc(buzzerCode).onSnapshot((querySnapshot) => {
      try {
        // console.log(querySnapshot.data());

        setBuzzerLocked(querySnapshot.data().buzzerLocked)
      } catch (error) {
        console.log(error);
        setInRoom(false)
        setModalData({ isModalOpen: true, modalContent: "Room Has Vanished ＞﹏＜" })
      }
    })

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

  const buzzIn = () => {
    if (buzzerLocked) { return; }
    setBuzzerLocked(true)
    ref.doc(buzzerCode).collection("players").doc(user.uid).update({ hasBuzzedIn: true, timestamp: new Date().getTime() }).catch((err) => console.log(err))
    playBuzz()
  }

  return (
    <div className="buzzer-room">
      <button className={`buzzer ${buzzerLocked && "disabled"}`} onClick={buzzIn} >Buzz In</button>
    </div>
  )
}

export default BuzzerRoom
