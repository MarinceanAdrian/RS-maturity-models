import React, { useContext, useState } from 'react';
import classes from './SurveyItem.module.css';
import SurveyHeader from './SurveyItemComponents/SurveyHeader';
import SurveyBody from './SurveyItemComponents/SurveyBody';
import SurveyFooter from './SurveyItemComponents/SurveyFooter';
import SurveyOverlay from './SurveyOverlay';
import useFirestoreSurveys from '../../../../hooks/useFirestore/useFirestoreSurveys';
import useIsLoading from '../../../../hooks/useIsLoading/useIsLoading';
import { ModalContext } from '../../../../context/modal-context/modal-context';
import WrapperCard from '../../../UI/WrapperCard';
import { SurveyContext } from '../../../../context/survey-context/survey-context';

// Model for cards: https://dribbble.com/shots/11956830-UI-Components-Dashboard
const SurveyItem = ({
  isPublic,
  createSurveyPage = false,
  surveyDocData,
  logo,
  title,
  templateId,
  surveyId,
  setSurveyDocs,
}) => {
  const [moreDetails, setMoreDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [surveyIdToDelete, setSurveyIdToDelete] = useState(null);
  const [isAssociatingFolder, setIsAssociatingFolder] = useState(false);

  const { deleteSurvey } = useFirestoreSurveys();
  const { setIsLoading } = useIsLoading();

  const { isModalVisible, setIsModalVisible } = useContext(ModalContext);
  const { setFilteredSurveys } = useContext(SurveyContext);

  const prepareDeleteSurveyHandler = () => {
    setIsDeleting(true);
    setIsModalVisible(true);
    setSurveyIdToDelete(surveyId);
  };

  const openFolderAssociationModal = () => {
    setIsAssociatingFolder(true);
    setIsModalVisible(true);
  };

  const deleteSurveyHandler = async (surveyId) => {
    setIsLoading(true);
    setSurveyDocs((prevDocs) => prevDocs.filter((survey) => survey.id !== surveyId));

    // delete the survey if it is also in the filteredSurveys array
    setFilteredSurveys((prevDocs) => prevDocs.filter((survey) => survey.id !== surveyId));

    await deleteSurvey(surveyId);
    setIsLoading(false);
  };

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

  const wrapperAssociateFolderForSurvey = (
    <WrapperCard
      associateFolder={true}
      hideSidebar={true}
      setIsAssociatingFolder={setIsAssociatingFolder}
    >
      <p>Asociați chestionarul curent la un folder existent</p>
    </WrapperCard>
  );
  return (
    <>
      {isDeleting && isModalVisible && !isAssociatingFolder && wrapperPopupDeleteSurvey}
      {!isDeleting && isModalVisible && isAssociatingFolder && wrapperAssociateFolderForSurvey}
      <li className={`${classes.survey}`}>
        {moreDetails && (
          <SurveyOverlay
            prepareDeleteSurveyHandler={prepareDeleteSurveyHandler}
            openFolderAssociationModal={openFolderAssociationModal}
            moreDetails={moreDetails}
          />
        )}
        <SurveyBody
          createSurveyPage={createSurveyPage}
          surveyDocData={surveyDocData}
          logo={logo}
          title={title}
          templateId={templateId}
          surveyId={surveyId}
        />
        {!createSurveyPage && <SurveyHeader surveyDocData={surveyDocData} />}
        <SurveyFooter
          moreDetails={moreDetails}
          createSurveyPage={createSurveyPage}
          title={title}
          surveyId={surveyId}
          setMoreDetails={setMoreDetails}
          isPublic={isPublic}
        />
      </li>
    </>
  );
};

export default SurveyItem;
