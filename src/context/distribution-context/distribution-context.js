
import React, {useState} from "react";

export const DistributionContext = React.createContext({
  isPublic: false,
  toggleIsPublicHandler: () => {},
});

const DistributionContextProvider = ({ children }) => {
  const [isPublic, setIsPublic] = useState(false);

  const toggleIsPublicHandler = (value) => {
    if (typeof value === 'boolean') {
      setIsPublic(value);
      return;
    }
    setIsPublic((prevState) => !prevState);
  };

  const value = {
    toggleIsPublicHandler,
    isPublic,
    setIsPublic
  };
  return (
    <DistributionContext.Provider value={value}>
      {children}
    </DistributionContext.Provider>
  );
};

export default DistributionContextProvider;
