import React, { useState, useEffect, useContext } from 'react';
import useFirestoreSurveys from '../../../hooks/useFirestore/useFirestoreSurveys';
import SurveyItem from './SurveyItem/SurveyItem';
import SurveyItemBlueprint from './SurveyItem/SurveyItemBlueprint';
import Spinner from '../../UI/Spinner';
import classes from './SurveyList.module.css';
import { useCallback } from 'react';
import useIsLoading from '../../../hooks/useIsLoading/useIsLoading';
import { SurveyContext } from '../../../context/survey-context/survey-context';
import useFirestoreForTemplates from '../../../hooks/useFirestore/useFirestoreForTemplates';
import { TemplateContext } from '../../../context/templates-context/templates-context';

const SurveyList = ({ createSurveyPage }) => {
  const { surveyDocs, setSurveyDocs, filteredSurveys, setFilteredSurveys, allSurveys } =
    useContext(SurveyContext);

  const { isLoading, setIsLoading } = useIsLoading();
  const { getSurveys } = useFirestoreSurveys();

  //templates
  const { templates } = useContext(TemplateContext);

  const initializeCreatedSurveys = useCallback(() => {
    let surveyItems = [];
    setIsLoading(true);
    getSurveys().then((data) => {
      data.forEach((doc) => {
        surveyItems.push({
          ...doc.data().surveyData,
          id: doc.id,
          folder: doc.data().folder || null,
        });
      });
      setSurveyDocs(surveyItems);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    initializeCreatedSurveys();
    setFilteredSurveys([]);
  }, []);

  const surveyListClasses = `${classes['survey-list']} ${
    createSurveyPage && classes['survey-list--create']
  }`;

  const surveyItemBlueprint = <SurveyItemBlueprint createSurveyPage={createSurveyPage} />;

  const renderFilteredSurveys = filteredSurveys.map((filtered) => {
    return (
      <SurveyItem
        setSurveyDocs={setSurveyDocs}
        surveyDocs={filteredSurveys}
        surveyId={filtered.id}
        isPublic={filtered.isPublic}
        createSurveyPage={createSurveyPage}
        surveyDocData={filtered}
        key={filtered.id}
      />
    );
  });

  const renderAllSurveys = surveyDocs.map((surveyDoc) => {
    return (
      <SurveyItem
        setSurveyDocs={setSurveyDocs}
        surveyDocs={surveyDocs}
        surveyId={surveyDoc.id}
        isPublic={surveyDoc.isPublic}
        createSurveyPage={createSurveyPage}
        surveyDocData={surveyDoc}
        key={surveyDoc.id}
      />
    );
  });

  const templateSurveys = templates && templates.length > 0 && templates.map((template) => (
    <SurveyItemBlueprint
      createSurveyPage={createSurveyPage}
      jsonData={template.surveyData}
      logo={template.surveyData.logo}
      title={template.surveyData.title}
      key={template.label}
    />
  ));
  return (
    <ul className={surveyListClasses}>
      {isLoading && <Spinner generalSpinner={true} />}
      {createSurveyPage && surveyItemBlueprint}
      {createSurveyPage && templateSurveys}
      {!createSurveyPage &&
        filteredSurveys &&
        allSurveys &&
        filteredSurveys.length === 0 &&
        renderAllSurveys}

      {!createSurveyPage && filteredSurveys && filteredSurveys.length > 0 && renderFilteredSurveys}

      {!createSurveyPage && !allSurveys && filteredSurveys.length === 0 && (
        <section className={classes.svg}></section>
      )}
      {!isLoading && surveyDocs.length === 0 && !createSurveyPage && (
        <section className={classes.svg}></section>
      )}
    </ul>
  );
};

export default SurveyList;
