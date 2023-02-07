import React, { useContext } from 'react';
import QRCode from 'qrcode.react';
import Button from '../UI/Button';
import classes from './SurveyDistributionQR.module.css';
import { DistributionContext } from '../../context/distribution-context/distribution-context';

const SurveyDistributionQR = ({ locationURL }) => {
  const { isPublic } = useContext(DistributionContext);

  const qrCodeText = isPublic ? locationURL : ''


  const downloadQRCode = () => {
    const qrCodeURL = document
      .getElementById('qrCodeEl')
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    let aEl = document.createElement('a');
    aEl.href = qrCodeURL;
    aEl.download = 'QR_Code.png';
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
  };
  return (
    <div className={classes.container}>
      <h3>Cod QR</h3>
      <div>
        <QRCode
          id="qrCodeEl"
          size={150}
          value={qrCodeText}
          className={classes['qr-container']}
          style={{ width: '10rem' }}
        />
      </div>
      <Button clickHandler={downloadQRCode}>Descărcați codul QR</Button>
    </div>
  );
};

export default SurveyDistributionQR;
