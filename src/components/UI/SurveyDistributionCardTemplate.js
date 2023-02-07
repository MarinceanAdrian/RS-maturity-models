import React from "react";
import classes from "./SurveyDistributionCardTemplate.module.css";

const SurveyDistributionCardTemplate = ({ children, gridArea }) => {
  return (
    <div
      className={classes["distribution-card"]}
      style={{ gridArea: gridArea }}
    >
      {children}
    </div>
  );
};

export default SurveyDistributionCardTemplate;
