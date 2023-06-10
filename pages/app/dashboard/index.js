import React from 'react';
import Topbar from 'components/topbar';
import Sidebar from 'components/sidebar/control';
import Control from './control/control';
import { Container, Col, Row } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';

const Page = () => {
  const { t } = useTranslation('dashboard');

  //Удирдлага хэсгийн эх component
  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col lg={10} className="dashboard-right-side">
          <Row style={{ marginBottom: '32px' }}>
            <Col
              style={{
                borderBottom: '1px solid #E8EDF5',
                padding: '0',
              }}
            >
              <Topbar
                name={t('dashboard')}
                logo="/icon-category-dashboard.svg"
              />
            </Col>
          </Row>
          <Row style={{ backgroundColor: '#ffffff' }}>
            <Control />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
