import { useCallback, useState } from 'react';
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
import useFetchFromLocalStorage from '../useLocalStorage/useFetchFromLocalStorage';

const firestore = getFirestore();

const useFirestoreForTemplates = () => {
  const getTemplatesCategory = async () => {
    const docRef = doc(firestore, `global-config/template-category`);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
  };

  const getTemplateSurveys = async () => {
    const querySnapshot = await getDocs(collection(firestore, `template-survey`));
    const templates = querySnapshot.docs.map((doc) => doc.data());

    return templates;
  };

  return {
    getTemplatesCategory,
    getTemplateSurveys,
  };
};

export default useFirestoreForTemplates;
