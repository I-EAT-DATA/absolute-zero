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

  const deletePlayer = () => {
    ref.doc(gameCode).collection("players").doc(user.uid).delete().catch((err) => console.log(err))
  }

  useEffect(() => {

    ref.doc(gameCode).onSnapshot((querySnapshot) => {
      try {
        console.log(querySnapshot.data())
      } catch (error) {
        console.log(error)

        setInGame(false)
        setModalData({ isModalOpen: true, modalContent: "Game Has Vanished ＞﹏＜" })
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

  return (
    <div className="center">
      {/* <button className={`buzzer ${buzzerLocked && "disabled"}`} onClick={buzzIn} >Buzz In</button> */}

      
    </div>
  )
}

export default GameRoom
