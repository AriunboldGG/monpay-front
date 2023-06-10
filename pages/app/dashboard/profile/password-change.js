import Sidebar from 'components/sidebar/control';
import React, { useState, useContext, useEffect } from 'react';
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  InputGroup,
  Modal,
} from 'react-bootstrap';
import Topbar from 'components/topbar';
import SidebarUserProfile from 'components/sidebar/profile';
import MustContainItem from '../../../registration/must-contain-item';
import IctContext from 'context/ict-context';
import { AutoTabProvider } from 'react-auto-tab';
import axios from 'axios';
import { useRouter } from 'next/router';
import FailNotification from 'components/notification/fail-notif';
import Notification from 'components/notification/index';
import useTranslation from 'next-translate/useTranslation';
import { getFullInfo } from 'service/user';

const ProfileChangePass = (props) => {
  const { t } = useTranslation('profile');
  const [alert, setAlert] = useState({ show: false });
  const [notification, setNotification] = useState({ show: false });
  const [otp1, setOtp1] = useState('');
  const [otp2, setOtp2] = useState('');
  const [otp3, setOtp3] = useState('');
  const [otp4, setOtp4] = useState('');
  const otp = `${otp1}${otp2}${otp3}${otp4}`;
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const [validated, setValidated] = useState(false);
  const [register, setRegister] = useState('');
  const [password, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const { info, setUserInfo, setLogout } = useContext(IctContext);
  const [counter, setCounter] = useState(60);
  const [timer, setTimer] = useState(null);
  const [response, setResponse] = useState({});

  const [containsUL, setContainsUL] = useState(false); // Том үсэг оруулах
  const [containsLL, setContainsLL] = useState(false); // Жижиг үсэг оруулах
  const [containsN, setContainsN] = useState(false); // Тоон тэмдэгт оруулах
  const [contains8C, setContains8C] = useState(false); // Хамгийн багадаа 8 тэмдэгт оруулах
  const [passwordMatch, setPasswordMatch] = useState(false); // passwords таарах
  const [allValid, setAllValid] = useState(false);
  const [falseTrue, setfalseTrue] = useState(false);

  useEffect(() => {
    if (info) return;
    getFullInfo().then(
      (resp) => {
        if (resp) {
          setUserInfo(resp);
        }
      },
      (error) => {
        if (error && error.status === 401) {
          setLogout();
        }
      }
    );
  }, []);

  const passwordSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false || !allValid) {
      event.stopPropagation();
    } else {
      event.stopPropagation();
      if (password === password2) {
        const body = {
          otp: otp,
          phone: info?.phone,
          newpassword: password,
        };
        axios.post('/api/password/set-pass', body).then(
          (respToken) => {
            setResponse({ ...respToken.data.info, success: true });
            setShowModal(true);
            setPassword2('');
            setPassword1('');
          },
          (error) => {
            if (error.response.data.info) {
              setShowModal(true);
              setResponse({
                ...error.response?.data,
                success: false,
              });
            }
            event.stopPropagation();
          }
        );
      } else {
        setAlert({
          show: true,
          message: 'passwoard not defined',
        });
      }
    }
  };
  const handleModal = () => {
    setShowModal(false);
    if (response.success) {
      router.push('/app/dashboard');
    }

    // router.push('/app/dashboard/account/transfer?type=candy');
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      event.stopPropagation();
      otpFunction();
    }
    setValidated(true);
  };
  const otpFunction = () => {
    const body = { register: register, phone: info?.phone };
    axios.post('/api/password/get-otp', body).then(
      (resp) => {
        setNotification({
          show: true,
          message: resp.data.info,
        });
        setShow(true);
        count();
        setfalseTrue(false);
      },
      (error) => {
        setAlert({
          show: true,
          message: error.response?.data?.info,
        });
        event.stopPropagation();
      }
    );
  };

  const closeNotification = () => {
    setNotification(null);
  };
  const closeFailNotification = () => {
    setAlert(null);
  };

  const validatePassword = () => {
    let containsULTemp = false;
    let containsLLTemp = false;
    let containsNTemp = false;
    let contains8CTemp = false;
    let passwordMatchTemp = false;
    // has uppercase letter
    if (password.toLowerCase() != password) {
      containsULTemp = true;
      setContainsUL(true);
    } else setContainsUL(false);

    // has lowercase letter
    if (password.toUpperCase() != password) {
      containsLLTemp = true;
      setContainsLL(true);
    } else setContainsLL(false);

    // has number
    if (/\d/.test(password)) {
      containsNTemp = true;
      setContainsN(true);
    } else setContainsN(false);

    // has 8 characters
    if (password.length >= 8) {
      contains8CTemp = true;
      setContains8C(true);
    } else setContains8C(false);

    // passwords match
    if (password !== '' && password === password2) {
      passwordMatchTemp = true;
      setPasswordMatch(true);
    } else setPasswordMatch(false);

    // all validations passed
    if (
      containsULTemp &&
      containsLLTemp &&
      containsNTemp &&
      contains8CTemp &&
      passwordMatchTemp
    )
      setAllValid(true);
    else setAllValid(false);
  };

  const mustContainData = [
    [t('enter-capital'), containsUL],
    [t('enter-lower'), containsLL],
    [t('enter-numeric'), containsN],
    [t('enter-atleast'), contains8C],
  ];

  const retryPin = async () => {
    otpFunction();
    // setfalseTrue(true);
    setCounter(60);
    // const result = await handleSubmit;
    // handleSubmit;
    // if (result.error) {
    //     setAlert({
    //         show: true,
    //         message: result.error,
    //     });
    //     return;
    // }
    // setCounter(60);
  };

  const count = () => {
    let timer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    setTimer(timer);
  };

  useEffect(() => {
    if (Number(counter) == 0) {
      clearInterval(timer);
    }
  }, [counter]);

  const registerChecker = (val) => {
    if (val.value.length === 6) {
      setRegister(val.value);
      setfalseTrue(true);
    } else {
      setfalseTrue(false);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col lg={10} className="dashboard-right-side">
          <Row className="tw-contact-border-line">
            <Col className="p-0">
              <Topbar name={t('settings')} logo="/icon-setting-topbar.svg" />
            </Col>
          </Row>
          <Row className="wrapper-row">
            <div
              style={{
                maxWidth: '768px',
                margin: 'auto',
                padding: '0',
              }}
            >
              <Row>
                <Col xs={12} lg={4}>
                  <SidebarUserProfile />
                </Col>
                <Col xs={12} lg={8} className="personal-email password-change">
                  <div className="content">
                    <div className="title">
                      <span>{t('passwrd-change')}</span>
                    </div>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                      className="personal-form tw-user-form"
                    >
                      <div className="input-outside">
                        <div className="input">
                          <div className="label-title">
                            <h5>{t('crrnt-phone')}</h5>
                          </div>
                          <div className="input-item person-name">
                            <span>{info?.phone}</span>
                          </div>
                        </div>
                        {info && info.profileRegistration == 'COMPLETE' && (
                          <div className="input">
                            <div className="label-title">
                              <h5
                                style={{
                                  marginTop: '12px',
                                }}
                              >
                                {t('register-last')}
                              </h5>
                            </div>
                            <div className="input-item">
                              <InputGroup hasValidation>
                                <Form.Control
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => registerChecker(e.target)}
                                  type="text"
                                  placeholder={t('register-last')}
                                  onKeyPress={(event) => {
                                    if (isNaN(event.key))
                                      event.preventDefault();
                                  }}
                                  autoComplete="off"
                                  maxLength={6}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {t('register-last')}
                                </Form.Control.Feedback>
                              </InputGroup>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="tw-single-button">
                        <Button type="submit" disabled={!falseTrue}>
                          {t('get-verif-code')}
                        </Button>
                      </div>
                    </Form>
                    <Form
                      noValidate
                      onSubmit={passwordSubmit}
                      className="email-confirm-code"
                    >
                      <div className="label-title">
                        <h5>{t('enter-verif')}</h5>
                      </div>
                      <AutoTabProvider>
                        <div>
                          <ul>
                            <li>
                              <div className="input-item">
                                <Form.Control
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => setOtp1(e.target.value)}
                                  onKeyPress={(event) => {
                                    if (isNaN(event.key))
                                      event.preventDefault();
                                  }}
                                  autoComplete="off"
                                  className="confirm-input"
                                  type="password"
                                  maxLength={1}
                                  tabbable="true"
                                />
                              </div>
                            </li>
                            <li>
                              <div className="input-item">
                                <Form.Control
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => setOtp2(e.target.value)}
                                  onKeyPress={(event) => {
                                    if (isNaN(event.key))
                                      event.preventDefault();
                                  }}
                                  autoComplete="off"
                                  className="confirm-input"
                                  type="password"
                                  maxLength={1}
                                  tabbable="true"
                                />
                              </div>
                            </li>
                            <li>
                              <div className="input-item">
                                <Form.Control
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => setOtp3(e.target.value)}
                                  onKeyPress={(event) => {
                                    if (isNaN(event.key))
                                      event.preventDefault();
                                  }}
                                  autoComplete="off"
                                  className="confirm-input"
                                  type="password"
                                  maxLength={1}
                                  tabbable="true"
                                />
                              </div>
                            </li>
                            <li>
                              <div className="input-item">
                                <Form.Control
                                  onWheel={(e) => e.target.blur()}
                                  onChange={(e) => setOtp4(e.target.value)}
                                  onKeyPress={(event) => {
                                    if (isNaN(event.key))
                                      event.preventDefault();
                                  }}
                                  autoComplete="off"
                                  className="confirm-input"
                                  type="password"
                                  maxLength={1}
                                  tabbable="true"
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </AutoTabProvider>
                      <div className="timer">
                        {show &&
                          (counter === 0 ? (
                            <span className="timer-text" onClick={retryPin}>
                              {t('get-verif-code')}
                            </span>
                          ) : (
                            <span className="timer-number">
                              00:
                              {counter < 10 ? '0' : ''}
                              {counter}
                            </span>
                          ))}
                      </div>
                    </Form>
                    <Form
                      className="tw-register-set-password profile-set-password"
                      noValidate
                      validated={validated}
                      onSubmit={passwordSubmit}
                    >
                      <Form.Group>
                        <div className="label-title">
                          <h5>{t('new-pass')}</h5>
                        </div>
                        <InputGroup hasValidation>
                          <Form.Control
                            type={passwordShown ? 'text' : 'password'}
                            className="tw-input tw-password"
                            placeholder="Нууц үгээ оруулах"
                            value={password}
                            name="password"
                            onChange={(e) => setPassword1(e.target.value)}
                            onKeyUp={validatePassword}
                          />
                          <span
                            className="icon-on-off"
                            onClick={togglePasswordVisiblity}
                          >
                            <img src="/icon-off.svg" />
                          </span>
                          <Form.Control.Feedback type="invalid">
                            {t('enter-pass')}!
                          </Form.Control.Feedback>
                        </InputGroup>
                        <div className="label-title">
                          <h5
                            style={{
                              marginTop: '12px',
                            }}
                          >
                            {t('repeat-password')}
                          </h5>
                        </div>
                        <InputGroup hasValidation>
                          <Form.Control
                            type={passwordShown ? 'text' : 'password'}
                            className="tw-input tw-password"
                            placeholder="Нууц үгээ давтан оруулах"
                            value={password2}
                            name="password2"
                            onChange={(e) => setPassword2(e.target.value)}
                            onKeyUp={validatePassword}
                          />
                          <span
                            className="icon-on-off"
                            onClick={togglePasswordVisiblity}
                          >
                            <img src="/icon-off.svg" />
                          </span>
                          <Form.Control.Feedback type="invalid">
                            {t('enter-repeat-pass')}!
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                      <div className="requirement-text">
                        {mustContainData.map((data, i) => (
                          <MustContainItem data={data} key={i} />
                        ))}
                      </div>
                      <div
                        className="tw-single-button"
                        style={{ padding: '0' }}
                      >
                        <Button type="submit" disabled={!allValid}>
                          {t('save-password')}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Col>
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
      {notification?.show && (
        <Notification
          show={notification.show}
          infos={notification.message}
          close={closeNotification}
        />
      )}
      {alert?.show && (
        <FailNotification
          show={alert.show}
          infos={alert.message}
          close={closeFailNotification}
        ></FailNotification>
      )}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName={response.success ? 'success-modal' : 'fail-modal'}
        centered
      >
        <div className="content-inner">
          <Modal.Header>
            <div className="image">
              <div className="image-inner">
                <img
                  src={
                    response.success
                      ? '/modal-icon-success.svg'
                      : '/modal-icon-danger.svg'
                  }
                />
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="body-content">
              <div className="title">
                <h5>{response.success ? 'Амжилттай' : 'Амжилтгүй'}</h5>
              </div>
              <div className="desc">
                {response.success ? (
                  <p>Таны нууц үг амжилттай солигдлоо</p>
                ) : (
                  <p>
                    <strong>{response.info}</strong>
                  </p>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleModal}>
              {response.success ? 'Баярлалаа' : 'Хаах'}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </Container>
  );
};
export default ProfileChangePass;
