import React from 'react';
import useTranslation from 'next-translate/useTranslation';

const CreditNoClient = (props) => {
  const { t } = useTranslation('loan');

  return (
    <div
      style={{
        maxWidth: '504px',
        margin: 'auto',
      }}
    >
      <div className="credit-container-top noclient">
        <div className="tab-container-top">
          <div className="tab-top">
            <h3>{t('loan.title')}</h3>
          </div>
          <div className="form-top-title">
            <h6>{t('loan.descreption')}</h6>
          </div>
        </div>
        <div className="tw-client-middle">
          <div className="parent-div">
            <div className="inner-div">
              <div className="tw-middle-img">
                <img src="/icon-danger.svg" />
              </div>
            </div>
          </div>
          <div className="tw-middle-title">
            <h4>{t('loan.contract-text')}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditNoClient;
