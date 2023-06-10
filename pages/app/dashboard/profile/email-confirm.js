import Sidebar from 'components/sidebar/control';
import React, { useState, useEffect, useContext } from 'react';
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
import { AutoTabProvider } from 'react-auto-tab';
import axios from 'axios';
import FailNotification from 'components/notification/fail-notif';
import Notification from 'components/notification/index';
import useTranslation from 'next-translate/useTranslation';
import IctContext from 'context/ict-context';
import { useRouter } from 'next/router';

const ProfileEmailConfirm = (props) => {
  const { t } = useTranslation('profile');
  const [user, setUser] = useState();
  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState({ show: false });
  const [notification, setNotification] = useState({ show: false });
  const [validated, setValidated] = useState(false);
  const [falseTrue, setfalseTrue] = useState(true);
  const [response, setResponse] = useState({});
  const [newEmail, setNewEmail] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);
  const router = useRouter();
  const [otp1, setOtp1] = useState('');
  const [otp2, setOtp2] = useState('');
  const [otp3, setOtp3] = useState('');
  const [otp4, setOtp4] = useState('');
  const [counter, setCounter] = useState(60);
  const [timer, setTimer] = useState(null);
  const { setLogin } = useContext(IctContext);

  const userotp = `${otp1}${otp2}${otp3}${otp4}`;
  const getOtp = () => {
    setShow(true);
    const body = {
      otp: userotp,
      newEmail: newEmail,
    };
    axios.post('/api/mail/change-mail', body).then(
      (resp) => {
        setResponse({ ...resp.data.result, success: true });
        setShowSubmit(true);

        user.email = newEmail;
        setLogin(user);
      },
      (error) => {
        if (error.response.data.info) {
          setShowSubmit(true);
          setResponse({
            ...error.response.data.info,
            success: false,
          });
        }
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity() === false) {
    } else {
      otpFunction();
    }
  };

  const handleModal = () => {
    setShowSubmit(false);
    if (response.success) router.push('/app/dashboard');
  };

  const otpFunction = () => {
    const body = {
      newEmail: newEmail,
    };

    axios.post('/api/mail/get-otp', body).then(
      (resp) => {
        setNotification({
          show: true,
          message: resp.data?.info,
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
                <Col xs={12} lg={4}>
                  <SidebarUserProfile />
                </Col>
                <Col xs={12} lg={8} className="personal-email remail">
                  <div className="content">
                    <div className="title">
                      <span>{t('re-new-email')}</span>
                    </div>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                      className="personal-form tw-user-form"
                      name="otp"
                    >
                      {user?.email ? (
                        <div className="input">
                          <div className="label-title">
                            <h5>{t('crrnt-email')}</h5>
                          </div>
                          <div className="input-item person-name">
                            <span>{user?.email}</span>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="input">
                        <div className="label-title">
                          <h5
                            style={{
                              marginTop: '12px',
                            }}
                          >
                            {t('new-email')}
                          </h5>
                        </div>
                        <div className="input-item">
                          <InputGroup hasValidation>
                            <Form.Control
                              required
                              type="email"
                              onChange={(e) => setNewEmail(e.target.value)}
                              placeholder={t('new-email')}
                            />
                            <Form.Control.Feedback>
                              {t('new-email')}
                            </Form.Control.Feedback>
                          </InputGroup>
                        </div>
                      </div>
                      <div className="tw-single-button">
                        <Button type="submit" disabled={!falseTrue}>
                          {t('get-verif-code')}
                        </Button>
                      </div>
                    </Form>
                    <Form className="email-confirm-code" name="confirm">
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
                                  type="password"
                                  name="code3"
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
                    <div className="tw-user-button">
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={() => getOtp()}
                      >
                        {t('save')}
                      </Button>
                    </div>
                  </div>
                </Col>
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
                    close={closeNotification}
                  ></FailNotification>
                )}
                <Modal
                  show={showSubmit}
                  onHide={() => setShowSubmit(false)}
                  dialogClassName={
                    response.success ? 'success-modal' : 'fail-modal'
                  }
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
                          <h5>
                            {response.success ? 'Амжилттай' : 'Амжилтгүй'}
                          </h5>
                        </div>
                        <div className="desc">
                          {response.success ? (
                            <>
                              <p>{t('transfer')}</p>
                              <p>{t('successfull')}</p>
                            </>
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
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default ProfileEmailConfirm;
