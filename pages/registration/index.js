import React, { useState } from 'react';
import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isLoggedIn } from 'lib/auth';
import axios from 'axios';
import jsCookie from 'js-cookie';
import FailNotification from 'components/notification/fail-notif';
import LanguageChange from 'components/language-change';
import useTranslation from 'next-translate/useTranslation';

export const getRegistrationPin = async (phoneNumber, isNew, registerNo) => {
  const body = { phoneNumber, isNew, registerNo };
  return await axios.post('/api/registration/get-pin', body).then(
    (resp) => {
      return resp;
    },
    (error) => {
      return { error: error.response?.data?.info };
    }
  );
};

const Register = (props) => {
  const { t } = useTranslation('registration');
  const [validated, setValidated] = useState(false);
  const [alert, setAlert] = useState({ show: false });
  const [phoneNumber, setPhoneNumber] = useState('');

  const router = useRouter();

  const closeNotification = () => {
    setAlert(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity() === false) {
      setValidated(false);
    } else {
      setValidated(true);
      const phoneNumber = form.phonenumber.value;
      const resp = await getRegistrationPin(phoneNumber, true);
      if (resp.error) {
        setAlert({
          show: true,
          message: resp.error,
        });
        event.stopPropagation();
        return;
      }

      jsCookie.set('phone', phoneNumber);
      router.push('/registration/confirm');
    }
    setValidated(true);
  };

  if (isLoggedIn()) {
    return null;
  } else {
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
          <Col className="tw-login-form" xl={5} xxl={5} xs={12}>
            <LanguageChange />
            <div className="tw-logo-title">
              <img src="/monpay-logo-form.svg" />
              <div className="tw-form-title">
                <span>{t('new-user')}</span>
              </div>
            </div>
            <Form
              className="tw-register"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend"></InputGroup.Text>
                <Form.Control
                  required
                  name="phonenumber"
                  type="text"
                  className="tw-input tw-phone"
                  placeholder={t('phone-number')}
                  onKeyPress={(event) => {
                    if (isNaN(event.key)) event.preventDefault();
                  }}
                  maxlength="8"
                  pattern="[1-9]{1}[0-9]{7}"
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {t('validation')}
                </Form.Control.Feedback>
              </InputGroup>
              <div className="tw-form-buttons">
                <div className="tw-top-button">
                  <Button type="submit">{t('send-code')}</Button>
                </div>
                <div className="tw-bottom-button">
                  <Link href="/login">
                    <Button type="submit">{t('login')}</Button>
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
  }
};

export default Register;
