import React from 'react';
import Sidebar from 'components/sidebar/control';
import { Col, Container, Row, Card } from 'react-bootstrap';
import Topbar from 'components/topbar';
import SidebarContract from 'components/sidebar/contract';
import GoogleMapMonpay from 'components/google-map/app-google';
import useTranslation from 'next-translate/useTranslation';

const Contract = (props) => {
  const { t } = useTranslation('contract');

  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col lg={10} className="dashboard-right-side">
          <Row>
            <Col style={{ borderBottom: '1px solid #E8EDF5' }} className="p-0">
              <Topbar name={t('help')} logo="/icon-info-topbar.svg" />
            </Col>
          </Row>
          <Row className="wrapper-row app-contract">
            <div
              style={{
                maxWidth: '1032px',
                margin: 'auto',
                padding: '0',
              }}
            >
              <Row>
                <Col xs={12} lg={3}>
                  <SidebarContract />
                </Col>
                <Col xs={12} lg={9}>
                  <div className="tw-contract-container">
                    <div className="tw-contract-top">
                      <h4>{t('contract-points')}</h4>
                    </div>
                    <div>
                      <Card style={{ border: 'none' }}>
                        <Card.Body
                          style={{
                            justifyContent: 'center',
                            padding: '32px',
                          }}
                        >
                          <GoogleMapMonpay />
                        </Card.Body>
                      </Card>
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
export default Contract;
