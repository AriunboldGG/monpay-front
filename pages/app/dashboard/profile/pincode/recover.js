import Sidebar from 'components/sidebar/control';
import React, { useState, useContext, useEffect } from 'react';
import { Col, Container, Row, Form, Button, InputGroup } from 'react-bootstrap';
import Topbar from 'components/topbar';
import SidebarUserProfile from 'components/sidebar/profile';
import { AutoTabProvider } from 'react-auto-tab';
import IctContext from 'context/ict-context';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import { getFullInfo } from 'service/user';
import FailNotification from 'components/notification/fail-notif';
import Notification from 'components/notification/index';
import useTranslation from 'next-translate/useTranslation';

const PinCodeRecover = (props) => {
  const texts = {
    newPin: {
      title: 'Гүйлгээний пин код тохируулах',
    },
    recoverPin: {
      title: 'Гүйлгээний пин код сэргээх',
    },
  };

  const [show, setShow] = useState(false);
  const [hasPin, setHasPin] = useState(true);
  const [title, setTitle] = useState(texts.recoverPin.title);
  const [infos, setInfos] = useState('');
  const [otp1, setOtp1] = useState('');
  const [otp2, setOtp2] = useState('');
  const [otp3, setOtp3] = useState('');
  const [otp4, setOtp4] = useState('');
  const [alert, setAlert] = useState({ show: false });
  const [notification, setNotification] = useState({ show: false });
  const otp = `${otp1}${otp2}${otp3}${otp4}`;
  const [register, setRegister] = useState('');
  const [validated, setValidated] = useState(false);
  const [showerror, setShowError] = useState(false);
  const { info, user, setUserInfo, setLogout } = useContext(IctContext);
  const [counter, setCounter] = useState(60);
  const [timer, setTimer] = useState(null);
  const [submitButton, setSubmitButton] = useState(true);

  const router = useRouter();
  const { t } = useTranslation('pincode');

  React.useEffect(() => {
    if (!info) {
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
    }
    if (router.query.status === 'new') {
      setHasPin(false);
      setTitle(texts.newPin.title);
    }
  }, [router.isReady]);
  const sendOtp = () => {
    const body = { otp: otp, phone: info.phone };
    axios.post('/api/pin/get-passwordToken', body).then(
      (respToken) => {
        const passwordToken = respToken?.data?.result?.passwordToken?.value;
        jsCookie.set('pass', passwordToken);
        setTimeout(() => {
          router.push('/app/dashboard/profile/pincode/new');
        }, 2000);
        setNotification({
          show: true,
          message: respToken.data?.info,
        });
      },
      (error) => {
        setAlert({
          show: true,
          message: error.response?.data?.info,
        });
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      otpFunction();
    }
    setValidated(true);
  };
  const otpFunction = () => {
    const body = { register: register, phone: info?.phone };
    axios.post('/api/password/get-otp', body).then(
      (resp) => {
        setSubmitButton(false);
        setNotification({
          show: true,
          message: resp.data.info,
        });
        setShow(true);
        count();
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
  const closeFailNotification = () => {
    setAlert(null);
  };

  const retryPin = async () => {
    otpFunction();
    setCounter(60);
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
  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col lg={10} className="dashboard-right-side">
          <Row>
            <Col style={{ borderBottom: '1px solid #E8EDF5' }} className="p-0">
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
                <Col xs={12} lg={4} className="tw-user-col-left">
                  <SidebarUserProfile />
                </Col>
                <Col xs={12} lg={8} className="personal-email remail">
                  <div className="content">
                    <div className="title">
                      <span>{t('recover-trans-pin')}</span>
                    </div>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                      className="personal-form tw-user-form"
                    >
                      <div className="input">
                        <div className="label-title">
                          <h5>{t('crrnt-phone')}</h5>
                        </div>
                        <div className="input-item person-name">
                          <span>{user?.phone}</span>
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
                              {t('register')}
                            </h5>
                          </div>
                          <div className="input-item">
                            <InputGroup hasValidation>
                              <Form.Control
                                required
                                type="text"
                                maxLength={6}
                                placeholder="Регистрийн № сүүлийн 6 орон"
                                onChange={(e) => setRegister(e.target.value)}
                                onKeyPress={(event) => {
                                  if (isNaN(event.key)) event.preventDefault();
                                }}
                                autoComplete="off"
                              />
                              <Form.Control.Feedback type="invalid">
                                {t('register')}
                              </Form.Control.Feedback>
                            </InputGroup>
                          </div>
                        </div>
                      )}

                      <div className="tw-single-button">
                        <Button
                          type="submit"
                          onClick={() => setSubmitButton(false)}
                        >
                          {t('get-verif-code')}
                        </Button>
                      </div>
                    </Form>
                    <Form className="email-confirm-code">
                      <div className="label-title">
                        <h5>{t('enter-verif')}</h5>
                      </div>
                      <AutoTabProvider>
                        <div>
                          <ul>
                            <li>
                              <div className="input-item">
                                <Form.Control
                                  onChange={(e) => setOtp1(e.target.value)}
                                  onKeyPress={(event) => {
                                    if (isNaN(event.key))
                                      event.preventDefault();
                                  }}
                                  autoComplete="off"
                                  inputMode="numeric"
                                  name="code1"
                                  type="password"
                                  className="confirm-input"
                                  maxLength={1}
                                  tabbable="true"
                                />
                              </div>
                            </li>
                            <li>
                              <div className="input-item">
                                <Form.Control
                                  onChange={(e) => setOtp2(e.target.value)}
                                  onKeyPress={(event) => {
                                    if (isNaN(event.key))
                                      event.preventDefault();
                                  }}
                                  autoComplete="off"
                                  inputMode="numeric"
                                  name="code2"
                                  type="password"
                                  className="confirm-input"
                                  maxLength={1}
                                  tabbable="true"
                                />
                              </div>
                            </li>
                            <li>
                              <div className="input-item">
                                <Form.Control
                                  onChange={(e) => setOtp3(e.target.value)}
                                  onKeyPress={(event) => {
                                    if (isNaN(event.key))
                                      event.preventDefault();
                                  }}
                                  autoComplete="off"
                                  inputMode="numeric"
                                  name="code3"
                                  type="password"
                                  className="confirm-input"
                                  maxLength={1}
                                  tabbable="true"
                                />
                              </div>
                            </li>
                            <li>
                              <div className="input-item">
                                <Form.Control
                                  onChange={(e) => setOtp4(e.target.value)}
                                  onKeyPress={(event) => {
                                    if (isNaN(event.key))
                                      event.preventDefault();
                                  }}
                                  autoComplete="off"
                                  inputMode="numeric"
                                  name="code4"
                                  type="password"
                                  className="confirm-input"
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
                    <div
                      className="tw-single-button"
                      style={{ margin: '32px' }}
                    >
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={() => sendOtp()}
                      >
                        {t('cont')}
                      </Button>
                    </div>
                  </div>
                </Col>
                {notification?.show && (
                  <Notification
                    show={notification.show}
                    infos={notification.message}
                    close={closeFailNotification}
                  />
                )}

                {alert?.show && (
                  <FailNotification
                    show={alert.show}
                    infos={alert.message}
                    close={closeFailNotification}
                  ></FailNotification>
                )}
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default PinCodeRecover;
