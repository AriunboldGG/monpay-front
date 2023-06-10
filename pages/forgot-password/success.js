import { Button, Row, Col, Container } from 'react-bootstrap';
import React from 'react';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import LanguageChange from 'components/language-change';
import useTranslation from 'next-translate/useTranslation';

const PasswordSuccess = (props) => {
  const router = useRouter();
  const { t } = useTranslation('forgot-password');

  React.useEffect(() => {
    const phoneNumber = jsCookie.get('phone');
    if (!!!phoneNumber) return router.push('/forgot-password');
  }, []);

  const handleRoute = () => {
    jsCookie.remove('phone');
    router.push('/login');
  };

  return (
    <Container className="register-confirm" fluid>
      <Row className="tw-form">
        <Col
          className="tw-image-section d-none d-xl-flex"
          style={{
            backgroundImage: `url("/image-section-background.png")`,
          }}
          xl={7}
          xxl={7}
        >
          <div className="big-image">
            <img className="monpay-logo" src="/monpay-logo-formm.svg" />
            <div className="image-stack">
              <img className="big-image" src="/login-4-images.png" />
              <img className="get-apps" src="/get-apps.svg" />
            </div>
          </div>
        </Col>
        <Col className="tw-login-form register-success" xl={5} xxl={5} xs={12}>
          <LanguageChange />
          <div className="content">
            <div className="tw-logo-title">
              <img src="/monpay-logo-form.svg" />
            </div>
            <div className="icon-out">
              <div className="icon-inner">
                <img src="/register-icon-success.svg" />
              </div>
            </div>
            <div className="title-desc">
              <span className="top-title">{t('success')}!</span>
              <div className="message">
                <span>{t('desc')}</span>
              </div>
            </div>
          </div>
          <Row>
            <Col>
              <div className="tw-form-buttons">
                <div className="tw-top-button">
                  <Button onClick={handleRoute}>{t('login')}</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordSuccess;
