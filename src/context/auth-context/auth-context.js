import React, { createContext, useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../modal-context/modal-context";
import useFirebaseAuthentication from "../../hooks/useFirebase/useFirebaseAuthentication";
import useFirestoreForUsers from "../../hooks/useFirestore/useFirestoreForUsers";
import useIsLoading from "../../hooks/useIsLoading/useIsLoading";

export const AuthContext = createContext({
  isLoggedIn: false,
  fullName: "",
  token: null,
  loginWithGoogleHandler: () => {},
  loginWithEmailAndPassword: () => {},
});

const FIREBASE_API_KEY = "AIzaSyDo_5sjclW2PhVHaNxTLgQQUYG3UPapE0E";
const SIGN_UP_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
const SIGN_IN_ENDPOINT = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

// email reducer
const emailReducer = (state, action) => {
  switch (action.type) {
    case "USER_INPUT": {
      return {
        ...state,
        value: action.val,
        isValid: action.val.includes("@"),
      };
    }

    case "THIRD_PARTY_INPUT": {
      return {
        ...state,
        isValid: true,
        value: action.val,
      };
    }

    case "INPUT_BLUR": {
      return {
        ...state,
        isValid: state.value.includes("@"),
      };
    }

    case "CLEAR_INPUT": {
      return {
        ...state,
        isValid: undefined,
        value: "",
      };
    }
    default:
      return state;
  }
};

// Last Name reducer
const lastNameReducer = (state, action) => {
  const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/;

  switch (action.type) {
    case "USER_INPUT": {
      return {
        ...state,
        value: action.val,
        isValid: regex.test(action.val.trim()),
      };
    }

    case "INPUT_BLUR": {
      return {
        ...state,
        isValid: regex.test(action.val.trim()),
      };
    }

    case "CLEAR_INPUT": {
      return {
        ...state,
        isValid: undefined,
        value: "",
      };
    }
    default:
      return state;
  }
};

// First Name reducer
const firstNameReducer = (state, action) => {
  const regex = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{1,}$/;
  switch (action.type) {
    case "USER_INPUT": {
      return {
        ...state,
        value: action.val,
        isValid: regex.test(action.val.trim()),
      };
    }

    case "INPUT_BLUR": {
      return {
        ...state,
        isValid: regex.test(action.val.trim()),
      };
    }

    case "CLEAR_INPUT": {
      return {
        ...state,
        isValid: undefined,
        value: "",
      };
    }
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const { setIsModalVisible } = useContext(ModalContext);

  let initialToken;
  let storedFullName;
  let storedEmail;
  let storedFirstName;
  let storedLastName;
  if (localStorage.getItem("userData")) {
    const { token, fullName, firstName, lastName, email } = JSON.parse(
      localStorage.getItem("userData")
    );
    initialToken = token;
    storedFullName = fullName;
    storedEmail = email;
    storedFirstName = firstName;
    storedLastName = lastName;
  }
  const [token, setToken] = useState(initialToken || null);
  // fullName gets populated when logging in with google/facebook
  // we need to initialize it as a string and not null in this place
  const [fullName, setFullName] = useState(storedFullName || "");
  const [error, setError] = useState({
    hasError: false,
    errorText: null,
  });

  const [uid, setUID] = useState(null);

  // auth state with using reducers
  const [email, dispatchEmail] = useReducer(emailReducer, {
    value: storedEmail || "",
    isValid: undefined,
  });

  const [lastName, dispatchLastName] = useReducer(lastNameReducer, {
    value: storedLastName || "",
    isValid: undefined,
  });
  const [firstName, dispatchFirstName] = useReducer(firstNameReducer, {
    value: storedFirstName || "",
    isValid: undefined,
  });

  // custom firebase custom hooks
  const { forgotPasswordHandler, signInWithFacebook, signInWithFirebase } =
    useFirebaseAuthentication();
  const { postUserDataToFirestore, getFirebaseCollectionData } =
    useFirestoreForUsers();
  const { isLoading, setIsLoading } = useIsLoading();

  const userIsLoggedIn = !!token;

  const loginWithGoogleHandler = async () => {
    setIsLoading(true);
    try {
      const googleUserDetails = await signInWithFirebase();
      setFullName(googleUserDetails.displayName);
      setToken(googleUserDetails.accessToken);
      dispatchEmail({
        type: "THIRD_PARTY_INPUT",
        val: googleUserDetails.email,
      });
      const userData = {
        token: googleUserDetails.accessToken,
        fullName: googleUserDetails.displayName,
        email: googleUserDetails.email,
        uid: googleUserDetails.uid,
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      navigate("/", { replace: true });
      await postUserDataToFirestore(userData);
    } catch (err) {
      console.log("error state", err.message);
    }
    setIsLoading(false);
  };

  const loginWithEmailAndPassword = async ({
    isSigningIn,
    password,
    isSigningUp,
  }) => {
    setIsLoading(true);

    let ENDPOINT = "";
    // Sign in
    if (isSigningIn) {
      ENDPOINT = SIGN_IN_ENDPOINT;
    } else {
      // Sign Up
      ENDPOINT = SIGN_UP_ENDPOINT;
    }
    try {
      const res = await fetch(`${ENDPOINT}`, {
        method: "POST",
        body: JSON.stringify({
          email: email.value,
          password,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      // if there is an error, set error in state and display a modal
      if (data.error) {
        let errorTextMessage;

        // some error text toggeling based on the error firebase returns
        if (data.error.message === "EMAIL_EXISTS") {
          errorTextMessage =
            "Acest utilizator există deja. Vă rugăm autentificați-vă cu utilizatorul existent";
        } else if (data.error.message === "EMAIL_NOT_FOUND") {
          errorTextMessage =
            "Adresa de e-mail nu a fost găsită. Vă rugăm să vă creați un cont nou întâi.";
        } else if (data.error.message === "INVALID_PASSWORD") {
          errorTextMessage =
            "Parola introdusă este greșită. Vă rugăm verificați dacă aveați ați tasta Caps lock activă. În cazul în care ați uitat parola puteți să o recuperați din pagina Ați uitat parola?";
        } else {
          errorTextMessage = data.error.message;
        }
        setError((prevErrorState) => ({
          ...prevErrorState,
          hasError: true,
          errorText: errorTextMessage,
        }));
        setIsLoading(false);

        throw new Error(data.error);
      }

      const userData = {
        token: data.idToken,
        email: data.email,
        fullName: `${lastName.value} ${firstName.value}`,
        uid: data.localId,
      };

      // Save the user's data to firestore only at Sign Up
      if (isSigningUp) {
        // Save data to firestore
        await postUserDataToFirestore(userData);
        localStorage.setItem("userData", JSON.stringify(userData));
        setFullName(userData.fullName);
      } else {
        // save to LS
        // Get the fullname from the existing doc
        const response = await getFirebaseCollectionData(data.localId);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...userData,
            fullName: response.fullName,
          })
        );
        setFullName(response.fullName);
      }

      // set state
      setToken(data.idToken);
      setUID(data.localId);
      // setFullName(`${lastName.value} ${firstName.value}`);
      dispatchEmail({ type: "THIRD_PARTY_INPUT", val: data.email });
      setError((prevErrorState) => ({ errorText: "", hasError: false }));
      navigate("/", { replace: true });
    } catch (err) {
      console.log("error state", error);
    }
    setIsLoading(false);
  };

  const loginWithFacebookHandler = async () => {
    try {
      const facebookUserDetails = await signInWithFacebook();
      console.log("facebookUserDetails", facebookUserDetails);
      setFullName(facebookUserDetails.displayName);
      setToken(facebookUserDetails.accessToken);
      dispatchEmail({
        type: "THIRD_PARTY_INPUT",
        val: facebookUserDetails.email,
      });
      const userData = {
        token: facebookUserDetails.accessToken,
        fullName: facebookUserDetails.displayName,
        email: facebookUserDetails.email,
        uid: facebookUserDetails.uid,
      };

      // Save user data
      const facebookUserFirestoreData = await postUserDataToFirestore(userData);
      console.log("facebookUserFirestoreData", facebookUserFirestoreData);

      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/", { replace: true });
    } catch (err) {
      console.log("facebook err", err);
    }
  };

  const signOut = () => {
    localStorage.removeItem("userData");
    setToken("");
    setFullName("");
    // fixed sign out
    navigate("/login", { replace: true });
  };

  const recoverPasswordHandler = async (email) => {
    setIsLoading(true);
    setError(false);
    try {
      await forgotPasswordHandler(email);
      setIsModalVisible(true);
    } catch (err) {
      setError((prevErrorState) => ({
        ...prevErrorState,
        hasError: true,
        errorText: err.message.includes("auth")
          ? "Acest email nu a putut fi găsit în sistem. Doar utilizatorii care s-au înregistrat în prealabil pot să își recupereze parola. Vă rugăm încercați să vă înregistrați întâi."
          : err.message,
      }));
    }
    setIsLoading(false);
  };

  const value = {
    fullName,
    token,
    error,
    isLoading,
    loginWithGoogleHandler,
    loginWithEmailAndPassword,
    userIsLoggedIn,
    signOut,
    recoverPasswordHandler,
    loginWithFacebookHandler,
    firstName,
    lastName,
    dispatchLastName,
    dispatchFirstName,
    email,
    dispatchEmail,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
