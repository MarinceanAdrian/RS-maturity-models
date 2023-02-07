
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  FacebookAuthProvider,
} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDo_5sjclW2PhVHaNxTLgQQUYG3UPapE0E",
  authDomain: "market-survey-dev-677a7.firebaseapp.com",
  projectId: "market-survey-dev-677a7",
  storageBucket: "market-survey-dev-677a7.appspot.com",
  messagingSenderId: "1052840111133",
  appId: "1:1052840111133:web:a5d61f4dd67079c32deaf4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const useFirebaseAuthentication = () => {
  // GOOGLE 
  const signInWithFirebase = async () => {
    try {
      const user = await signInWithPopup(auth, provider);
      return user.user;
    } catch (err) {
      console.log("firebase fetching error", err);
    }
  };

  const signOutFromFirebase = async () => {
    await signOut();
  };

  // FORGOT PASSWORD
  const forgotPasswordHandler = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      throw new Error(err.message || err);
    }
  };

  // FACEBOOK
  const signInWithFacebook = async () => {
    try {
      const user = await signInWithPopup(auth, facebookProvider);
      return user.user;
    } catch (err) {
      throw new Error(err.message || err);
    }
  };

  return {
    signInWithFirebase,
    signOutFromFirebase,
    forgotPasswordHandler,
    signInWithFacebook,
  };
};
export default useFirebaseAuthentication;
