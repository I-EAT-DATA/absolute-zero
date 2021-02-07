import React, { useState, useContext, useEffect } from 'react'

import firebase from './firebase'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [playerData, setPlayerData] = useState({ username: "", hasBuzzedIn: false, timestamp: firebase.firestore.FieldValue.serverTimestamp() })
  const [buzzerCode, setBuzzerCode] = useState("")
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
  }, [])


  return <AppContext.Provider value={ {playerData, setPlayerData, buzzerCode, setBuzzerCode, user, setUser} }>{children}</AppContext.Provider>
}

export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
