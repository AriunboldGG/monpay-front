import React from 'react';
import useTranslation from 'next-translate/useTranslation';

const NotFound = (props) => {
  const { t, lang } = useTranslation('common');
  return (
    <section className="tw-row">
      <div className="container">
        <div className="row">
          <div className="tw-column col">
            <div className="tw-404 text-center">
              <h1>404</h1>
              <h5>{t('page-404-text')}</h5>
              <a
                className="tw-element tw-button tw-button-red"
                href="/"
                target="_self"
                title={t('page-404-link')}
              >
                <span>{t('page-404-link-text')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default NotFound;
