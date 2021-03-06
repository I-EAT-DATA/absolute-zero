import React, { useState, useContext, useEffect } from 'react'

import firebase from './firebase'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  // firebase.firestore.FieldValue.serverTimestamp()
  const [playerData, setPlayerData] = useState({ username: "", absoluteZeroPressed: false, deck: [], changedCard: Math.floor(Math.random() * 20) - 10})
  const [gameCode, setGameCode] = useState("")
  const [modalData, setModalData] = useState({ isModalOpen: false, modalContent: "" })
  const [inGame, setInGame] = useState(false)
  const [user, setUser] = useState()

  const initUser = () => {

    firebase.auth().signInAnonymously()
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
    })

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user.uid);
        setUser(user)
      } else {
        // history.push("/")
      }
    })

  }

  useEffect(() => {
    initUser()

    for (let i = 0; i < 4; i++) {
      playerData.deck.push(Math.floor(Math.random() * 20) - 10)
    }
  }, [])

  return <AppContext.Provider value={ { playerData, setPlayerData, gameCode, setGameCode, modalData, setModalData, inGame, setInGame, user } }>{children}</AppContext.Provider>
}

export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
