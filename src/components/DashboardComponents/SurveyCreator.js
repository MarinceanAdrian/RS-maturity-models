import { useState, useCallback, useEffect } from 'react';
import React from 'react';
import { SurveyCreatorComponent, SurveyCreator } from 'survey-creator-react';
import 'survey-core/defaultV2.css';
import 'survey-creator-core/survey-creator-core.css';
import 'survey-core/survey.i18n.js';
import 'survey-creator-core/survey-creator-core.i18n.js';
import { ReactElementFactory } from 'survey-react-ui';
import AnalyticsTab from './AnalyticsTab';

import { localization } from 'survey-creator-core';

import './romanian.ts';
import './SurveyCreator.css';
import { useParams } from 'react-router-dom';
import useFirestoreSurveys from '../../hooks/useFirestore/useFirestoreSurveys';
import BackButton from '../UI/BackButton';
import ShareTab from './ShareTab';
import SettingsTab from './SettingsTab';
import { useContext } from 'react';
import { DistributionContext } from '../../context/distribution-context/distribution-context';
import ExportTab from './ExportTab';

// ...
// Activate the custom locale
localization.currentLocale = 'ro';

ReactElementFactory.Instance.registerElement('svc-tab-template', (props) => {
  return React.createElement(AnalyticsTab, props);
});

ReactElementFactory.Instance.registerElement('svc-tab-settings', (props) => {
  return React.createElement(SettingsTab, props);
});

ReactElementFactory.Instance.registerElement('svc-tab-share', (props) => {
  return React.createElement(ShareTab, props);
});

export default function SurveyCreatorWidget(props) {
  const { id } = useParams();

  let [creator, setCreator] = useState();
  const [json, setJson] = useState(props.json);
  const [surveyId, setSurveyId] = useState(id || null);
  const [surveyResponses, setSurveyReponses] = useState([]);
  const [surveyTitle, setSurveyTitle] = useState(null);

  const { getSurveys, updateSurveyDataInFirestore, getResponsesForSurvey, getSurveyTitle } =
    useFirestoreSurveys();

  const { isPublic } = useContext(DistributionContext);

  // check if there is an existing survey in firestore
  // and load the json data from firestore if so
  // else the blank json will be loaded
  const fetchSurveyData = useCallback(async () => {
    try {
      await getSurveys(setJson, surveyId);
      const data = await getResponsesForSurvey(surveyId);
      setSurveyReponses(data);
    } catch (err) {
      console.log('err', err);
    }
  }, []);

  const fetchSurveyTitle = useCallback(async () => {
    try {
      setSurveyTitle(await getSurveyTitle(surveyId));
    } catch (err) {
      console.log('err', err);
    }
  }, []);

  ReactElementFactory.Instance.registerElement('svc-tab-template', (props) => {
    return React.createElement(AnalyticsTab, { ...props, surveyResponses });
  });

  ReactElementFactory.Instance.registerElement('svc-tab-export', (props) => {
    return React.createElement(ExportTab, { ...props, surveyResponses });
  });

  useEffect(() => {
    if (document.querySelector('#svd-settings')) {
      document.querySelector('#svd-settings').remove();
      document.querySelector('#svd-grid-expand').remove();
    }

    if (document.querySelector('.svc-full-container')) {
      document.querySelector('.svc-creator__banner').style.display = 'none';
      document.querySelector('.svc-full-container').style.height = '110%';
    }

    if (surveyId) {
      fetchSurveyData();
      fetchSurveyTitle();
    }

    // every time this C unmounts clear the localstorage survey slice
    return () => {
      localStorage.removeItem('currentSurveyDocId');
    };
  }, []);

  if (creator === undefined) {
    let options = {
      showTranslationTab: false,
      showPropertyGrid: false,
      hideAdvancedSettings: false,
      showSidebar: false,
      showSidebarValue: false,
      questionTypes: [
        'text',
        'checkbox',
        'radiogroup',
        'dropdown',
        'boolean',
        'ranking',
        'tagbox',
        'comment',
        'multipletext',
      ],
      showJSONEditorTab: false,
    };

    //create the SurveyJS Creator and render it in div with id equals to "creatorElement"
    // creator = new SurveyCreator.SurveyCreator("creatorElement", options);
    creator = new SurveyCreator(options);

    creator.saveSurveyFunc = async (no, callback) => {
      // You can store in your database JSON as text: creator.text  or as JSON: creator.JSON

      // updateCurrentSurveyInFirestore
      await updateSurveyDataInFirestore({
        JSONData: { isPublic, ...creator.JSON },
        surveyId,
      });

      // also create the templates from here - ADMIN only
      // createTemplateSurveys(creator.JSON)
      props.onSave();
      callback(no, true);
    };

    let templatesPlugin = {
      activate: () => {},
      deactivate: () => {
        return true;
      },
    };
    //Add plug-in. We do nothing on activate/deactivate. Place it as first tab and set to "svc-tab-template" the component name
    creator.addPluginTab('templates4', templatesPlugin, 'Export', 'svc-tab-export', 0);

    creator.addPluginTab('templates1', templatesPlugin, 'Raport', 'svc-tab-template', 0);
    creator.addPluginTab('templates2', templatesPlugin, 'Setari', 'svc-tab-settings', 0);

    creator.addPluginTab('templates3', templatesPlugin, 'Distribuie', 'svc-tab-share', 0);

    for (let i = 0; i < 4; i++) {
      var tab = creator.tabs.shift();
      creator.tabs.push(tab);
    }

    setCreator(creator);
  }

  creator.JSON = json;

  return (
    <div style={{ height: '100vh' }}>
      <section className="survey-creator__header-section">
        <BackButton surveyCreatorPage={true} />
        <h1>{surveyTitle}</h1>
      </section>
      <SurveyCreatorComponent creator={creator} />
    </div>
  );
}
