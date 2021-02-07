
export const reducer = (state, action) => {
  console.log(state, action);

  if (action.type === "TOGGLE_MODAL") {
    // copy previous values from state and return only the ones you want
    return { ...state, isModalOpen: !state.isModalOpen, modalContent: action.payload }
  }

  throw new Error ("No matching action type") 
}