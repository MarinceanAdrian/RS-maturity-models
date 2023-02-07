import React, { useState } from "react";
import SurveyBody from "./SurveyItemComponents/SurveyBody";
import SurveyFooter from "./SurveyItemComponents/SurveyFooter";
import { useNavigate } from "react-router-dom";
import useFirestoreSurveys from "../../../../hooks/useFirestore/useFirestoreSurveys";
import classes from "./SurveyItemBlueprint.module.css";

const SurveyItemBlueprint = ({ createSurveyPage, jsonData, title, logo }) => {
  const [error, setError] = useState(null);

  const { createSurveyToFirestore } = useFirestoreSurveys();

  const redirect = useNavigate();

  const loadTemplate = async () => {
    try {
      const path = await createSurveyToFirestore({
        JSONData: jsonData,
      });
      redirect(`/survey-creator/${path}`, { replace: true });
    } catch (err) {
      setError(err.message);
      console.log("err", err);
    }
  };

  return (
    <li className={classes["survey-blueprint"]} onClick={loadTemplate}>
      <SurveyBody
        createSurveyPage={createSurveyPage}
        surveyDocData={jsonData}
        logo={logo}
        title={title}
      />
      <SurveyFooter createSurveyPage={createSurveyPage} title={title} />
    </li>
  );
};

export default SurveyItemBlueprint;
