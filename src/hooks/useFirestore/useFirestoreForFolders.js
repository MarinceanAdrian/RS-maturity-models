import { useCallback } from 'react';
import { doc, updateDoc, getFirestore, getDoc, setDoc } from '@firebase/firestore';
import useFetchFromLocalStorage from '../useLocalStorage/useFetchFromLocalStorage';

const firestore = getFirestore();

const useFirestoreSurveysForFolders = () => {
  const userId = useFetchFromLocalStorage();

  const updateUserDocumentWithFolderData = async (folders, folderData) => {
    const surveyDocIdRef = doc(firestore, 'users', userId);
  
    try {
      await setDoc(
        surveyDocIdRef,
        {
          foldersData: [...folders, { ...folderData }],
        },
        {
          merge: true,
        }
      );
    } catch (err) {
      console.log('err', err);
    }
  };

  const getFoldersForUser = useCallback(async () => {
    const docRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().foldersData;
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }, [userId]);

  const deleteFolderObjectFromFirestore = async (id) => {
    // get the current doc path
    const surveyDocIdRef = doc(firestore, `users/${userId}`);

    // 1. get the existing array
    const existingFolders = await getFoldersForUser();

    try {
      // update existing survey doc with the json
      await updateDoc(
        surveyDocIdRef,
        {
          foldersData: [...existingFolders.filter((folder) => folder.folderId !== id)],
        },
        {
          merge: true,
        }
      );
      return true;
    } catch (err) {
      console.log('err', err);
    }
  };

  const updateFolderWithAssociatedSurvey = async (updatedFolders) => {
    
    const surveyDocIdRef = doc(firestore, `users/${userId}`);
    try {
      await updateDoc(
        surveyDocIdRef,
        {
          foldersData: updatedFolders,
        },
        {
          merge: true,
        }
      );
    } catch (err) {
      console.log('err', err);
    }
  };

  return {
    updateUserDocumentWithFolderData,
    getFoldersForUser,
    deleteFolderObjectFromFirestore,
    updateFolderWithAssociatedSurvey,
  };
};

export default useFirestoreSurveysForFolders;
