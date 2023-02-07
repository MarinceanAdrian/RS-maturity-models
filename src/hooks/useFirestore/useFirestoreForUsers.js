// https://firebase.google.com/docs/firestore/quickstart
// https://www.youtube.com/watch?v=BjtxPj6jRM8&t=153s
// upgrade guide: https://firebase.google.com/docs/web/modular-upgrade

import { doc, setDoc, getFirestore, getDoc } from "@firebase/firestore";

const firestore = getFirestore();

const useFirestoreSurveysForUsers = () => {
  const postUserDataToFirestore = async (userData) => {
    const { uid, token, email, fullName } = userData;
    const users = doc(firestore, `users/${uid}`);
    async function writeUsers() {
      const docData = {
        token,
        email,
        fullName,
        uid,
      };
      try {
        await setDoc(users, docData, { merge: true });
      } catch (err) {
        console.log(err);
      }
    }

    await writeUsers();
  };

  // get data from firestore collection
  const getFirebaseCollectionData = async (docId) => {
    const docRef = doc(firestore, "users", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('where??', docSnap.data())
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  return {
    postUserDataToFirestore,
    getFirebaseCollectionData,
  };
};

export default useFirestoreSurveysForUsers;
