import React, { useEffect } from 'react';

const Modal = ({modalContent, closeModal}) => {

  useEffect(() => {
    setTimeout(() => {
      closeModal()
    }, 3000);
  })

  return <h1 className="modal">{modalContent}</h1>;
};

export default Modal;