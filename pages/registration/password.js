import { Form, Button, Row, Col, Container, InputGroup } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import MustContainItem from './must-contain-item';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import axios from 'axios';
import FailNotification from 'components/notification/fail-notif';
import LanguageChange from 'components/language-change';
import useTranslation from 'next-translate/useTranslation';

const RegisterSetPassword = (props) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [alert, setAlert] = useState({ show: false });
  const [validated, setValidated] = useState(false);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [phoneNumber, setPhoneNumber] = useState();
  const [token, setToken] = useState();
  const [containsUL, setContainsUL] = useState(false); // Том үсэг оруулах
  const [containsLL, setContainsLL] = useState(false); // Жижиг үсэг оруулах
  const [containsN, setContainsN] = useState(false); // Тоон тэмдэгт оруулах
  const [contains8C, setContains8C] = useState(false); // Хамгийн багадаа 8 тэмдэгт оруулах
  const [passwordMatch, setPasswordMatch] = useState(false); // passwords таарах
  const [allValid, setAllValid] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('registration');

  useEffect(() => {
    const phoneNumber = jsCookie.get('phone');
    const token = jsCookie.get('passwordToken');
    if (!!!phoneNumber) return router.push('/registration');
    if (!!!token) return router.push('/registration/confirm');
    setPhoneNumber(phoneNumber);
    setToken(token);
    validatePassword();
  }, [
    password1,
    password2,
    containsUL,
    containsLL,
    containsN,
    contains8C,
    passwordMatch,
  ]);

  const mustContainData = [
    [t('enter-capital'), containsUL],
    [t('enter-lower'), containsLL],
    [t('enter-numeric'), containsN],
    [t('enter-atleast'), contains8C],
  ];

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const validatePassword = () => {
    // has uppercase letter
    if (password1.toLowerCase() != password1) setContainsUL(true);
    else setContainsUL(false);

    // has lowercase letter
    if (password1.toUpperCase() != password1) setContainsLL(true);
    else setContainsLL(false);

    // has number
    if (/\d/.test(password1)) setContainsN(true);
    else setContainsN(false);

    // has 8 characters
    if (password1.length >= 8) setContains8C(true);
    else setContains8C(false);

    // passwords match
    if (password1 !== '' && password1 === password2) setPasswordMatch(true);
    else setPasswordMatch(false);

    // all validations passed
    if (containsUL && containsLL && containsN && contains8C && passwordMatch)
      setAllValid(true);
    else setAllValid(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const password = form.password.value;
    if (form.checkValidity() === false || !allValid) {
      event.preventDefault();
    } else {
      const phone = phoneNumber;
      const body = {
        phone: phone,
        token: token,
        password: password,
        token: token,
      };

      axios.post('/api/registration/set-password', body).then(
        (resp) => {
          jsCookie.remove('passwordToken');
          router.push('/registration/success');
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

  const closeNotification = () => {
    setAlert(null);
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
        <Col className="tw-login-form p-0" xl={5} xxl={5} xs={12}>
          <LanguageChange />
          <div className="tw-logo-title">
            <img src="/monpay-logo-form.svg" />
            <div className="tw-form-title">
              <span>{t('create-password')}</span>
            </div>
          </div>
          <Form
            className="tw-register-set-password"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Form.Group>
              <InputGroup hasValidation>
                <InputGroup.Text
                  className="password"
                  id="inputGroupPrepend"
                ></InputGroup.Text>
                <Form.Control
                  name="password"
                  type={passwordShown ? 'text' : 'password'}
                  className="tw-input tw-password"
                  placeholder="Нууц үгээ оруулах"
                  value={password1}
                  onChange={(e) => {
                    setPassword1(e.target.value);
                  }}
                />
                <span className="icon-on-off" onClick={togglePasswordVisiblity}>
                  <img src="/icon-off.svg" />
                </span>
                <Form.Control.Feedback type="invalid">
                  {t('enter-password')}!
                </Form.Control.Feedback>
              </InputGroup>
              <InputGroup hasValidation>
                <InputGroup.Text
                  className="password"
                  id="inputGroupPrepend"
                ></InputGroup.Text>
                <Form.Control
                  type={passwordShown ? 'text' : 'password'}
                  className="tw-input tw-password"
                  placeholder="Нууц үгээ давтан оруулах"
                  value={password2}
                  onChange={(e) => {
                    setPassword2(e.target.value);
                  }}
                />
                <span className="icon-on-off" onClick={togglePasswordVisiblity}>
                  <img src="/icon-off.svg" />
                </span>
                <Form.Control.Feedback type="invalid">
                  {t('repeat-password')}!
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <div className="requirement-text">
              {mustContainData.map((data, i) => (
                <MustContainItem data={data} key={i} />
              ))}
            </div>
            <Row>
              <Col>
                <div className="tw-form-buttons">
                  <div className="tw-top-button">
                    <Button type="submit" disabled={!allValid}>
                      {t('save')}
                    </Button>
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

export default RegisterSetPassword;
