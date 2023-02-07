import { useState, useEffect } from 'react';
import { VisualizationPanel } from 'survey-analytics';
import 'survey-analytics/survey.analytics.css';
import { Model } from 'survey-core';
import 'survey-analytics/survey.analytics.min.css';
import styles from './ExportTab.css';
import { Tabulator } from 'survey-analytics/survey.analytics.tabulator';
import 'tabulator-tables/dist/css/tabulator.css';
import 'survey-analytics/survey.analytics.tabulator.css';
import JsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
window.XLSX = XLSX;
window.jsPDF = JsPDF;

export default function ExportTab(props) {
  const [survey, setSurvey] = useState(null);
  const [tablePanel, setTablePanel] = useState(null);

  if (!props.surveyResponses || props.surveyResponses.length === 0) {
    return (
      <h2 className={styles.noDataMessage}>Momentan nu sunt raspunsuri la acest chestionar</h2>
    );
  }

  if (!survey) {
    const survey = new Model(props.creator.JSON);
    setSurvey(survey);
  }

  if (!tablePanel && !!survey) {
    var panel = new Tabulator(survey, props.surveyResponses, {
      downloadOptions: { fileName: 'my_file', csv: { delimiter: ';' } },
    });
    panel.showHeader = false;
    setTablePanel(panel);
  }

  useEffect(() => {
    tablePanel.render('surveyVisPanel');

    return () => {
      if (document.getElementById('surveyVisPanel')) {
        document.getElementById('surveyVisPanel').innerHTML = '';
        document.getElementById('surveyVisPanel').style.overflowY = 'auto';
      }
    };
  }, [tablePanel]);

  return (
    <>
      <div id="surveyVisPanel" />
    </>
  );
}
