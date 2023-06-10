import Sidebar from 'components/sidebar/control';
import AccountSidebar from 'components/sidebar/account';
import Topbar from 'components/topbar';
import React, { useState, useContext } from 'react';
import { Container, Col, Row, Button, Modal, Form } from 'react-bootstrap';
import { AutoTabProvider } from 'react-auto-tab';
import AccountInfo from 'pages/app/account-info';
import IctContext from 'context/ict-context';
import { useRouter } from 'next/router';
import axios from 'axios';
import FailNotification from 'components/notification/fail-notif';
import useTranslation from 'next-translate/useTranslation';

const TransferConfirm = (props) => {
  const { transferInfo } = useContext(IctContext);
  const [response, setResponse] = useState({});
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { t } = useTranslation('account');

  const [validated, setValidated] = useState(false);

  React.useEffect(() => {
    if (!transferInfo || !transferInfo.fund?.bankName) {
      router.push('/app/dashboard/account/transfer?type=fund');
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(false);
      event.stopPropagation();
    } else {
      setValidated(true);
      const pinRange = [...Array(4).keys()];
      const pin = '';
      pinRange.map((index) => {
        pin = pin.concat(form[`code${index + 1}`]?.value);
      });
      if (!isNaN(pin)) {
        const body = createBody(pin);
        axios.post('/api/account/transfer-to-bank', body).then(
          (resp) => {
            setResponse({ ...resp.data.result, success: true });
            setShow(true);
          },
          (error) => {
            if (error.response.data) {
              setShow(true);
              setResponse({
                ...error.response.data,
                success: false,
              });
              //handle other errors
            }
            event.stopPropagation();
          }
        );
      } else {
        //TODO: Handle invalid pin
      }
    }
    setValidated(true);
  };

  const handleClose = () => {
    setShow(false);
    if (response.success) router.push('/app/dashboard');
  };

  const createBody = (pin) => {
    const body = {};
    const reqBody = transferInfo.fund;
    body.bankName = reqBody.bankCode;
    body.bankAccount = reqBody.bankAccount;
    body.bankAccountName = reqBody.bankAccountName;
    body.amount = Number(reqBody.amount);
    body.decription = reqBody.description;
    body.srcAccountNo = reqBody.srcAccountNo;
    body.pin = pin;
    return body;
  };

  const handleBack = () => {
    window.location.reload();
  };
  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col lg={10} className="dashboard-right-side">
          <Row>
            <Col style={{ borderBottom: '1px solid #E8EDF5' }}>
              <Topbar name={t('account')} logo="/icon-wallet-dashboard.svg" />
            </Col>
          </Row>
          <Row className="wrapper-row">
            <div
              style={{
                maxWidth: '900px',
                margin: 'auto',
                padding: '0',
              }}
              className="account"
            >
              <Row>
                <Col xs={12} lg={3}>
                  <AccountSidebar />
                </Col>
                <Col xs={12} lg={9}>
                  <AccountInfo />
                  <Row style={{ paddingTop: '24px' }}>
                    <Col>
                      <div className="deposit-tab">
                        <div className="title">
                          <h5>{t('account-conf.conf-transfer')}</h5>
                        </div>
                        <div className="confirm-1">
                          <div className="confirm-title-out">
                            <span className="confirm-title">
                              {t('account-transfer.account-fund')}
                            </span>
                          </div>
                          <div className="content">
                            <div className="content-inner">
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.recipient-bank')}
                                </h5>
                                <span className="number">
                                  <div className="bank-image">
                                    <img src="/lil-khanbank-logo.png" />
                                  </div>
                                  {transferInfo?.fund?.bankName}
                                </span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.recipient-account')}
                                </h5>
                                <span className="number">
                                  {transferInfo?.fund?.bankAccount}
                                </span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.recipient-name')}
                                </h5>
                                <span className="number">
                                  {transferInfo?.fund?.bankAccountName}
                                </span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.amount')}
                                </h5>
                                <span className="number">
                                  {transferInfo?.fund?.amount || '0.00'}₮
                                </span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.transaction-value')}
                                </h5>
                                <span className="number">
                                  {transferInfo?.fund?.description}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Form
                            className="email-confirm-code"
                            onSubmit={handleSubmit}
                          >
                            <div className="label-title">
                              <h5>{t('account-conf.trans-pin')}</h5>
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
                                        tabbable="true"
                                        onKeyPress={(event) => {
                                          if (isNaN(event.key))
                                            event.preventDefault();
                                        }}
                                        autoComplete="off"
                                        inputMode="numeric"
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
                                        tabbable="true"
                                        onKeyPress={(event) => {
                                          if (isNaN(event.key))
                                            event.preventDefault();
                                        }}
                                        autoComplete="off"
                                        inputMode="numeric"
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
                                        tabbable="true"
                                        onKeyPress={(event) => {
                                          if (isNaN(event.key))
                                            event.preventDefault();
                                        }}
                                        autoComplete="off"
                                        inputMode="numeric"
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
                                        tabbable="true"
                                        onKeyPress={(event) => {
                                          if (isNaN(event.key))
                                            event.preventDefault();
                                        }}
                                        autoComplete="off"
                                        inputMode="numeric"
                                      />
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </AutoTabProvider>
                            <div className="transfer-buttons">
                              <div className="buttons-inner">
                                <Button onClick={handleBack}>
                                  {t('account-conf.cancel')}
                                </Button>
                                <Button variant="primary" type="submit">
                                  {t('account-transfer.transfer')}
                                </Button>
                              </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
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
                <h5>
                  {t('transfer')}
                  {response.success ? 'амжилттай' : 'амжилтгүй'}
                </h5>
              </div>
              <div className="desc">
                {response.success ? (
                  <p>
                    {t('your')}
                    <strong
                      style={{
                        padding: '0 3px',
                      }}
                    >
                      {response.transactionId}
                    </strong>
                    {t('successfully')}
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
            <Button onClick={handleClose}>
              {response.success ? 'Баярлалаа' : 'Хаах'}
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </Container>
  );
};

export default TransferConfirm;
