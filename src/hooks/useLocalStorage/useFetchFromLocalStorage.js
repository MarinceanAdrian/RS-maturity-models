const useFetchFromLocalStorage = () => {
  // add this extra check because on the shared page, the 
  // user won't have a userData obj in LS
  if (localStorage.getItem("userData")) {
    const { uid } = JSON.parse(localStorage.getItem("userData"));

    return uid;
  }
};

export default useFetchFromLocalStorage;
