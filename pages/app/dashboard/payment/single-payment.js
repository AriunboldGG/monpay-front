import Sidebar from 'components/sidebar/control';
import React, { useContext, useState, useEffect } from 'react';
import { Col, Container, Row, Form, Modal, Button } from 'react-bootstrap';
import SidebarPayment from 'components/sidebar/payment';
import Topbar from 'components/topbar';
import { AutoTabProvider } from 'react-auto-tab';
import axios from 'axios';
import FailNotification from 'components/notification/fail-notif';
import Notification from 'components/notification/index';
import useTranslation from 'next-translate/useTranslation';
import AccountInfo from 'pages/app/account-info';
import IctContext from 'context/ict-context';
import { useRouter } from 'next/router';

const PaymentAdd = (props) => {
  const [billProducts, setBillProducts] = useState([]);
  const [addAmount, setAddAmount] = useState();
  const [validated, setValidated] = useState(false);
  const { billInfo } = useContext(IctContext);
  const [alert, setAlert] = useState({ show: false });
  const [notification, setNotification] = useState({ show: false });
  const { t } = useTranslation('payment');
  const [checkedOne, setCheckedOne] = useState(false);
  const [checkedTwo, setCheckedTwo] = useState(false);

  const [show, setShow] = useState(false);
  const [response, setResponse] = useState({});
  const router = useRouter();

  const handleChangeOne = () => {
    setCheckedOne(!checkedOne);
    setCheckedTwo(false);
  };

  const handleChangeTwo = () => {
    setCheckedTwo(!checkedTwo);
    setCheckedOne(false);
  };

  useEffect(() => {
    if (billInfo) {
      const body = {
        billProdId: billInfo?.billProdId,
        billerUid: billInfo?.billerUid,
      };
      axios.post('/api/bill-hub/bill-getbal', body).then(
        (resp) => {
          setBillProducts(resp.data.result);
          if (billProducts.balance) {
            setAddAmount(billProducts.balance);
          }
        },
        (error) => {
          setAlert({
            show: true,
            message: error.response?.data?.info,
          });
          setTimeout(() => {
            router.back();
          }, 2000);
        }
      );
    } else {
      router.back();
    }
  }, []);

  const handleSubmitPin = (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity() === false) {
    } else {
      const pin = `${form.code1.value}${form.code2.value}${form.code3.value}${form.code4.value}`;
      const body = {
        amount: addAmount,
        pin: pin,
        billProdId: billInfo.billProdId,
        billerUid: billProducts.billerUid,
        custNo: event.target.custNo?.value,
      };
      axios.post('/api/bill-hub/bill-pay', body).then(
        (resp) => {
          setValidated(resp);
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
    }
  };

  const handleModal = () => {
    setShow(false);
    if (response.success) {
      router.push('/app/dashboard');
    } else {
      router.back();
    }
  };
  const closeNotification = () => {
    setAlert(null);
  };

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
          <Row className="payment wrapper-row">
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
                      <div className="deposit-tab">
                        <div className="title">
                          <h5>{t('single-payment.title')}</h5>
                        </div>
                        <div className="confirm-1">
                          <div className="confirm-title-out">
                            <span className="confirm-title">
                              {t('single-payment.information')}
                            </span>
                          </div>
                          <div className="content">
                            <div className="content-inner">
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('single-payment.phone-number')}
                                </h5>
                                <span className="number">
                                  {billProducts.billerUid}
                                </span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('single-payment.payment')}
                                </h5>
                                <span className="number">
                                  {billProducts.balance}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="tw-payment-add">
                            <div className="form-check-radio other-payment">
                              <Form.Check
                                inline
                                label={t('single-payment.individual')}
                                type="radio"
                                name="group1"
                                value={checkedOne}
                                onChange={handleChangeOne}
                                defaultChecked
                              />
                              <Form.Check
                                inline
                                label={t('single-payment.organization')}
                                type="radio"
                                name="group1"
                                value={checkedTwo}
                                onChange={handleChangeTwo}
                              />
                            </div>
                          </div>
                          <div className="tw-payment-add-form">
                            <Form.Group
                              className="form-phone"
                              controlId="formGroupPassword"
                            >
                              <Form.Label>
                                {t('single-payment.payment-total')}
                              </Form.Label>
                              <Form.Control
                                type="number"
                                placeholder={'Мөнгөн дүн оруулна уу'}
                                onChange={(e) => {
                                  setAddAmount(e.target.value);
                                }}
                              />
                            </Form.Group>
                            {checkedTwo == true ? (
                              <Form.Group
                                className="form-phone"
                                controlId="formGroupPassword"
                                style={{
                                  paddingBottom: '32px',
                                }}
                              >
                                <Form.Label
                                  style={{
                                    paddingTop: '12px',
                                  }}
                                >
                                  {t('single-payment.org-id')}
                                </Form.Label>
                                <Form.Control
                                  required
                                  name="custNo"
                                  type="text"
                                  placeholder={t('single-payment.org-id')}
                                  maxLength={10}
                                  onKeyPress={(event) => {
                                    if (isNaN(event.key))
                                      event.preventDefault();
                                  }}
                                  autoComplete="off"
                                  tabbable="true"
                                />
                              </Form.Group>
                            ) : (
                              <></>
                            )}
                          </div>

                          <Form
                            className="email-confirm-code"
                            onSubmit={handleSubmitPin}
                          >
                            <div className="label-title">
                              <h5>{t('single-payment.enter-pin')}</h5>
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
                                        required
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
                                        required
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
                                        required
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
                                        required
                                      />
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </AutoTabProvider>
                            <div className="transfer-buttons">
                              <div className="buttons-inner">
                                <Button onClick={() => router.back()}>
                                  {t('single-payment.cancel')}
                                </Button>
                                <Button
                                  variant="primary"
                                  type="submit"
                                  disabled={!addAmount}
                                >
                                  {t('paymentt')}
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
                      Таны
                      <strong
                        style={{
                          padding: '0 3px',
                        }}
                      >
                        {response.transactionId}
                      </strong>
                      дугаартай төлбөр төлөлт амжилттай хийгдлээ.
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
export default PaymentAdd;
