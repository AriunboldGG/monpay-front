import Sidebar from 'components/sidebar/control';
import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import SidebarPayment from 'components/sidebar/payment';
import TabPaymentOther from 'components/tab/tab-payment-other';
import Topbar from 'components/topbar';
import AccountInfo from 'pages/app/account-info';
import FailNotification from 'components/notification/fail-notif';
import useTranslation from 'next-translate/useTranslation';

const PaymentOther = (props) => {
  const [showFiled, setShowFiled] = useState(false);
  const [infos, setInfos] = useState('');
  const { t } = useTranslation('payment');

  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col className="dashboard-right-side" lg={10}>
          <Row>
            <Col style={{ borderBottom: '1px solid #E8EDF5' }} className="p-0">
              <Topbar name={t('paymentt')} logo="/icon-payment-dashboard.svg" />
            </Col>
          </Row>
          <Row className="payment-other wrapper-row">
            <div
              style={{
                maxWidth: '768px',
                margin: 'auto',
                padding: '0',
              }}
            >
              <Row>
                <Col xs={12} lg={4}>
                  <SidebarPayment />
                </Col>
                <Col xs={12} lg={8}>
                  <AccountInfo />
                  <Row style={{ paddingTop: '24px' }}>
                    <Col>
                      <TabPaymentOther />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <FailNotification show={showFiled} infos={infos} />
                </Col>
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentOther;
