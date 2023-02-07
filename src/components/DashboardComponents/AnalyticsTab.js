import { useState, useEffect } from 'react';
import { VisualizationPanel } from 'survey-analytics';
import 'survey-analytics/survey.analytics.css';
import { Model } from 'survey-core';
import 'survey-analytics/survey.analytics.min.css';
import styles from "./AnalyticsTab.module.css"


const vizPanelOptions = {
  allowHideQuestions: false,
  allowDynamicLayout: false,
  allowSelection: false,
};

export default function AnalyticsTab(props) {
  const [survey, setSurvey] = useState(null);
  const [vizPanel, setVizPanel] = useState(null);
  if (!survey) {
    const survey = new Model(props.creator.JSON);
    setSurvey(survey);
  }

  if (!props.surveyResponses || props.surveyResponses.length === 0) {
    return (
      <h2 className={styles.noDataMessage}>Momentan nu sunt raspunsuri la acest chestionar</h2>
    );
  }

  if (!vizPanel && !!survey) {
    const vizPanel = new VisualizationPanel(
      survey.getAllQuestions(),
      props.surveyResponses,
      vizPanelOptions
    );
    vizPanel.showHeader = false;
    setVizPanel(vizPanel);
  }

  useEffect(() => {
    vizPanel.render('surveyVizPanel');
    return () => {
      if (document.getElementById('surveyVizPanel')) {
        document.getElementById('surveyVizPanel').innerHTML = '';
        document.getElementById('surveyVizPanel').style.overflowY = 'auto';
      }
    };
  }, [vizPanel]);

  return <div id="surveyVizPanel" />;
}
