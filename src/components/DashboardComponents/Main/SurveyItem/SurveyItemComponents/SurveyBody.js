import React from 'react';
import classes from './SurveyBody.module.css';
import { useNavigate } from 'react-router-dom';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import {RiSurveyLine} from 'react-icons/ri'
const SurveyBody = ({ createSurveyPage, surveyDocData, logo, title, surveyId }) => {
  const navigate = useNavigate();

  const redirectToSurveyCreatorPageHandler = () => {
    if (surveyDocData?.id) {
      localStorage.setItem('surveyId', surveyId);
      localStorage.setItem('currentSurveyDocId', surveyDocData.id);
      navigate(`/survey-creator/${surveyDocData.id}`, { replace: true });
      // QUESTION: Why this code is not executed nor before nor after navigate?
    }
  };

  const createdSurveysCard = (
    <div className={classes['survey__body-logo']}>
      {/* {surveyDocData?.logo && (
        <img src={surveyDocData.logo} alt="The logo choosen for the survey" />
      ) } */}
      {surveyDocData?.logo ? (
        <img src={surveyDocData.logo} alt="The logo choosen for the survey" />
      ) : (
        <RiSurveyLine className={classes.default}/>
      ) }
    </div>
  );

  const createSurveyFromScratchCard = (
    <span className={classes['survey__body--no-img']}>
      <MdOutlineAddCircleOutline style={{ fontSize: '5rem', color: '718ADD' }} />
    </span>
  );

  const templateImage = (
    <img src={logo} alt={title} onClick={() => redirectToSurveyCreatorPageHandler()} />
  );

  return (
    <div onClick={redirectToSurveyCreatorPageHandler} className={classes['survey__body']}>
      {createSurveyPage && templateImage}
      {!createSurveyPage && createdSurveysCard}
      {createSurveyPage && !logo && createSurveyFromScratchCard}
    </div>
  );
};

export default SurveyBody;
