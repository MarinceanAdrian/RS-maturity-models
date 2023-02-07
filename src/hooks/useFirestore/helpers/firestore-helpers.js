// Note: sometimes when we import functions with ctrl + Space it will import
// either from firebase/lite or from @firebase/firestore. We need to be carefull
// to import all functions from within a file from the same path otherwise they will collide.

import {
  collection,
  doc,
  getFirestore,
  getDoc,
  getDocs,
  setDoc
} from "firebase/firestore/lite";

// Initialize Cloud Firestore and get a reference to the service
const firestore = getFirestore();

/***
 * Gets a specific document from the survey subcollection for a specific user
 * @param {} setJson callback function that loads the existing survey in JSON format from the firebase document
 * @param {} userId id of the specific user for which the survey document is fetched
 * @param {} surveyId the id of that particular survey document that needs to be loaded in the page when the page first mounts
 */
export const getSurveyForUser = async (setJson, userId, surveyId) => {
  const docRef = doc(firestore, `users/${userId}/survey/${surveyId}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    setJson(docSnap.data().surveyData);
  } else {
    const docRef = doc(firestore, `template-survey/${surveyId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setJson(docSnap.data().surveyData);
    }
  }
};


/***
 * Gets all the documents from the survey subcollection for a specific user
 * @param {} userId the id of the user for which we fetch the documents from the survey subcollection
 * @returns an array of documents
 */
export const getAllSurveysForUser = async (userId) => {
  const querySnapshot = await getDocs(
    collection(firestore, `users/${userId}/survey`)
  );
  return querySnapshot;
};


/**
 * A piece of functionality that identifies the current survey and updates it with incoming data
 * @param {*} userId 
 * @param {*} currentSurveyId 
 * @param {*} newSurveyField 
 * @param {*} newSurveyFieldValue 
 */
export const updateSurvey = async (userId, currentSurveyId, label, newSurveyFieldValue) => {
  console.log({userId, currentSurveyId, label, newSurveyFieldValue})
  const surveyDocIdRef = doc(firestore, `users/${userId}/survey/${currentSurveyId}`);

  try {
    await setDoc(
      surveyDocIdRef,
      {
        [label]: newSurveyFieldValue,
      },
      {
        merge: true,
      }
    );
  } catch (err) {
    console.log('err', err);
  }
}
