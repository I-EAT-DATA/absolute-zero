import React from 'react'

import { useGlobalContext } from '../context'
import firebase from '../firebase'

const JoinGame = () => {
  const { buzzerCode, setBuzzerCode } = useGlobalContext()

  const ref = firebase.firestore().collection('rooms')

  const tryJoinRoom = (e) => {
    e.preventDefault()

    if (!buzzerCode) { return; }

    ref.doc(buzzerCode).get()
      .then((doc) => {

        if (doc.exists) {          
          const playerData = { canPlay: false, isHost: false, deck: [0, 0, 0, 0] }
          setGameData({ ...gameData, playerData})
          ref.doc(gameData.roomCode).collection("players").doc(firebase.auth().currentUser.uid).set(playerData).catch((err) => console.log(err))

          ref.doc(gameData.roomCode).update({ players: doc.data().players + 1 })
				} 
				else {
					// notification popup thing goes here
          return;
        }

      })
      .catch((error) => {

				console.log("Error getting document:", error)
				// notification popup thing goes here
        return;
        
		})
  }

  return (
    <div>
      
    </div>
  )
}

export default JoinGame
