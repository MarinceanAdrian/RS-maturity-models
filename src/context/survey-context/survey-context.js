import React, { useState } from 'react';

export const SurveyContext = React.createContext({
  surveyDocs: [],
  setSurveyDocs: () => {},
  setFilteredSurveys: () => {}
});

const SurveyContextProvider = ({ children }) => {
  const [surveyDocs, setSurveyDocs] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [allSurveys, setAllSurveys] = useState(true);

  const updateSurveysWithFolderData = (selectedFolderData) => {
    const updatedSurveys = [...surveyDocs];
    const surveyIndex = updatedSurveys.findIndex(s => s.id === localStorage.getItem('surveyId'))
    const survey = updatedSurveys.find(s => s.id === localStorage.getItem('surveyId'));

    const updatedSurvey = {
      ...survey,
      // assin here the folder ID
      folder: selectedFolderData
    }

    updatedSurveys[surveyIndex] = updatedSurvey;
    setSurveyDocs(updatedSurveys);
  }

  return (
    <SurveyContext.Provider
      value={{
        surveyDocs,
        setSurveyDocs,
        setFilteredSurveys,
        filteredSurveys,
        setAllSurveys,
        allSurveys,
        updateSurveysWithFolderData,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export default SurveyContextProvider;
