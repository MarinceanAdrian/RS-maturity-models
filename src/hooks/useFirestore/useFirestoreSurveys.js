// docs
// https://firebase.google.com/docs/firestore/quickstart
// https://www.youtube.com/watch?v=BjtxPj6jRM8&t=153s
// upgrade guide: https://firebase.google.com/docs/web/modular-upgrade
import { useState } from 'react';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getFirestore,
  getDocs,
  getDoc,
  deleteDoc,
  deleteField,
  updateDoc,
} from '@firebase/firestore';
import { getAllSurveysForUser, getSurveyForUser, updateSurvey } from './helpers/firestore-helpers';

const firestore = getFirestore();

const useFirestoreSurveys = () => {
  let uid = '';
  if (localStorage.getItem('userData')) {
    uid = JSON.parse(localStorage.getItem('userData')).uid;
  }

  const [userId, setUserId] = useState(uid);
  const [firebaseError, setFirebaseError] = useState(null);

  const getSurveyTitle = async (surveyId) => {
    const docRef = doc(firestore, `users/${userId}/survey/${surveyId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().surveyData.title;
    }
  };

  const saveResponsesToFirestore = async (responseData, surveyId, userId) => {
    try {
      const surveyDoc = await addDoc(
        collection(firestore, `users/${userId}/survey/${surveyId}/responses`),
        {
          responseData: responseData || [],
        }
      );
      return surveyDoc.id;
    } catch (err) {
      setFirebaseError(err.message || 'Something went wrong...');
      return '';
    }
  };

  const getResponsesForSurvey = async (surveyId) => {
    const querySnapshot = await getDocs(
      collection(firestore, `users/${userId}/survey/${surveyId}/responses`)
    );
    const responses = [];
    querySnapshot.forEach((doc) => responses.push(doc.data().responseData));
    return responses;
  };

  const createSurveyToFirestore = async ({ JSONData }) => {
    try {
      const surveyDoc = await addDoc(collection(firestore, `users/${userId}/survey`), {
        surveyData: JSONData || [],
      });
      return surveyDoc.id;
    } catch (err) {
      setFirebaseError(err.message || 'Something went wrong...');
      return '';
    }
  };

  /**
   * Updates an existing document in the survey subcollection. Receives an object as param with the following properties:
   * @param {} JSONData the survey data provided as JSON format that will replace the existing
   * existing JSON data in firebase
   * @param {} surveyId the id of that particular survey document that needs to be loaded in the page when the page first mounts
   */
  const updateSurveyDataInFirestore = async ({ JSONData, surveyId }) => {
    // get all documents in the survey subcollection
    let currentSurveyId = '';

    const querySnapshot = await getDocs(collection(firestore, `users/${userId}/survey`));

    if (surveyId) {
      querySnapshot.forEach((doc) => {
        if (doc.id === surveyId) {
          // update the current survey id
          currentSurveyId = doc.id;
        }
      });
    }

    if (!currentSurveyId) {
      currentSurveyId = JSON.parse(localStorage.getItem('templateId'));
    }

    // get the current doc path
    const surveyDocIdRef = doc(firestore, `users/${userId}/survey/${currentSurveyId}`);

    try {
      // update existing survey doc with the json
      await setDoc(
        surveyDocIdRef,
        {
          surveyData: JSONData,
        },
        {
          merge: true,
        }
      );
    } catch (err) {
      console.log('err', err);
    }
  };

  /**
   * Fetches survey(s) for a given user. Providing a survey id exists, the function will return only a that survey
   * document that matches with the surveyId. Otherwise, all survey documents will be fetched
   * @setJson (optional) a callback function that loads the survey in JSON format when the page mounts
   * @surveyId (optional) the id of the survey document we want to fetch
   */
  const getSurveys = async (setJson, surveyId, userIdDisplay) => {
    // if we don't have an id, it means we need to fetch all surveys for the user
    if (!surveyId) {
      const surveys = await getAllSurveysForUser(userId);
      return surveys;
    }

    // if there is an id, it means we have to fetch a specific survey
    await getSurveyForUser(setJson, userIdDisplay || userId, surveyId);
  };

  /**
   *
   */
  const getSurveyFolder = async (surveyId) => {
    const docRef = doc(firestore, `users/${userId}/survey/${surveyId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.data().folder) {
      return docSnap.data().folder;
    } else return;
  };

  /**
   * Deletes the folder from the survey level if the pertaining folder is deleted
   * @folderId - the id of the folder that is to be deleted
   *
   */
  const deleteFolderObjectFromSurvey = async (folderId) => {
    const querySnapshot = await getDocs(collection(firestore, `users/${userId}/survey`));
    for (const document of querySnapshot.docs) {
      if (document.data().folder?.value === folderId) {
        const docRef = doc(firestore, `users/${userId}/survey/${document.id}`);
        await updateDoc(docRef, {
          folder: deleteField(),
        });
      }
    }
  };

  /**
   * Craetes template surveys. Can only be used by an admin user
   * @param {templateSurveyJSONData} templateSurveyJSONData - the JSON containing the survey data
   */
  const createTemplateSurveys = async (templateSurveyJSONData) => {
    const templateSurveys = doc(firestore, `template-survey/alegeri-electorale`);
    async function writeTemplateSurvey() {
      try {
        await setDoc(
          templateSurveys,
          { label: 'test', surveyData: templateSurveyJSONData },
          { merge: true }
        );
      } catch (err) {
        console.log(err);
      }
    }

    await writeTemplateSurvey();
  };

  const getTemplateSurveys = async () => {
    const querySnapshot = await getDocs(collection(firestore, `template-survey`));
    return querySnapshot;
  };

  /**
   *
   * Get information about weather the survey is public or not
   */
  const getIsPublicStateForSurvey = async (userId, surveyId) => {
    const docRef = doc(firestore, `users/${userId}/survey/${surveyId}`);
    const docSnap = await getDoc(docRef);
    return docSnap.data().surveyData.isPublic;
  };

  /**
   * Delete a survey from firebase firestore - survey subcollection
   * @param {*} surveyId
   * @returns
   */
  const deleteSurvey = async (surveyId) => {
    const docRef = doc(firestore, `users/${userId}/survey/${surveyId}`);
    try {
      await deleteDoc(docRef);
    } catch (err) {
      console.log('deleting err', err);
    }
  };

  /**
   *
   * @param {*} folderData
   */
  const updateSurveyFolderData = async (currentSurveyId, folderData) => {
    // get the current doc path
    const surveyDocIdRef = doc(firestore, `users/${userId}/survey/${currentSurveyId}`);
    try {
      // update existing survey doc with the json
      await setDoc(
        surveyDocIdRef,
        {
          folder: folderData,
        },
        {
          merge: true,
        }
      );
    } catch (err) {
      console.log('err', err);
    }
  };

  /**
   * A function that sets the survey's first date of availability
   *
   */
  const updateSurveyWithAvailabilityStartDate = async (currentSurveyId, label, startDate) => {
    await updateSurvey(userId, currentSurveyId, label, startDate);
  };

  /**
   * A function that sets the survey's last date of availability
   *
   */
  const updateSurveyWithAvailabilityEndDate = async (currentSurveyId, label, endDate) => {
    await updateSurvey(userId, currentSurveyId, label, endDate);
  };

  /**
   * A function that returns the current survey's availability interval
   * @returns - an object containing the startDate and endDate of suvrvey's availability
   */
  const getSurveyAvailability = async (userId, surveyId) => {
    const docRef = doc(firestore, `users/${userId}/survey/${surveyId}`);
    const docSnap = await getDoc(docRef);
    const availabilityData = {
      startDate: docSnap.data().startDate,
      endDate: docSnap.data().endDate,
    };
    return availabilityData;
  };

  const addResponseToSurvey = async (userId, surveyId, responseData) => {
    // reach to that specific survey and create a new collection in it
    try {
      const surveyDoc = await addDoc(
        collection(firestore, `users/${userId}/survey/${surveyId}/responses`),
        {
          responses: responseData,
        }
      );
      return surveyDoc.id;
    } catch (err) {
      setFirebaseError(err.message || 'Something went wrong...');
      return '';
    }
  };

  return {
    createSurveyToFirestore,
    getSurveys,
    createTemplateSurveys,
    getTemplateSurveys,
    updateSurveyDataInFirestore,
    saveResponsesToFirestore,
    getResponsesForSurvey,
    getIsPublicStateForSurvey,
    addResponseToSurvey,
    getSurveyTitle,
    deleteSurvey,
    updateSurveyFolderData,
    getSurveyFolder,
    deleteFolderObjectFromSurvey,
    updateSurveyWithAvailabilityStartDate,
    updateSurveyWithAvailabilityEndDate,
    getSurveyAvailability,
  };
};

export default useFirestoreSurveys;
