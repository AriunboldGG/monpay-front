import Sidebar from 'components/sidebar/control';
import React, { useState } from 'react';
import { Col, Container, Row, Form, Button, Modal } from 'react-bootstrap';
import Link from 'next/link';
import Topbar from 'components/topbar';
import SidebarUserProfile from 'components/sidebar/profile';
import { AutoTabProvider } from 'react-auto-tab';
import axios from 'axios';
import DangerNotification from 'components/notification/danger-notif';
import FailNotification from 'components/notification/fail-notif';
import Notification from 'components/notification/index';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const PinCode = (props) => {
  const [alert, setAlert] = useState({ show: false });
  const [notification, setNotification] = useState({ show: false });
  const [show, setShow] = useState(false);
  const [showDanger, setShowDanger] = useState(false);
  const [showFiled, setShowFiled] = useState(false);
  const [forDisabled, setForDisabled] = useState(false);
  const [infos, setInfos] = useState('');
  const { router } = useRouter();
  const [response, setResponse] = useState({});

  const { t } = useTranslation('pincode');

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity() === false) {
    } else {
      const oldPin = `${form.code1.value}${form.code2.value}${form.code3.value}${form.code4.value}`;
      const newpin1 = `${form.code5.value}${form.code6.value}${form.code7.value}${form.code8.value}`;
      const newpin = `${form.code9.value}${form.code10.value}${form.code11.value}${form.code12.value}`;
      if (oldPin) {
      } else {
        setShowFiled(true);
      }
      if (newpin1 === newpin) {
        const body = {
          firstPin: showFiled,
          oldpin: oldPin,
          newpin: newpin,
        };
        axios.put('/api/pin/set-new', body).then(
          (resp) => {
            setResponse({ ...resp.data.info, success: true });
            setShow(true);
          },
          (error) => {
            if (error.response.data.info) {
              setShow(true);
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
          message: 'Пин код давталт тохирохгүй байна.',
        });
      }
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };
  const closeFailNotification = () => {
    setAlert(null);
  };
  const closeDangerNotification = () => {
    setShowDanger(null);
  };
  const handleModal = (e) => {
    setShow(false);
    if (response.success) {
      router.push('/app/dashboard');
    }
  };

  const handleChange = (value, e) => {
    const form = value.target;

    if (value?.target.value) {
      setForDisabled(true);
    }
    return null;
  };
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
                <Col xs={12} lg={8} className="personal-email remail pincode">
                  <div className="content">
                    <div className="title">
                      <span>{t('cnge-trans-pin')}</span>
                    </div>
                    <Form
                      noValidate
                      onSubmit={handleSubmit}
                      className="email-confirm-code setpincode"
                    >
                      <>
                        <div className="label-title">
                          <h5
                            style={{
                              marginTop: '0',
                            }}
                          >
                            {t('crrnt-pincode')}
                          </h5>
                        </div>
                        <div>
                          <AutoTabProvider>
                            <ul>
                              <li>
                                <div className="input-item">
                                  <Form.Control
                                    required
                                    type="password"
                                    name="code1"
                                    maxLength={1}
                                    className="confirm-input"
                                    tabbable="true"
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    onChange={(e) => handleChange(e)}
                                  />
                                </div>
                              </li>
                              <li>
                                <div className="input-item">
                                  <Form.Control
                                    required
                                    type="password"
                                    name="code2"
                                    className="confirm-input"
                                    maxLength={1}
                                    tabbable="true"
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    onChange={(e) => handleChange(e)}
                                  />
                                </div>
                              </li>
                              <li>
                                <div className="input-item">
                                  <Form.Control
                                    required
                                    type="password"
                                    name="code3"
                                    className="confirm-input"
                                    maxLength={1}
                                    tabbable="true"
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    onChange={(e) => handleChange(e)}
                                  />
                                </div>
                              </li>
                              <li>
                                <div className="input-item">
                                  <Form.Control
                                    required
                                    type="password"
                                    name="code4"
                                    className="confirm-input"
                                    maxLength={1}
                                    tabbable="true"
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    onChange={(e) => handleChange(e)}
                                  />
                                </div>
                              </li>
                            </ul>
                          </AutoTabProvider>
                        </div>
                      </>
                      <>
                        <div className="label-title">
                          <h5
                            style={{
                              marginTop: '0',
                            }}
                          >
                            {t('new-pin')}
                          </h5>
                        </div>
                        <AutoTabProvider>
                          <div>
                            <ul>
                              <li>
                                <div className="input-item">
                                  <Form.Control
                                    required
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    name="code5"
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
                                    required
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    name="code6"
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
                                    required
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    name="code7"
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
                                    required
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    name="code8"
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
                        <div className="label-title">
                          <h5
                            style={{
                              marginTop: '12px',
                            }}
                          >
                            {t('repeat-new')}
                          </h5>
                        </div>
                        <AutoTabProvider>
                          <div>
                            <ul>
                              <li>
                                <div className="input-item">
                                  <Form.Control
                                    required
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    name="code9"
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
                                    required
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    name="code10"
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
                                    required
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    name="code11"
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
                                    required
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
                                    }}
                                    autoComplete="off"
                                    inputMode="numeric"
                                    name="code12"
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
                      </>
                      <div className="buttons">
                        <Link href="/app/dashboard/profile/pincode/recover">
                          <Button type="submit">{t('recover-pin')}</Button>
                        </Link>
                        <Button
                          disabled={!forDisabled}
                          type="submit"
                          variant="primary"
                        >
                          {t('change')}
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
      <DangerNotification
        show={showDanger}
        infos={infos}
        close={closeDangerNotification}
      />
      {alert?.show && (
        <FailNotification
          show={alert.show}
          infos={alert.message}
          close={closeFailNotification}
        ></FailNotification>
      )}
      <Modal
        show={show}
        onHide={() => setShow(false)}
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
                  <p>Таны пинкод амжилттай солигдлоо</p>
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

export default PinCode;
