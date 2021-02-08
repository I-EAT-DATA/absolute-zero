import React, { useEffect, useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'

import firebase from '../firebase'
import { useGlobalContext } from '../context'

const BuzzerControl = () => {
  const history = useHistory()
  let unlisten = () => {}

  const { user } = useGlobalContext()
  const [controlBuzzerCode, setControlBuzzerCode] = useState()
  const ref = firebase.firestore().collection("rooms")

  const [buzzerLocked, setBuzzerLocked] = useState(true)
  const [timestampUnlocked, setTimestampUnlocked] = useState(new Date().getTime())
  const [players, setPlayers] = useState([])

  const deleteRoom = () => {
    // console.log(controlBuzzerCode)
    ref.doc(controlBuzzerCode).delete().catch((err) => console.log(err))
  }

  const createRoom = () => {
    if (!controlBuzzerCode || !user) { return }
    ref.doc(controlBuzzerCode).set({ host: user.uid , buzzerLocked: true }).catch((err) => console.log(err))

    window.addEventListener("beforeunload", deleteRoom)
    unlisten = history.listen(() => {
      deleteRoom()
    })

    ref.doc(controlBuzzerCode).collection("players").doc("temp").set({})

    ref.doc(controlBuzzerCode).collection("players").onSnapshot((querySnapshot) => {
      const playerDocs = []

      querySnapshot.forEach((doc) => {
        if (!doc.data().username) { return; }
        playerDocs.push(doc.data())
      })

      // console.log(playerDocs);

      setPlayers(playerDocs)
    })
  }

  useEffect(() => {
    setControlBuzzerCode(Math.random().toString().substr(2, 6))

    // setTimestampUnlocked(new Date().getTime())
    // setPlayers([{ username: "test1", timestamp: new Date().getTime() + 1000, hasBuzzedIn: true }, { username: "test2", timestamp: new Date().getTime() + 100, hasBuzzedIn: true }])
  }, [])

  useEffect(() => {
    createRoom()

    return () => {
      window.removeEventListener("beforeunload", deleteRoom)
      unlisten()
    }
  }, [controlBuzzerCode, user])

  const toggleBuzzers = () => {
    setBuzzerLocked(!buzzerLocked)
    ref.doc(controlBuzzerCode).update({ buzzerLocked: !buzzerLocked })
    setTimestampUnlocked(new Date().getTime())

    // if toggleing lock, no player should be buzzed in
    if (players.length  && !buzzerLocked) {
      // console.log("Is gonna lock, and there are players");

      ref.doc(controlBuzzerCode).collection("players").get().then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
          ref.doc(controlBuzzerCode).collection("players").doc(doc.id).update({ hasBuzzedIn: false })
        })

      })
      
    }
  }

  return (
    <div className="buzzer-control">
      <h1 id="buzzer-code">Buzzer Code: {controlBuzzerCode}</h1>

      <button className="btn" onClick={toggleBuzzers}>{buzzerLocked ? "Unlock Buzzers" : "Lock Buzzers"}</button>

      <h1 style={{margin: "20px"}}>{players.length ? "Players:" : "Nobody yet"}</h1>
      <div className="players">
        {
          players.map((player) => {
            return (
              <div className="player" key={new Date().getTime() + Math.random()}>
                <h1 style={{color: `hsl(0, 0%, ${600 / ((player.timestamp - timestampUnlocked) / 100)}%)`}}>{player.username}</h1>
                <h2>{player.hasBuzzedIn ? `Buzzed in ${(player.timestamp - timestampUnlocked) / 1000}s after buzzer unlocked` : "Has not yet buzzed in."}</h2>
              </div>
            )
          })
        }
      </div>



    </div>
  )
}

export default BuzzerControl
