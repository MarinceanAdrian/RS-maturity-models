import React, { useState } from 'react';

export const ModalContext = React.createContext({
    isModalVisible: false,
    setIsModalVisible: () => {},
    modalText: null
})

const ModalContextProvider = ({children}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalText, setModalText] = useState(null);

    const contextValue = {
        isModalVisible,
        setIsModalVisible,
        modalText,       
    }

    return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
}

export default ModalContextProvider;