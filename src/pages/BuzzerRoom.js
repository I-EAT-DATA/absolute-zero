import React, { useState, useEffect } from 'react'

import firebase from '../firebase'
import { useGlobalContext } from '../context'

const BuzzerRoom = () => {
  const ref = firebase.firestore().collection("rooms")
  const { buzzerCode, user } = useGlobalContext()

  const [buzzerLocked, setBuzzerLocked] = useState(false)

  const buzzIn = () => {
    if (buzzerLocked) { return; }
    setBuzzerLocked(true)
    ref.doc(buzzerCode).collection("players").doc(user.uid).update({ hasBuzzedIn: true, timestamp: new Date().getTime() }).catch((err) => console.log(err))
  }

  useEffect(() => {
    ref.doc(buzzerCode).onSnapshot((querySnapshot) => {
      console.log(querySnapshot.data());

      setBuzzerLocked(querySnapshot.data().buzzerLocked)
    })
  
  }, [])

  return (
    <div className="buzzer-room">
      <button className={`buzzer ${buzzerLocked && "disabled"}`} onClick={buzzIn} >Buzz In</button>
    </div>
  )
}

export default BuzzerRoom
