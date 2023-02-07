import React from "react";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import classes from "./BackButton.module.css";
import { useNavigate } from "react-router-dom";
const BackButton = ({ surveyCreatorPage }) => {
  const navigate = useNavigate();

  const backButtonClasses = `${
    surveyCreatorPage ? classes.back : `${classes.back} ${classes.general}`
  }`;
  return (
    <>
      <IoArrowBackCircleSharp
        className={backButtonClasses}
        onClick={() =>
          navigate(`${surveyCreatorPage ? "/create-survey" : "/"}`, {
            replace: true,
          })
        }
      />
    </>
  );
};

export default BackButton;
