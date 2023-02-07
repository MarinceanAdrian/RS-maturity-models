import React, { useCallback, useState, useEffect } from "react";
import Button from "../../UI/Button";
import { MdEdit, MdFactCheck } from "react-icons/md";
import SurveyList from "./SurveyList";
import { useNavigate } from "react-router-dom";
import BackButton from "../../UI/BackButton";
import classes from "./Main.module.css";

const Main = ({ createSurveyPage = false }) => {
  const [isScrolling, setIsScrolling] = useState(false);

  const redirect = useNavigate();

  // redirect to the create survey page when clicking the button
  const handleRedirectToCreateSurveyHandler = () =>
    redirect("/create-survey", { replace: true });

  // change header styling when scrolling in the mobile view
  const changeStyleUponScrolling = useCallback(() => {
    const scrollValue = document.documentElement.scrollTop;
    if (scrollValue > 88) {
      setIsScrolling(true);
    } else if (scrollValue < 88) {
      setIsScrolling(false);
    }
  }, []);

  useEffect(() => {
    // get the data concerining screen width in order
    // to establish if we are on mobile view or not
    const { innerWidth: width } = window;
    if (width < 560) {
      console.log("width", width);
      window.addEventListener("scroll", changeStyleUponScrolling);
    }
  }, []);

  const scrollingCheckIcon = <MdFactCheck className={classes["mobile-add"]} />;

  const createSurveyButton = (
    <Button clickHandler={handleRedirectToCreateSurveyHandler}>
      <>
        <MdEdit style={{ fontSize: "1.1rem", padding: "0" }} />
        <span>Creeaza sondaj</span>
      </>
    </Button>
  );

  const scrollingStateHome = isScrolling && !createSurveyPage && (
    <>{scrollingCheckIcon}</>
  );

  const scrollingStateCreateSurvey = isScrolling &&
    createSurveyPage &&
    createSurveyPage && <BackButton />;

  const staticStateHome = !isScrolling && !createSurveyPage && (
    <>
      <h2>Sondajele mele</h2>
      {createSurveyButton}
    </>
  );

  const staticStateCreateSurvey = !isScrolling && createSurveyPage && (
    <h2 style={{ paddingLeft: "4rem" }}>Creează sondaj</h2>
  );

  return (
    <div className={classes.main}>
      <section className={classes["main__header"]}>
        {staticStateHome}
        {scrollingStateHome}
        {staticStateCreateSurvey}
        {scrollingStateCreateSurvey}
      </section>
      <SurveyList createSurveyPage={createSurveyPage} />
    </div>
  );
};

export default Main;
