import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Model, StylesManager } from 'survey-core';
import { Survey } from 'survey-react-ui';
import WrapperCard from '../components/UI/WrapperCard';
import useFirestoreSurveys from '../hooks/useFirestore/useFirestoreSurveys.js';
import useIsLoading from '../hooks/useIsLoading/useIsLoading';
import Spinner from '../components/UI/Spinner';
import 'survey-core/defaultV2.css';
import './SurveyDisplay.css';

StylesManager.applyTheme('defaultV2');

export function SurveyDisplay() {
  const { surveyId, userId } = useParams();
  const [json, setJson] = useState(null);
  const [model, setModel] = useState(null);

  // date related state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSurveyPublic, setIsSurveyPublic] = useState(true);
  const [error, setError] = useState({
    hasError: false,
    errorText: '',
  });

  const currentDate = new Date().getTime();

  const { isLoading, setIsLoading } = useIsLoading();
  const { getSurveys, saveResponsesToFirestore, getSurveyAvailability, getIsPublicStateForSurvey } =
    useFirestoreSurveys();

  const fetchSurveyData = useCallback(async () => {
    try {
      await getSurveys(setJson, surveyId, userId);
    } catch (err) {
      console.log('err', err);
    }
  }, []);

  const fetchSurveyAvailability = async () => {
    try {
      const data = await getSurveyAvailability(userId, surveyId);
      setStartDate(data.startDate.toDate());
      setEndDate(data.endDate.toDate());

      const startDate = data.startDate.toDate().getTime();
      const endDate = data.endDate.toDate().getTime();

      const isSurveyAvaiblable = currentDate > startDate && currentDate < endDate;
      setIsAvailable(isSurveyAvaiblable);
    } catch (err) {
      setError({
        hasError: true,
        errorText: 'Intervalul de distribuire nu a fost setat încă pentru acest chestionar.',
      });
    }
  };
  console.log(error)
  const getIsPublic = async () => {
    try {
      setIsSurveyPublic(await getIsPublicStateForSurvey(userId, surveyId));
    } catch (err) {
      console.log('err', err);
      setError({
        hasError: true,
        errorText: 'Chestionarul nu a putut fi găsit. Acesta fie a fost șters, fie nu mai este activ.'
      })
    }
  };

  useEffect(() => {
    if (surveyId) {
      setIsLoading(true);
      fetchSurveyData();
      fetchSurveyAvailability();
      getIsPublic();
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (json) {
      setModel(new Model(json));
    }
  }, [json]);

  const onComplete = async (survey) => {
    await saveResponsesToFirestore(survey.data, surveyId, userId);
  };

  return (
    <>
      {error.hasError && (
        <WrapperCard noActions={true}>
          <p>{error.errorText}</p>
        </WrapperCard>
      )}
      {isLoading && <Spinner generalSpinner={true} />}
      {!isAvailable && !isLoading && (
        <WrapperCard noActions={true}>
          {currentDate > endDate && (
            <>
              <p>Chestionarul nu mai este activ.</p>
              <p>Dată expirare: {new Date(endDate).toLocaleDateString()}</p>
            </>
          )}
          {currentDate < startDate && (
            <>
              <p>Chestionarul încă nu este activ pentru completare.</p>
              <p>Dată start: {new Date(startDate).toLocaleDateString()}</p>
            </>
          )}
        </WrapperCard>
      )}
      {!isSurveyPublic && !error.hasError && (
        <WrapperCard noActions={true}>
          <p>Chestionar încă nu este public.</p>
        </WrapperCard>
      )}
      <div id="container">{model && <Survey model={model} onComplete={onComplete} />}</div>
    </>
  );
}
