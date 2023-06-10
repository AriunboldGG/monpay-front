import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import Link from 'next/link';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import { getRegistrationPin } from 'pages/registration';
import FailNotification from 'components/notification/fail-notif';
import LanguageChange from 'components/language-change';
import useTranslation from 'next-translate/useTranslation';

const ForgotPassword = (props) => {
  const [alert, setAlert] = useState({ show: false });
  const [validated, setValidated] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('forgot-password');

  const closeNotification = () => {
    setAlert(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setValidated(true);
      const phoneNumber = form.number.value;
      const registerNo = form.registerNo.value;
      const resp = await getRegistrationPin(phoneNumber, false, registerNo);
      if (resp.error) {
        setAlert({
          show: true,
          message: resp.error,
        });
        event.stopPropagation();
        return;
      }
      jsCookie.set('phone', phoneNumber);
      router.push('/forgot-password/confirm');
    }
    setValidated(true);
  };

  return (
    <Container fluid>
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
        <Col className="tw-login-form forgot-password" xl={5} xxl={5} xs={12}>
          <LanguageChange />
          <div className="tw-logo-title">
            <img src="/monpay-logo-form.svg" />
            <div className="tw-form-title">
              <span>{t('password-recover')}</span>
            </div>
          </div>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group>
              <InputGroup hasValidation>
                <Form.Control
                  required
                  name="number"
                  type="number email"
                  className="tw-input"
                  placeholder={t('phone-number')}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {t('phone-number')}.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group style={{ paddingTop: '12px' }}>
              <InputGroup hasValidation>
                <Form.Control
                  required
                  name="registerNo"
                  type="text"
                  placeholder={t('register')}
                  autoComplete="off"
                  className="tw-input"
                  maxLength={6}
                />
                <Form.Control.Feedback type="invalid">
                  {t('enter-register')}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <div className="tw-form-buttons">
              <div className="tw-top-button">
                <Button type="submit">{t('send-code')}</Button>
              </div>
              <div className="tw-bottom-button">
                <Link href="/login">
                  <Button>{t('back')}</Button>
                </Link>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
      {alert?.show && (
        <FailNotification
          show={alert.show}
          infos={alert.message}
          close={closeNotification}
        ></FailNotification>
      )}
    </Container>
  );
};

export default ForgotPassword;
