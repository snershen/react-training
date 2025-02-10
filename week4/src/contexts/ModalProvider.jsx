import { useRef, createContext, useContext } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const productModalRef = useRef(null);

  const showModal = () => {
    productModalRef.current.show();
  };

  const hideModal = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      <ModalContext.Provider value={{ productModalRef, showModal, hideModal }}>{children}</ModalContext.Provider>
    </>
  );
};

export const useModal = () => useContext(ModalContext);
