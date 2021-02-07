import React from 'react'

import firebase from '../firebase'

const BuzzerRoom = () => {
  const ref = firebase.firestore().collection("rooms")

  return (
    <div>
      
    </div>
  )
}

export default BuzzerRoom
