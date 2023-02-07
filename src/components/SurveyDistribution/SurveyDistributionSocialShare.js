import React from "react";
import { SiInstagram, SiFacebook, SiWhatsapp } from "react-icons/si";
import { ImTwitter } from "react-icons/im";
import classes from "./SurveyDistributionSocialShare.module.css";

const SurveyDistributionSocialShare = () => {
  return (
    <div className={classes.container}>
      <h3>Rețele de socializare</h3>
      <div className={classes.social}>
        <SiInstagram />
        <SiFacebook />
        <ImTwitter />
        <SiWhatsapp />
      </div>
    </div>
  );
};

export default SurveyDistributionSocialShare;
