import React from 'react';
import classes from './SettingsTab.module.css';
import SurveyDistributionCardTemplate from '../UI/SurveyDistributionCardTemplate';
import SurveySettingsCalendar from './SurveySettings/SurveySettingsCalendar';
import SurveySettingsFolder from './SurveySettings/SurveySettingsFolder';
import FoldersContextProvider from '../../context/folders-context/folders-context';

export default class SettingsTab extends React.Component {
  render() {
    return (
      <FoldersContextProvider>
        <div className={classes['settings__container']}>
          <SurveyDistributionCardTemplate>
            <SurveySettingsCalendar />
          </SurveyDistributionCardTemplate>
          <SurveyDistributionCardTemplate>
            <SurveySettingsFolder />
          </SurveyDistributionCardTemplate>
        </div>
      </FoldersContextProvider>
    );
  }
}
