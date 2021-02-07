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
  const [players, setPlayers] = useState([])

  const deleteRoom = () => {
    console.log(controlBuzzerCode)
    ref.doc(controlBuzzerCode).delete().catch((err) => console.log(err))
  }

  const createRoom = () => {
    if (!controlBuzzerCode || !user) { return }
    ref.doc(controlBuzzerCode).set({ host: user.uid , buzzerLocked: true }).catch((err) => console.log(err))

    window.addEventListener("beforeunload", deleteRoom)

    unlisten = history.listen((route) => {
      console.log(route)
      deleteRoom()
    })

    ref.doc(controlBuzzerCode).collection("players").doc("temp").set({})

    ref.doc(controlBuzzerCode).collection("players").onSnapshot((querySnapshot) => {
      const playerDocs = []

      querySnapshot.forEach((doc) => {
        playerDocs.push(doc.data())
      })

      console.log(playerDocs);

      setPlayers(playerDocs)
    })
  }

  useEffect(() => {
    setControlBuzzerCode(Math.random().toString().substr(2, 6))

    // setPlayers([{ username: "kamala", timestamp: new Date().toLocaleTimeString(), hasBuzzedIn: true }, { username: "joe", timestamp: new Date().toLocaleTimeString(), hasBuzzedIn: true }])
  }, [])

  useEffect(() => {
    createRoom()

    return () => {
      window.removeEventListener("beforeunload", deleteRoom)
      unlisten()
    }
  }, [controlBuzzerCode, user])

  const unlockBuzzers = () => {
    setBuzzerLocked(!buzzerLocked)
    ref.doc(controlBuzzerCode).update({ buzzerLocked: !buzzerLocked })
  }

  return (
    <div className="buzzer-control">
      <h1 id="buzzer-code">Buzzer Code: {controlBuzzerCode}</h1>

      <button className="btn" onClick={unlockBuzzers}>{buzzerLocked ? "Unlock Buzzers" : "Lock Buzzers"}</button>

      <h1 style={{margin: "20px"}}>{players.length ? "Players:" : "Nobody yet"}</h1>
      <div className="players">
        {
          players.map((player) => {
            return (
              <div className="player" key={new Date().getTime() + Math.random()}>
                <h1>{player.username}</h1>
                <h2>{player.hasBuzzedIn ? `Buzzed in at ${player.timestamp}` : "Has not yet buzzed in."}</h2>
              </div>
            )
          })
        }
      </div>



    </div>
  )
}

export default BuzzerControl
