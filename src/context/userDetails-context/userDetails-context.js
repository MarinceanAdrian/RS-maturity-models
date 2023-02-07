import React, { createContext, useState } from "react";

export const UserDetailsContext = createContext({
  setUserPopupIsOpen: () => {},
});

const UserDetailsContextProvider = ({ children }) => {
  const [userPopupIsOpen, setUserPopupIsOpen] = useState(false);

  return (
    <UserDetailsContext.Provider
      value={{
        setUserPopupIsOpen,
        userPopupIsOpen,
      }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};

export default UserDetailsContextProvider;
