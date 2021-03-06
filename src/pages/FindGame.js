import React, { useState, useEffect } from 'react'

import OpenGame from '../components/OpenGame'

import firebase from '../firebase'

const FindGame = () => {
  const ref = firebase.firestore().collection("games")

  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    ref.limit(50).onSnapshot((querySnapshot) => {
      const gameDocs = []

      querySnapshot.forEach((doc) => {
        if (doc.data().isPrivate || doc.data().numPlayers >= 4 || doc.data().isStarted) { return; }

        // gameDocs.push({...doc.data(), numPlayers: ref.doc(doc.id).collection("players").get().then(snap => snap.size)})
        gameDocs.push({ gameCode: doc.id, numPlayers: doc.data().numPlayers })
      })

      setGames(gameDocs)
      setIsLoading(false)
    })

  }, [])

  // useEffect(() => {
  //   setGames([{ gameCode: 123456, numPlayers: 3 }, { gameCode: 432423, numPlayers: 2 }, { gameCode: 11222, numPlayers: 1 }])
  //   setIsLoading(false)
  // }, [])

  return (
    <div className="center">
      <h1 style={{fontSize: "3rem", margin: "50px"}}>Find Open Game</h1>

      {isLoading && <h1>Loading...</h1>}
      {
        games.map((game, c) => {
          return (
            <OpenGame key={c} {...game} />
          )
        })
      }
      
    </div>
  )
}

export default FindGame
