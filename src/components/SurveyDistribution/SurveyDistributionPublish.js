import React, { useContext, useState, useEffect, useCallback } from 'react';
import { DistributionContext } from '../../context/distribution-context/distribution-context';
import { useParams } from 'react-router';
import Spinner from '../UI/Spinner';
import Switch from 'react-switch';
import Button from '../UI/Button';
import PopupModal from '../UI/PopupModal';
import classes from './SurveyDistributionPublish.module.css';
import useFirestoreSurveys from '../../hooks/useFirestore/useFirestoreSurveys';
import useFetchFromLocalStorage from '../../hooks/useLocalStorage/useFetchFromLocalStorage';
import useIsLoading from '../../hooks/useIsLoading/useIsLoading';

const SurveyDistributionPublish = ({ creatorJSON }) => {
  const { id } = useParams();

  const [isURLCopied, setIsURLCopied] = useState(false);
  const [isSwitchTouched, setIsSwitchTouched] = useState(false);

  const { isPublic, toggleIsPublicHandler } = useContext(DistributionContext);

  const { isLoading, setIsLoading } = useIsLoading();
  const uid = useFetchFromLocalStorage();
  const { updateSurveyDataInFirestore, getIsPublicStateForSurvey } = useFirestoreSurveys();

  const sharingPath = `http://localhost:3000/survey/${uid}/${id}`;
  useEffect(() => {
    setIsLoading(true);
    getIsPublicStateForSurvey(uid, id).then((data) => {
      toggleIsPublicHandler(data);
      setIsLoading(false);
    });
    return () => toggleIsPublicHandler(false);
  }, [id]);

  const updatePublishStateInFirestore = useCallback(async () => {
    await updateSurveyDataInFirestore({
      JSONData: { ...creatorJSON, isPublic },
      surveyId: id,
    });
  }, [creatorJSON, id, isPublic]);

  // update the isPublic flag for the current survey
  useEffect(() => {
    updatePublishStateInFirestore();
  }, [isPublic]);
  console.log('isPublic', isPublic)
  const handleCopyURL = () => {
    if (!isPublic) return;
    setIsURLCopied(true);
    navigator.clipboard.writeText(sharingPath);
  };
  const shareSurveyPageJSX = (
    <div className={classes.container}>
      <section className={classes.header}>
        <h3>Publică Sondajul</h3>
        <Switch
          checkedIcon={false}
          uncheckedIcon={false}
          checked={isPublic}
          onChange={() => {
            toggleIsPublicHandler();
            setIsSwitchTouched(true);
          }}
          value={isPublic}
          onColor="#375bd2"
          className={!isPublic ? classes.switch : ''}
        />
      </section>
      <section className={classes.share}>
        <div>
          <h3>Distribuie link</h3>
          <Button
            type="button"
            style={{ width: 'auto' }}
            clickHandler={handleCopyURL}
            disabled={!isPublic}
          >
            Copiază
          </Button>
        </div>
        <input
          type="text"
          className={classes['share-input']}
          value={
            isPublic ? sharingPath : 'Chestionarul trebuie să fie public pentru a fi distribuit'
          }
          onClick={handleCopyURL}
          style={{ cursor: !isPublic ? 'not-allowed' : 'pointer' }}
        />
        {isURLCopied && (
          <aside className={classes.copied}>
            <p>Copiat!</p>
          </aside>
        )}
      </section>
    </div>
  );

  return (
    <>
      {isSwitchTouched && <PopupModal>Chestionar marcat ca public!</PopupModal>}
      {isLoading && <Spinner />}
      {!isLoading && shareSurveyPageJSX}
    </>
  );
};

export default SurveyDistributionPublish;
