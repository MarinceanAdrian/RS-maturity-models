import React, { useState, useEffect, useContext } from 'react';
import useFirestoreForFolders from '../../hooks/useFirestore/useFirestoreForFolders';
import useIsLoading from '../../hooks/useIsLoading/useIsLoading';
import { SurveyContext } from '../survey-context/survey-context';

const initialState = [
  {
    folderId: 'toate_chestionarele',
    folderTitle: 'Toate chestionarele',
    isActive: true,
    surveys: [],
  },
];

export const FoldersContext = React.createContext(initialState);

const FoldersContextProvider = ({ children }) => {
  const [folders, setFolders] = useState(initialState);
  const [newFolderTitle, setNewFolderTitle] = useState(null);
  const [defaultOption, setDefaultOption] = useState(null);

  const { updateSurveysWithFolderData } = useContext(SurveyContext);

  const { isLoading, setIsLoading } = useIsLoading();
  const { updateUserDocumentWithFolderData, getFoldersForUser, updateFolderWithAssociatedSurvey } =
    useFirestoreForFolders();

  useEffect(() => {
    setIsLoading(true);
    const fetchFolders = async () => {
      const fetchedFolders = await getFoldersForUser();

      setIsLoading(false);
      return fetchedFolders;
    };

    fetchFolders().then((data) => {
      if (data) {
        setFolders(data);
      } else {
        return;
      }
    });

    return () => setFolders(initialState);
  }, []);

  const checkFolderExists = (title) => {
    return folders.map((f) => f.folderTitle).includes(title);
  };

  const addFolder = async (folderTitle, id) => {
    const newFolderStaticData = {
      folderId: id,
      folderTitle: folderTitle,
      isActive: false,
      surveys: [],
    };
    setFolders((prevFolders) => [...prevFolders, newFolderStaticData]);
    await updateUserDocumentWithFolderData(folders, newFolderStaticData);
  };

  /**
   * A function triggered when the user associated a folder for a given survey.
   * Two contexsts are affected upon selected a folder: the folder-context and the survey-context.
   * Both contexsts have to be actualized in order to be aware of the changes:
   * - the folders-context is updated with the current surveyId.
   * - the survey-context is updated with the associated folder data ({value: folderId, label: folder label})
   * @param {*} surveyId - the id of the survey found in localStoarge (the surveyId)
   * @param {*} selectedFolderData
   */
  const associateSurveyToExistingFolder = async (surveyId, selectedFolderData) => {
    const folderId = selectedFolderData.value;
    const currentFolder = [...folders].find((item) => item.folderId === folderId);
    let surveysIds = [];
    currentFolder.surveys.forEach((s) => {
      surveysIds.push(s);
    });
    // check if the survey exists in the current folder
    if (surveysIds.includes(surveyId)) {
      return;
    }
   
    const selectedFolderIndex = folders.findIndex(
      (f) => f.folderTitle === selectedFolderData.label
    );

    const exitingFolders = [...folders];

    const selectedFolder = exitingFolders[selectedFolderIndex];

    const updatedSelectedFolder = {
      ...selectedFolder,
      surveys: [...selectedFolder.surveys, surveyId],
    };

    exitingFolders[selectedFolderIndex] = updatedSelectedFolder;
    setFolders(exitingFolders);

    // Update Survey with selected folder data
    updateSurveysWithFolderData(selectedFolderData);

    await updateFolderWithAssociatedSurvey(exitingFolders);
  };

  const providedValues = {
    folders,
    setFolders,
    newFolderTitle,
    setNewFolderTitle,
    addFolder,
    isLoading,
    checkFolderExists,
    associateSurveyToExistingFolder,
    defaultOption,
    setDefaultOption,
  };
  return <FoldersContext.Provider value={providedValues}>{children}</FoldersContext.Provider>;
};

export default FoldersContextProvider;
