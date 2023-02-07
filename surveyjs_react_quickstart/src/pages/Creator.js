import React from "react";
import SurveyCreator from "../components/SurveyCreator";
import { Model } from "survey-core";

import { json } from "../data/survey_json.js";

export function CreatorPage() {
  const survey = new Model(json);
  return (
    <>
      <h1>Survey Creator / Form Builder</h1>
      <SurveyCreator json={json} model={survey} />
    </>
  );
}
