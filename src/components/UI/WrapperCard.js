import React, { useContext, useEffect } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { createPortal } from 'react-dom';
import { ModalContext } from '../../context/modal-context/modal-context';
import Button from './Button';
import styled from 'styled-components';
import { FoldersContext } from '../../context/folders-context/folders-context';
import useFirestoreSurveys from '../../hooks/useFirestore/useFirestoreSurveys';
import useFirestoreSurveysForFolders from '../../hooks/useFirestore/useFirestoreForFolders';

const BackdropWrapper = styled.div`
  position: fixed;
  z-index: 25;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: gray;
  opacity: 0.7;
`;
const Card = styled.div`
  background-color: #fff;
  border-radius: 0.5rem;
  padding: 1.3rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.8);
  position: fixed;
  left: 50%;
  transform: translate(-48%, -50%);
  z-index: 25;
  animation: identifier 1s forwards;

  & section:last-child {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: flex-end;
  }

  & .dropdown {
    flex: 1;
  }

  & .Dropdown-control {
    border: 2px solid var(--mainBlue);
    padding: 0.65rem;
    border-radius: var(--radius);
    background: var(--mainBlue);
    color: white;
  }

  & .Dropdown-arrow {
    border-color: white transparent transparent;
    top: 50%;
    transform: translateY(-50%);
  }

  @keyframes identifier {
    0% {
      top: 48%;
    }

    100% {
      top: 50%;
    }
  }
`;

const rootEl = document.getElementById('root');
export const Backdrop = ({ onCloseSidebar = null, hideSidebar }) => {
  const { setIsModalVisible } = useContext(ModalContext);

  // If we are in mobile view we can chose to close the sidebar.
  // The function that closes the sidebar comes as a prop from App.
  // If we are in full screen, the function that will execute on onClick
  // will allways be that from the context.
  return (
    <BackdropWrapper
      hideSidebar={hideSidebar}
      onClick={() => (onCloseSidebar ? onCloseSidebar() : setIsModalVisible(false))}
    />
  );
};

const Modal = ({
  children,
  multiple,
  multipleAction,
  associateFolder,
  setIsDeleting = () => {},
  setSurveyIdToDelete = () => {},
  setIsAssociatingFolder = () => {},
  noActions
}) => {
  const { setIsModalVisible } = useContext(ModalContext);
  const { folders, associateSurveyToExistingFolder, defaultOption, setDefaultOption } =
    useContext(FoldersContext);
  const { updateSurveyFolderData, getSurveyFolder } = useFirestoreSurveys();
  const {updateFolderWithAssociatedSurvey} = useFirestoreSurveysForFolders()

  const surveyId = localStorage.getItem('surveyId') || null;
  let folderTitles = [];

  if (folders) {
    folderTitles = [...folders].map((f) => {
      return {
        value: f.folderId,
        label: f.folderTitle,
      };
    });
  }

  const closeModalHandler = () => {
    setIsModalVisible(false);
    if (multiple) {
      setIsDeleting(false);
      setSurveyIdToDelete(null);
    }
    if (associateFolder) {
      setIsAssociatingFolder(false);
    }
  };

  const changeDropdownOptionsHandler = async (e) => {
    const folderData = {
      value: e.value,
      label: e.label,
    };

    if (defaultOption && defaultOption.value !== folderData.value) {
      // copy the existing folders arr
      const updatedFolders = [...folders];
      const folderToUpdateIndex = updatedFolders.findIndex(f => f.folderId === defaultOption.value);
      const folderToUpate = updatedFolders[folderToUpdateIndex];
      
      // copy the surveys array from within the folder to update (the previous folder)
      let surveysArrToUpdate = [...folderToUpate.surveys];
      const updatedSurveys = surveysArrToUpdate.filter(survey => survey !== surveyId);
      surveysArrToUpdate = updatedSurveys;

      // update the overall folders array with the updated survey array for folder
      updatedFolders[folderToUpdateIndex].surveys = updatedSurveys;

      await updateFolderWithAssociatedSurvey(updatedFolders);
    }
    associateSurveyToExistingFolder(surveyId, folderData);
    await updateSurveyFolderData(surveyId, folderData);
  };

  // check if the current survey is already associated to a folder.
  // TODO: make this a custom hook since it is used in SurveyOverlay also
  useEffect(() => {
    const updateDefaultFolderOption = async () => {
      setDefaultOption(await getSurveyFolder(surveyId));
    };

    updateDefaultFolderOption();
  }, []);

  const closeWrapper = (
    !noActions ? (
    <Button type="button" clickHandler={closeModalHandler} closeBtn={true}>
      Închide
    </Button> ) : null
  );

  const infoWrapper = <section>{closeWrapper}</section>;

  const multipleWrapper = (
    <section>
      {closeWrapper}
      <Button
        type="button"
        style={{ width: '7rem', fontWeight: 'bold' }}
        clickHandler={multipleAction}
      >
        Ok
      </Button>
    </section>
  );

  const associateFolderWrapper = (
    <section>
      {closeWrapper}
      <Dropdown
        className="dropdown"
        options={folderTitles}
        value={defaultOption}
        onChange={changeDropdownOptionsHandler}
      />
    </section>
  );


  return (
    <Card>
      <section style={{ marginBottom: '1.1rem', lineHeight: '1.4rem' }}>{children}</section>
      {!multiple && !associateFolder && infoWrapper}
      {multiple && multipleWrapper}
      {!multiple && associateFolder && associateFolderWrapper}
     
    </Card>
  );
};

const WrapperCard = ({
  children,
  multiple,
  multipleAction,
  hideSidebar,
  associateFolder,
  setIsDeleting,
  setSurveyIdToDelete,
  setIsAssociatingFolder,
  noActions
}) => {
  return (
    <>
      {createPortal(<Backdrop hideSidebar={hideSidebar} />, rootEl)}
      {createPortal(
        <Modal
          multiple={multiple}
          multipleAction={multipleAction}
          associateFolder={associateFolder}
          setIsDeleting={setIsDeleting}
          setSurveyIdToDelete={setSurveyIdToDelete}
          setIsAssociatingFolder={setIsAssociatingFolder}
          noActions={noActions}
        >
          {children}
        </Modal>,
        rootEl
      )}
    </>
  );
};

export default WrapperCard;
