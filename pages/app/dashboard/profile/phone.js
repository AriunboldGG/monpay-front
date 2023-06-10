import Sidebar from 'components/sidebar/control';
import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Topbar from 'components/topbar';
import SidebarUserProfile from 'components/sidebar/profile';
import useTranslation from 'next-translate/useTranslation';

const ProfilePhone = (props) => {
  const { t } = useTranslation('profile');
  const [user, setUser] = useState();
  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);
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
                <Col xs={12} lg={8} className="tw-user-col">
                  <div className="tw-user-container tw-user-phone">
                    <div>
                      <div className="tw-user">
                        <div className="tw-user-top">
                          <h4>{t('phone')}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="tw-button-phone">
                      <div className="tw-user-bottom tw-user-phone-custom">
                        <div className="tw-user-form">
                          <div className="person-title">
                            <h5>{t('crrnt-phone')}</h5>
                          </div>
                          <div className="person-name">{user?.phone}</div>
                        </div>
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
export default ProfilePhone;
