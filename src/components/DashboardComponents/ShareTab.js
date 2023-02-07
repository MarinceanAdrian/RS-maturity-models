import React from 'react';
import SurveyDistributionCardTemplate from '../UI/SurveyDistributionCardTemplate';
import classes from './ShareTab.module.css';
import SurveyDistributionPublish from '../SurveyDistribution/SurveyDistributionPublish';
import SurveyDistributionSocialShare from '../SurveyDistribution/SurveyDistributionSocialShare';
import SurveyDistributionQR from '../SurveyDistribution/SurveyDistributionQR';

export default class ShareTab extends React.Component {
  state = {
    locationURL: window.location.href,
  };
  render() {
    return (
      <div className={classes['share-tab__container']}>
        <SurveyDistributionCardTemplate gridArea="a">
          <SurveyDistributionPublish
            creatorJSON={this.props.creator.JSON}
            locationURL={this.state.locationURL}
          />
        </SurveyDistributionCardTemplate>
        <SurveyDistributionCardTemplate gridArea="b">
          <SurveyDistributionSocialShare />
        </SurveyDistributionCardTemplate>
        <SurveyDistributionCardTemplate gridArea="c">
          <SurveyDistributionQR locationURL={this.state.locationURL} />
        </SurveyDistributionCardTemplate>
      </div>
    );
  }
}
