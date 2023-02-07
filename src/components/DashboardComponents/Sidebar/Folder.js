import React, { useRef, useEffect, useContext, useState } from 'react';
import { FaFolder, FaTrash } from 'react-icons/fa';
import { FoldersContext } from '../../../context/folders-context/folders-context';
import useFirestoreSurveysForFolders from '../../../hooks/useFirestore/useFirestoreForFolders';
import { ModalContext } from '../../../context/modal-context/modal-context';
import Spinner from '../../UI/Spinner';
import useIsLoading from '../../../hooks/useIsLoading/useIsLoading';
import classes from './Folder.module.css';
import uuid from 'react-uuid';
import { SurveyContext } from '../../../context/survey-context/survey-context';
import useFirestoreSurveys from '../../../hooks/useFirestore/useFirestoreSurveys';

const WrapperCard = React.lazy(() => import('../../UI/WrapperCard'));
const Folder = ({
  isActive,
  folderTitle,
  folderId,
  newFolderInput = false,
  isCreatingNewFolder,
  setIsCreatingNewFolder,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [folderIdToDelete, setFolderIdToDelete] = useState(null);
  const [folderNameExists, setFolderNameExists] = useState(false);

  const newFolderInputRef = useRef(null);

  const { folders, setFolders, setNewFolderTitle, addFolder, newFolderTitle, checkFolderExists } =
    useContext(FoldersContext);
  const { isModalVisible, setIsModalVisible } = useContext(ModalContext);
  const { surveyDocs, setFilteredSurveys, setAllSurveys } = useContext(SurveyContext);

  const { isLoading, setIsLoading } = useIsLoading();
  const { deleteFolderObjectFromFirestore } = useFirestoreSurveysForFolders();
  const { deleteFolderObjectFromSurvey } = useFirestoreSurveys();

  useEffect(() => {
    if (newFolderInputRef.current) {
      newFolderInputRef.current.focus();
    }
  }, []);

  const folderItemClasses = `${classes['folder-item']} ${isActive && classes.selected} ${
    newFolderInput && classes['new-folder']
  }`;

  const filterSurveysWithinFolder = (id) => {
    if (id === 'toate_chestionarele') {
      setFilteredSurveys([]);
      setAllSurveys(true);
      return;
    }
    setAllSurveys(false);
    let arr = [];
    surveyDocs.forEach((s) => {
      if (s.folder?.value === id) {
        arr.push(s);
        setAllSurveys(false);
      }
    });
    setFilteredSurveys(arr);
    setAllSurveys(false);
  };

  const makeFolderActiveHandler = (e, id) => {
    if (e.target.nodeName === 'path') return;
    if (isCreatingNewFolder) return;
    setFolders((prevFolders) =>
      prevFolders.map((folder) => {
        // check if we clicked the folder that is already active
        // thus we want to keep it active
        if (folder.folderId === id && folder.isActive) {
          return folder;
        }
        // get the current active folder before setting the new one
        // and make it inactive
        if (folder.isActive) {
          return {
            ...folder,
            isActive: false,
          };
        }
        // make the current clicked folder active
        if (folder.folderId === id) {
          return {
            ...folder,
            isActive: !isActive,
          };
        }
        return folder;
      })
    );

    filterSurveysWithinFolder(id);
  };

  const agreeDeleteFolderHandler = async (id) => {
    setIsModalVisible(false);
    setIsLoading(true);
    const isTheClickedFolderActive = !![...folders].find(
      (folder) => folder.folderId === id && folder.isActive
    );

    // delete folder from firestore
    await deleteFolderObjectFromFirestore(id);

    // delete folder from survey if exists
    await deleteFolderObjectFromSurvey(id);

    // check if the folder is active
    if (!isTheClickedFolderActive) {
      setFolders((prevFolders) => prevFolders.filter((folder) => folder.folderId !== id));
      return;
    }
    // if the folder is active make sure that after deleting
    // it from UI, the 'Toate Chestionarele' folder is active
    const filteredFolders = [...folders].filter((folder) => {
      return folder.folderId !== id;
    });
    filteredFolders.forEach((_) => {
      const foldersArr = [...filteredFolders];

      const toateChestionareleFolderIndex = filteredFolders.findIndex(
        (el) => el.folderId === 'toate_chestionarele'
      );
      const toateChestionareleFolder = {
        ...foldersArr[toateChestionareleFolderIndex],
        isActive: true,
      };

      foldersArr[toateChestionareleFolderIndex] = toateChestionareleFolder;
      setFolders(foldersArr);
    });
    setIsDeleting(false);
    setFolderIdToDelete(null);
    setIsLoading(false);
  };

  const prepareDeleteFolderHandler = async (id) => {
    setIsDeleting(true);
    setIsModalVisible(true);
    setFolderIdToDelete(id);
  };

  const newFolderNameHandler = () => {
    setNewFolderTitle(newFolderInputRef.current.value);
  };

  const newFolderFocusLostHandler = (e) => {
    if (newFolderTitle !== '' && newFolderTitle.length > 0) {
      addNewFolderHandler(e);
      setIsCreatingNewFolder(false);
      return;
    }
    setIsCreatingNewFolder(false);
  };

  const addNewFolderHandler = async (e) => {
    e.preventDefault();
    if (newFolderTitle.trim() === '') return;
    if (checkFolderExists(newFolderTitle)) {
      setFolderNameExists(true);
      setIsModalVisible(true);
      return;
    }
    const id = uuid();
    await addFolder(newFolderTitle, id);
    setNewFolderTitle('');
    newFolderInputRef.current.value = '';
  };

  const newFolderForm = (
    <form onSubmit={addNewFolderHandler} className={classes['new-folder__form']}>
      <input
        type="text"
        onChange={newFolderNameHandler}
        onBlur={newFolderFocusLostHandler}
        ref={newFolderInputRef}
      />
    </form>
  );

  const wrapperPopupDeleteFolder = (
    <WrapperCard
      multiple={true}
      multipleAction={() => agreeDeleteFolderHandler(folderIdToDelete)}
      hideSidebar={true}
    >
      <p>Sunteți sigur că doriți să ștergeți folderul selectat?</p>
    </WrapperCard>
  );

  const wrapperPopupFolderNameExists = (
    <WrapperCard hideSidebar={true}>
      <p>Un folder cu acest numele există deja.</p>
    </WrapperCard>
  );
  return (
    <>
      {isDeleting && isModalVisible && wrapperPopupDeleteFolder}
      {folderNameExists && isModalVisible && wrapperPopupFolderNameExists}
      {!isLoading && (
        <article
          className={folderItemClasses}
          onClick={(e) => makeFolderActiveHandler(e, folderId)}
        >
          <FaFolder className={classes['folder-icon']} />
          <span className={classes['folder-item__name']}>{folderTitle}</span>
          {newFolderInput && newFolderForm}
          <aside
            onClick={() => prepareDeleteFolderHandler(folderId)}
            className={classes['folder-item__trash']}
            title="Ștergeți folderul curent"
          >
            {folderId !== 'toate_chestionarele' && <FaTrash />}
          </aside>
        </article>
      )}
      {isLoading && <Spinner />}
    </>
  );
};

export default Folder;
