import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AutoTabProvider } from 'react-auto-tab';
import FailNotification from 'components/notification/fail-notif';
import { getRegistrationPin } from '.';
import LanguageChange from 'components/language-change';
import useTranslation from 'next-translate/useTranslation';
import IctContext from 'context/ict-context';

const RegisterConfirm = (props) => {
  const { t } = useTranslation('registration');
  const [alert, setAlert] = useState({ show: false });
  const [counter, setCounter] = React.useState(60);
  const [phoneNumber, setPhoneNumber] = useState();
  const [phoneMasked, setPhoneMasked] = useState();
  const router = useRouter();
  const {} = useContext(IctContext);

  React.useEffect(() => {
    const phoneNumber = jsCookie.get('phone');
    if (!!!phoneNumber) return router.push('/registration');

    const masked =
      phoneNumber.length > 4
        ? phoneNumber.substring(0, 2) + '***' + phoneNumber.substring(5)
        : phoneNumber;

    setPhoneNumber(phoneNumber);
    setPhoneMasked(masked);
  }, []);

  React.useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity()) {
      const pin = `${form.code1.value}${form.code2.value}${form.code3.value}${form.code4.value}`;
      const body = { phoneNumber, pin, isNew: true };
      axios.post('/api/registration/confirm-pin', body).then(
        (resp) => {
          jsCookie.set('passwordToken', resp.data.token);
          router.push('/registration/password');
        },
        (error) => {
          setAlert({
            show: true,
            message: error.response?.data?.info,
          });
          event.stopPropagation();
        }
      );
    }
  };

  const handleEnter = (event) => {
    if (event.key.toLowerCase() === 'enter') {
      const form = event.target.form;
      const index = [...form].indexOf(event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  };

  const closeNotification = () => {
    setAlert(null);
  };

  const retryPin = async () => {
    const result = await getRegistrationPin(phoneNumber, true);
    if (result.error) {
      setAlert({
        show: true,
        message: result.error,
      });
      return;
    }
    setCounter(60);
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
        <Col className="tw-login-form" xl={5} xxl={5} xs={12}>
          <LanguageChange />
          <div className="tw-logo-title">
            <img src="/monpay-logo-form.svg" />
            <div className="tw-form-title">
              <span>{t('code')}</span>
              <p>
                {t('desc')} <strong>{phoneMasked}</strong>
              </p>
            </div>
          </div>
          <Form className="tw-register" onSubmit={handleSubmit}>
            <AutoTabProvider>
              <div>
                <ul>
                  <li>
                    <div className="input-item">
                      <Form.Control
                        name="code1"
                        type="password"
                        className="confirm-input"
                        maxLength={1}
                        required
                        tabbable="true"
                        onKeyDown={handleEnter}
                        onKeyPress={(event) => {
                          if (isNaN(event.key)) event.preventDefault();
                        }}
                        autoComplete="off"
                        inputMode="numeric"
                      />
                    </div>
                  </li>
                  <li>
                    <div className="input-item">
                      <Form.Control
                        name="code2"
                        type="password"
                        className="confirm-input"
                        maxLength={1}
                        required
                        tabbable="true"
                        onKeyDown={handleEnter}
                        onKeyPress={(event) => {
                          if (isNaN(event.key)) event.preventDefault();
                        }}
                        autoComplete="off"
                        inputMode="numeric"
                      />
                    </div>
                  </li>
                  <li>
                    <div className="input-item">
                      <Form.Control
                        name="code3"
                        type="password"
                        className="confirm-input"
                        maxLength={1}
                        required
                        tabbable="true"
                        onKeyDown={handleEnter}
                        onKeyPress={(event) => {
                          if (isNaN(event.key)) event.preventDefault();
                        }}
                        autoComplete="off"
                        inputMode="numeric"
                      />
                    </div>
                  </li>
                  <li>
                    <div className="input-item">
                      <Form.Control
                        name="code4"
                        type="password"
                        className="confirm-input"
                        maxLength={1}
                        required
                        tabbable="true"
                        onKeyDown={handleEnter}
                        onKeyPress={(event) => {
                          if (isNaN(event.key)) event.preventDefault();
                        }}
                        autoComplete="off"
                        inputMode="numeric"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </AutoTabProvider>
            <div className="timer">
              {counter === 0 ? (
                <span className="timer-text" onClick={retryPin}>
                  {t('get-code-again')}
                </span>
              ) : (
                <span className="timer-number">
                  00:{counter < 10 ? '0' : ''}
                  {counter}
                </span>
              )}
            </div>
            <Row>
              <Col>
                <div className="tw-form-buttons">
                  <div className="tw-top-button">
                    <Button type="submit">{t('confirm')}</Button>
                  </div>
                  <div className="tw-bottom-button">
                    <Link href="/registration">
                      <Button type="submit">{t('back')}</Button>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
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

export default RegisterConfirm;
