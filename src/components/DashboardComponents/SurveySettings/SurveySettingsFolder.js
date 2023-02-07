import React, { useContext, useEffect, useState } from 'react';
import Button from '../../UI/Button';
import Dropdown from 'react-dropdown';
import { FoldersContext } from '../../../context/folders-context/folders-context';
import classes from './SurveySettingsFolder.module.css';
import styled from 'styled-components';
import useFirestoreSurveys from '../../../hooks/useFirestore/useFirestoreSurveys';
import useFirestoreSurveysForFolders from '../../../hooks/useFirestore/useFirestoreForFolders';
import WrapperCard from '../../UI/WrapperCard';
import { ModalContext } from '../../../context/modal-context/modal-context';
import useIsLoading from '../../../hooks/useIsLoading/useIsLoading';
import { SurveyContext } from '../../../context/survey-context/survey-context';
import { useNavigate } from 'react-router-dom';

const FolderDropdown = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  & .Dropdown-control {
    border-radius: var(--radius);
    background: #F5F8FA;
    border: none;
    width: 13rem;
  }

  & .Dropdown-control {
    color: #6f717d;
    cursor: pointer;
  }

  & .Dropdown-arrow {
    color: #6f717d;
  }
`;

const SurveySettingsFolder = () => {
  const redirect = useNavigate();
  const surveyId = localStorage.getItem('surveyId') || null;

  const [isDeleting, setIsDeleting] = useState(false);
  const [surveyIdToDelete, setSurveyIdToDelete] = useState(null);

  const { getSurveyFolder, updateSurveyFolderData, deleteSurvey } = useFirestoreSurveys();
  const { updateFolderWithAssociatedSurvey } = useFirestoreSurveysForFolders();
  const { setIsLoading } = useIsLoading();

  const { folders, associateSurveyToExistingFolder, defaultOption, setDefaultOption } =
    useContext(FoldersContext);
  const { isModalVisible, setIsModalVisible } = useContext(ModalContext);
  const { setSurveyDocs, setFilteredSurveys } = useContext(SurveyContext);

  let folderTitles = [];

  if (folders) {
    folderTitles = [...folders].map((f) => {
      return {
        value: f.folderId,
        label: f.folderTitle,
      };
    });
  }

  const changeDropdownOptionsHandler = async (e) => {
    const folderData = {
      value: e.value,
      label: e.label,
    };

    if (defaultOption && defaultOption.value !== folderData.value) {
      // copy the existing folders arr
      const updatedFolders = [...folders];
      const folderToUpdateIndex = updatedFolders.findIndex(
        (f) => f.folderId === defaultOption.value
      );
      const folderToUpate = updatedFolders[folderToUpdateIndex];

      // copy the surveys array from within the folder to update (the previous folder)
      let surveysArrToUpdate = [...folderToUpate.surveys];
      const updatedSurveys = surveysArrToUpdate.filter((survey) => survey !== surveyId);
      surveysArrToUpdate = updatedSurveys;

      // update the overall folders array with the updated survey array for folder
      updatedFolders[folderToUpdateIndex].surveys = updatedSurveys;

      await updateFolderWithAssociatedSurvey(updatedFolders);
    }
    associateSurveyToExistingFolder(surveyId, folderData);
    await updateSurveyFolderData(surveyId, folderData);
  };

  const prepareDeleteSurveyHandler = () => {
    setIsDeleting(true);
    setIsModalVisible(true);
    setSurveyIdToDelete(surveyId);
  };

  const deleteSurveyHandler = async (surveyId) => {
    setIsLoading(true);
    setSurveyDocs((prevDocs) => prevDocs.filter((survey) => survey.id !== surveyId));

    // delete the survey if it is also in the filteredSurveys array
    setFilteredSurveys((prevDocs) => prevDocs.filter((survey) => survey.id !== surveyId));
    await deleteSurvey(surveyId);
    redirect('/', {replace: true})
    setIsLoading(false);
  };


  useEffect(() => {
    const updateDefaultFolderOption = async () => {
      setDefaultOption(await getSurveyFolder(surveyId) || null);
    };

    updateDefaultFolderOption();
  }, []);

  const wrapperPopupDeleteSurvey = (
    <WrapperCard
      multiple={true}
      multipleAction={() => deleteSurveyHandler(surveyIdToDelete)}
      hideSidebar={true}
      setIsDeleting={setIsDeleting}
      setSurveyIdToDelete={setSurveyIdToDelete}
    >
      <p>Sunteți sigur că doriți să ștergeți chestionarul curent?</p>
    </WrapperCard>
  );
  return (
    <>
      {isDeleting && isModalVisible && wrapperPopupDeleteSurvey}
      <div className={classes.container}>
        <h3>Modificați chestionarul</h3>
        <div className={classes['folder-container']}>
          <FolderDropdown>
            <p>Folder chestionar</p>
            <Dropdown
              options={folderTitles}
              value={defaultOption}
              onChange={changeDropdownOptionsHandler}
            />
          </FolderDropdown>
          <Button deleteBtn={true} clickHandler={prepareDeleteSurveyHandler}>
            Șterge chestionar
          </Button>
        </div>
      </div>
    </>
  );
};

export default SurveySettingsFolder;
