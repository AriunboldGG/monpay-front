import Sidebar from 'components/sidebar/control';
import React, { useState, useContext } from 'react';
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  Alert,
  Modal,
} from 'react-bootstrap';
import Topbar from 'components/topbar';
import SidebarUserProfile from 'components/sidebar/profile';
import { AutoTabProvider } from 'react-auto-tab';
import jsCookie from 'js-cookie';
import axios from 'axios';
import DangerNotification from 'components/notification/danger-notif';
import FailNotification from 'components/notification/fail-notif';
import Notification from 'components/notification/index';
import IctContext from 'context/ict-context';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const PinCodeNew = (props) => {
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState({ show: false });
  const [response, setResponse] = useState({});
  const router = useRouter();

  const { user, setLogin } = useContext(IctContext);
  const { t } = useTranslation('pincode');

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity() === false) {
    } else {
      const newpin1 = `${form.code9.value}${form.code10.value}${form.code11.value}${form.code12.value}`;
      const newpin = `${form.code5.value}${form.code6.value}${form.code7.value}${form.code8.value}`;
      if (newpin1 === newpin) {
        const body = { pin: newpin };
        axios.post('/api/pin/res', body).then(
          (resp) => {
            jsCookie.remove('pass');
            const auth = resp?.data?.result;
            jsCookie.set('auth', auth);
            user.pin = true;
            setLogin(user);
            setShow(true);
            setResponse({ ...resp.data.info, success: true });
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
  const closeFailNotification = () => {
    setAlert(null);
  };

  const handleModal = () => {
    setShow(false);
    if (response.success) {
      router.push('/app/dashboard/profile/pincode');
    }
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
                      <span>{t('recover-trans-pin')}</span>
                    </div>
                    <div>
                      <Form
                        className="email-confirm-code setpincode"
                        onSubmit={handleSubmit}
                      >
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
                        <div className="tw-single-button">
                          <Button variant="primary" type="submit">
                            {t('save')}
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </div>
                </Col>

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
                            <p>Таны пинкод амжилттай шинэчлэгдлээ</p>
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
export default PinCodeNew;
