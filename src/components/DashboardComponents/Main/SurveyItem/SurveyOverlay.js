import { MdDeleteForever, MdFolder } from 'react-icons/md';
import { useContext, useEffect } from 'react';
import { FoldersContext } from '../../../../context/folders-context/folders-context';
import useFirestoreSurveys from '../../../../hooks/useFirestore/useFirestoreSurveys';
import classes from './SurveyOverlay.module.css';

const SurveyOverlay = ({ prepareDeleteSurveyHandler, openFolderAssociationModal }) => {
  const { defaultOption, setDefaultOption } = useContext(FoldersContext);
  const { getSurveyFolder } = useFirestoreSurveys();

  const surveyId = localStorage.getItem('surveyId') || null;

  // check if the current survey is already associated to a folder.
  useEffect(() => {
    const updateDefaultFolderOption = async () => {
      setDefaultOption(await getSurveyFolder(surveyId));
    };

    updateDefaultFolderOption();
  }, []);
  return (
    <div className={classes.overlay}>
      <button onClick={prepareDeleteSurveyHandler}>
        <MdDeleteForever style={{pointerEvents: 'none'}}/>
        <span style={{pointerEvents: 'none'}}>Șterge</span>
      </button>
      <button onClick={openFolderAssociationModal} className={classes['overlay__folder']}>
        <MdFolder style={{pointerEvents: 'none'}}/>
        <span style={{pointerEvents: 'none'}}>{defaultOption ? defaultOption.label : 'Asociere la folder'}</span>
      </button>
    </div>
  );
};

export default SurveyOverlay;
