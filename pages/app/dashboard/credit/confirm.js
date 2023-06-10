import React, { useState, useContext } from 'react';
import Sidebar from 'components/sidebar/control';
import { Col, Container, Row, Form, Button, Modal } from 'react-bootstrap';
import Topbar from 'components/topbar';
import { AutoTabProvider } from 'react-auto-tab';
import AccountInfo from 'pages/app/account-info';
import { useRouter } from 'next/router';
import IctContext from 'context/ict-context';
import axios from 'axios';
import Notification from 'components/notification/index';
import FailNotification from 'components/notification/fail-notif';
import useTranslation from 'next-translate/useTranslation';

const CreditConfirm = (props) => {
  const { loanInfo } = useContext(IctContext);
  const [show, setShow] = useState(false);
  const [response, setResponse] = useState({});
  const [alert, setAlert] = useState({ show: false });
  const [notification, setNotification] = useState({ show: false });
  const { t } = useTranslation('loan');
  const router = useRouter();
  const [forDisabled, setForDisabled] = useState(false);

  const createBody = (val) => {
    const body = {};
    body.amount = Number(loanInfo.amount);
    body.interest = Number(loanInfo.interest);
    body.month = loanInfo.month;
  };
  createBody;

  const handleModal = () => {
    setShow(false);
    if (response.success) router.push('/app/dashboard');
  };

  const handleCheck = () => {
    setForDisabled(true);
  };

  let today = new Date();
  let monthTime = loanInfo?.month
    ? loanInfo.month * 30 * 24 * 60 * 60 * 1000
    : 0;

  let ms = today.getTime() + monthTime;
  let calculatedDate = new Date(ms);

  const calculatedDateData =
    calculatedDate.getFullYear() +
    '.' +
    (calculatedDate.getMonth() + 1) +
    '.' +
    calculatedDate.getDate();

  const handleSubmitPin = (event) => {
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity() === false) {
    } else {
      const pin = `${form.code1.value}${form.code2.value}${form.code3.value}${form.code4.value}`;
      const body = {
        pin: pin,
        amount: loanInfo.amount,
      };
      axios.post('/api/credit/loan-create', body).then(
        (resp) => {
          setResponse({ ...resp.data.result, success: true });
          setShow(true);
        },
        (error) => {
          if (error.response.data.info) {
            setShow(true);
            setResponse({
              ...error.response.data.info,
              success: false,
            });
          }
          event.stopPropagation();
        }
      );
    }
  };
  const closeNotification = () => {
    setAlert(null);
  };
  const cancel = () => {
    router.back();
  };

  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col lg={10} className="dashboard-right-side">
          <Row>
            <Col className="p-0" style={{ borderBottom: '1px solid #E8EDF5' }}>
              <Topbar name={t('loann')} logo="/icon-card-dashboard.svg" />
            </Col>
          </Row>
          <Row className="wrapper-row">
            <div
              style={{
                padding: '32px 0 40px 0',
                maxWidth: '504px',
                margin: 'auto',
              }}
            >
              <AccountInfo />
              <Row style={{ marginTop: '24px' }}>
                <Col>
                  <div className="credit-container-top">
                    <div className="tab-container-top">
                      <div className="tab-top">
                        <h3>{t('loan-confirm.confirmation')}</h3>
                      </div>
                    </div>
                    <div className="confirm-top">
                      <div className="confirm-top-title">
                        <h6>{t('loan-confirm.check')}</h6>
                      </div>
                    </div>
                    <div className="credit-confirm-info">
                      <ul className="confirm-list">
                        <li>
                          <h4>{t('loan-confirm.loan-amount')}</h4>
                          <span>
                            {loanInfo?.amount
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            ₮
                          </span>
                        </li>
                        <li>
                          <h4>{t('loan.interest-rate')}</h4>
                          <span>
                            {(Number(loanInfo?.interest) * 100).toFixed(1) ||
                              '0.00'}
                            %
                          </span>
                        </li>
                        <li>
                          <h4>{t('loan.loan-term')}</h4>
                          <span>
                            {loanInfo?.month * 30}
                            {t('loan.days')}
                          </span>
                        </li>
                        <li>
                          <h4>{t('loan.repayment-date')}</h4>
                          <span>{calculatedDateData}</span>
                        </li>
                        <li>
                          <h4>{t('loan.repay-amount')}</h4>
                          <span>
                            {(
                              loanInfo?.interest * loanInfo?.amount +
                              loanInfo?.amount
                            )
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            ₮
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="credit-container-bottom">
                      <div className="tw-confirm-title">
                        <div
                          style={{
                            padding: '0 32px',
                          }}
                          className="tw-form-title loan"
                        >
                          <p>{t('loan-confirm.transaction-pin')}</p>
                        </div>
                        <Form
                          className="tw-credit-confirm"
                          onSubmit={handleSubmitPin}
                        >
                          <AutoTabProvider
                            style={{
                              padding: '0 32px',
                              paddingBottom: '40px',
                            }}
                          >
                            <div>
                              <ul>
                                <li>
                                  <div className="input-item">
                                    <Form.Control
                                      onChange={(e) => handleCheck()}
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
                                      onChange={(e) => handleCheck()}
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
                                      onChange={(e) => handleCheck()}
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
                                      onChange={(e) => handleCheck()}
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
                          <div className="confirm-button">
                            <Button onClick={(cancel) => router.back()}>
                              <span className="form-button-title">
                                {t('loan-confirm.cancel')}
                              </span>
                            </Button>
                            <Button type="submit" disabled={!forDisabled}>
                              <span className="form-button-title">
                                {t('loan-confirm.get-loan')}
                              </span>
                            </Button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Row>
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
                    <p>
                      <strong
                        style={{
                          padding: '0 3px',
                        }}
                      >
                        {response.transactionId}
                      </strong>
                      дугаартай зээл олголт амжилттай боллоо.
                    </p>
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
    </Container>
  );
};

export default CreditConfirm;
