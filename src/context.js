import React, { useState, useContext } from 'react'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [buzzerCode, setBuzzerCode] = useState("")
  const [buzzerData, setBuzzerData] = useState()

  return <AppContext.Provider value={ {buzzerCode, setBuzzerCode, buzzerData, setBuzzerData} }>{children}</AppContext.Provider>
}

export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
