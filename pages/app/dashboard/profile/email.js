import Sidebar from 'components/sidebar/control';
import React, { useState } from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import Topbar from 'components/topbar';
import SidebarUserProfile from 'components/sidebar/profile';
import useTranslation from 'next-translate/useTranslation';

const ProfileEmail = (props) => {
  const { t } = useTranslation('profile');
  const [validated, setValidated] = useState(false);
  const [user, setUser] = useState();
  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
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
                <Col xs={12} lg={8} className="personal-email ">
                  <div className="content">
                    <div className="title">
                      <span>{t('email')}</span>
                    </div>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                      className="personal-form"
                    >
                      <div className="input">
                        <div className="label-title">
                          <h5>{t('crrnt-email')}</h5>
                        </div>
                        <div className="current-email">
                          <span>{user?.email}</span>
                        </div>
                      </div>
                      <div className="buttons">
                        <Link href="/app/dashboard/profile/email-confirm">
                          <Button type="submit">{t('re-new-email')}</Button>
                        </Link>
                        <Button type="submit">{t('save')}</Button>
                      </div>
                    </Form>
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
export default ProfileEmail;
