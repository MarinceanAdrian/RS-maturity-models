import { useState } from "react";
const useIsLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  return {
    isLoading,
    setIsLoading,
  };
};

export default useIsLoading;
