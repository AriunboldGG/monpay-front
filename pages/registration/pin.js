import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { React, useContext } from 'react';
import Link from 'next/link';
import { AutoTabProvider } from 'react-auto-tab';
import LanguageChange from 'components/language-change';
import useTranslation from 'next-translate/useTranslation';
import axios from 'axios';
import IctContext from 'context/ict-context';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';

const RegisterSetPin = () => {
  const { t } = useTranslation('registration');
  const { user } = useContext(IctContext);
  const router = useRouter();

  const handleSubmit = (event) => {
    const form = event.target;
    if (form.checkValidity() === false) {
      event.preventDefault();
    } else {
      event.preventDefault();
      const pin = `${form.code1.value}${form.code2.value}${form.code3.value}${form.code4.value}`;
      const body = {
        firstPin: true,
        newpin: pin,
        oldpin: '',
      };
      axios.post('/api/pin/set-new', body).then((resp) => {
        //Add some logic
        jsCookie.set('passwordToken', resp.data.token);
        router.push('/registration/success');
      });
    }
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
        <Col className="tw-login-form pin-code-confirm" xl={5} xxl={5} xs={12}>
          <LanguageChange />
          <div className="tw-logo-title">
            <img src="/monpay-logo-form.svg" />
            <div className="tw-form-title">
              <span> {t('trans-pin')}</span>
              <p>{t('trans-pin-set')}</p>
            </div>
          </div>
          <Form className="tw-register set-pin-code" onSubmit={handleSubmit}>
            <div className="new-pin-code">
              <span> {t('new-pin-code')}</span>
            </div>
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
                        onKeyPress={(event) => {
                          if (isNaN(event.key)) event.preventDefault();
                        }}
                        autoComplete="off"
                        inputMode="numeric"
                        tabbable="true"
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
                        onKeyPress={(event) => {
                          if (isNaN(event.key)) event.preventDefault();
                        }}
                        autoComplete="off"
                        inputMode="numeric"
                        tabbable="true"
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
                        onKeyPress={(event) => {
                          if (isNaN(event.key)) event.preventDefault();
                        }}
                        autoComplete="off"
                        inputMode="numeric"
                        tabbable="true"
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
                        onKeyPress={(event) => {
                          if (isNaN(event.key)) event.preventDefault();
                        }}
                        autoComplete="off"
                        inputMode="numeric"
                        tabbable="true"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </AutoTabProvider>
            <Row>
              <Col>
                <div className="tw-form-buttons">
                  <div className="tw-top-button">
                    <Button type="submit">{t('confirm')}</Button>
                  </div>
                  <div className="tw-bottom-button">
                    <Link href="/login">
                      <Button type="submit">{t('back')}</Button>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterSetPin;
