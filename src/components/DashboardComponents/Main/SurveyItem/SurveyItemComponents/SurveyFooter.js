import React, { useCallback, useEffect, useState, useRef } from 'react';
import { MdOutlineMoreVert } from 'react-icons/md';
import useFirestoreSurveys from '../../../../../hooks/useFirestore/useFirestoreSurveys';
import useOutsideAlerter from '../../../../../hooks/useOutsideClick/useOutsideClick';
import classes from './SurveyFooter.module.css';

const SurveyFooter = ({ createSurveyPage, title, surveyId, moreDetails, setMoreDetails, isPublic }) => {
  const wrapperRef = useRef(null);

  const [responsesNumber, setResponsesNumber] = useState(0);

  const { getResponsesForSurvey } = useFirestoreSurveys();

  const getResponses = useCallback(async () => {
    const responses = await getResponsesForSurvey(surveyId);
    return responses.length;
  }, []);

  useOutsideAlerter(wrapperRef, moreDetails, setMoreDetails);

  const surveyTypeClass = `${classes[`survey__header${!isPublic ? '--draft' : '--public'}`]}`;

  useEffect(() => {
    getResponses().then((data) => {
      setResponsesNumber(data);
    });
  }, []);

  const createdSurveyCardFooter = (
    <>
      <p>Raspunsuri: {responsesNumber}</p>
      <div className={classes['footer-actions']}>
        <span className={surveyTypeClass}>{isPublic ? 'Public' : 'Draft'}</span>
        <MdOutlineMoreVert
          onClick={() => {
            setMoreDetails((prevState) => !prevState);
            localStorage.setItem('surveyId', surveyId);
          }}
          className={moreDetails ? classes.overlay : ''}
        />
      </div>
    </>
  );

  const templateSurveyCardFooter = (
    <div className={classes['survey__footer--title']}>
      <span className={`${classes['survey__footer']} ${!title && classes['highlight-text']}`}>
        {!title ? 'Sondaj nou' : title}
      </span>
    </div>
  );

  return (
    <footer className={classes['survey__footer']} ref={wrapperRef}>
      {!createSurveyPage ? createdSurveyCardFooter : templateSurveyCardFooter}
    </footer>
  );
};

export default SurveyFooter;
