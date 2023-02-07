import React from "react";
import classes from "./SurveyHeader.module.css";
const SurveyHeader = ({ surveyDocData }) => {
  let title = surveyDocData?.title ? surveyDocData.title :'Nume Sondaj';
  
  return (
    <div className={classes["survey__header"]}>
      <h3 title={title}>{title}</h3>
    </div>
  );
};

export default SurveyHeader;
