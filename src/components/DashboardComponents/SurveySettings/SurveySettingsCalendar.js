import React, { useState } from 'react';
import Switch from 'react-switch';
import DatePicker from 'react-datepicker';
import classes from './SurveySettingsCalendar.module.css';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import useFirestoreSurveys from '../../../hooks/useFirestore/useFirestoreSurveys';

const CalendarContainer = styled.section`
  & {
    display: flex;
    gap: 4rem;
  }

  & .calendar-container {
    display: flex;
    align-items: center;
    gap: 1.4rem;
    width: auto;
  }

  & .react-datepicker__input-container input {
    width: 5.5rem;
    border-bottom: 2px solid var(--mainBlue);
  }
`;

const SurveySettingsCalendar = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [checked, setChecked] = useState(false);

  const { updateSurveyWithAvailabilityStartDate, updateSurveyWithAvailabilityEndDate } =
    useFirestoreSurveys();

  const startDateHandler = (data) => {
    setStartDate(data);
    updateSurveyWithAvailabilityStartDate(localStorage.getItem('surveyId'), 'startDate', data);
  };

  const endDateHandler = (data) => {
    setEndDate(data);
    updateSurveyWithAvailabilityEndDate(localStorage.getItem('surveyId'), 'endDate', data);
  };

  return (
    <div className={classes.container}>
      <section className={classes.header}>
        <h3>Data limită a chestionarului </h3>
        <Switch
          checkedIcon={false}
          uncheckedIcon={false}
          checked={checked}
          onChange={() => setChecked((prev) => !prev)}
          onColor="#375bd2"
        />
      </section>
      <section className={classes.section}>
        <div>
          <p>
            Start/data sfârșit - intervalul în care chestionarul va fi acceisibil și va colecta
            răspunsuri.
          </p>
        </div>
      </section>
      <CalendarContainer>
        <div className="calendar-container">
          <span>Start: </span>
          <DatePicker selected={startDate} onChange={startDateHandler} />
        </div>
        <div className="calendar-container">
          <span>Sfârșit: </span>
          <DatePicker selected={endDate} onChange={endDateHandler} />
        </div>
      </CalendarContainer>
    </div>
  );
};

export default SurveySettingsCalendar;
