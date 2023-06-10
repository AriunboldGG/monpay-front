import Sidebar from 'components/sidebar/control';
import React, { useState, useContext } from 'react';
import { Col, Container, Row, Form, Button, Alert } from 'react-bootstrap';
import Topbar from 'components/topbar';
import SidebarUserProfile from 'components/sidebar/profile';
import { AutoTabProvider } from 'react-auto-tab';
import IctContext from 'context/ict-context';
import useTranslation from 'next-translate/useTranslation';

const ProfileNewPhone = (props) => {
  const { t } = useTranslation('profile');
  const [show, setShow] = useState(false);
  const { user } = useContext(IctContext);

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
                <Col xs={12} lg={8}>
                  <div className="tw-user-container tw-user-phone">
                    <div>
                      <div className="tw-user">
                        <div className="tw-user-top">
                          <h4>{t('renew-phone')}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="tw-button-phone tw-user-new-phone">
                      <div className="tw-user-bottom">
                        <div className="tw-user-form">
                          <div className="person-title">
                            <h5>{t('crrnt-phone')}</h5>
                          </div>
                          <div className="person-name">
                            <span>{user?.phone}</span>
                          </div>

                          <Form.Group
                            className="tw-user-form-item"
                            controlId="formGroupPassword"
                          >
                            <Form.Label
                              style={{
                                marginTop: '12px',
                              }}
                            >
                              {t('new-phone')}
                            </Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Шинэ утасны дугаар"
                            />
                          </Form.Group>
                        </div>
                      </div>
                      <div className="tw-user-button-def">
                        <Button type="submit" onClick={() => setShow(true)}>
                          {t('get-verif-code')}
                        </Button>
                      </div>
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
                                    name="code1"
                                    type="password"
                                    className="confirm-input"
                                    maxLength={1}
                                    onKeyPress={(event) => {
                                      if (isNaN(event.key))
                                        event.preventDefault();
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
                                      if (isNaN(event.key))
                                        event.preventDefault();
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
                                      if (isNaN(event.key))
                                        event.preventDefault();
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
                                      if (isNaN(event.key))
                                        event.preventDefault();
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
                      </Form>
                      <div className="tw-user-button">
                        <Button
                          type="submit"
                          variant="primary"
                          onClick={() => setShow(true)}
                        >
                          {t('save')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default ProfileNewPhone;
