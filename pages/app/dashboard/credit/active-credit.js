import React, { useEffect, useState, useContext } from 'react';
import {
  Col,
  Row,
  Form,
  Button,
  ProgressBar,
  InputGroup,
  Modal,
} from 'react-bootstrap';
import axios from 'axios';
import { AutoTabProvider } from 'react-auto-tab';
import FailNotification from 'components/notification/fail-notif';
import Notification from 'components/notification/index';
import IctContext from 'context/ict-context';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const CreditReturn = () => {
  const [show, setShow] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [response, setResponse] = useState({});
  const [loanInfo, setLoanInfo] = useState({});
  const [calculate, setCalculate] = useState({});
  const [lastDate, setLastDate] = useState('');
  const [beginDate, setBeginDate] = useState('');
  const { t } = useTranslation('loan');
  const [alert, setAlert] = useState({ show: false });
  const [notification, setNotification] = useState({ show: false });
  const [addAmount, setAddAmount] = useState();
  const [validated, setValidated] = useState(false);
  const [validatedForm, setValidatedForm] = useState(false);
  const { maxLoan } = useContext(IctContext);
  const router = useRouter();
  let dayjs = require('dayjs');

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const products = await axios
      .get('/api/credit/loan-info')
      .then((resp) => {
        setLoanInfo(resp);

        resp.data.map((item) => {
          setCalculate(item);
          const lastDate = item?.lastCycle.planDate;
          const beginDate = item?.payCycle.planDate;
          setLastDate(dayjs(lastDate).format('YYYY-MM-DD'));
          setBeginDate(dayjs(beginDate).format('YYYY-MM-DD'));
        });
        return resp.data;
      })
      .catch((error) => {
        return [];
      });
  }
  const submit = () => {
    setValidated(true);
  };
  const handleModal = () => {
    setShowSubmit(false);
    if (response.success) router.push('/app/dashboard');
  };
  const handleSubmitPin = (event) => {
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity() === false) {
      event.preventDefault();

      setValidatedForm(false);
    } else {
      setValidatedForm(true);

      const pin = `${form.code1.value}${form.code2.value}${form.code3.value}${form.code4.value}`;
      const body = {
        pin: pin,
        amount: addAmount,
      };
      axios.post('/api/credit/repay-credit', body).then(
        (resp) => {
          setResponse({ ...resp.data.result, success: true });
          setShowSubmit(true);
        },
        (error) => {
          if (error.response.data.info) {
            setShowSubmit(true);
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
  const calculateData = calculate.balance - addAmount;
  const closeNotification = () => {
    setAlert(null);
  };
  const cancel = () => {
    router.back();
  };

  const repayCredit = () => {
    const dataCalculateTotalAmount =
      (loanInfo.data[0]?.balance / 100) * loanInfo.data[0]?.loan.interest;
    const repay100 = loanInfo.data[0]?.balance + dataCalculateTotalAmount;
    setAddAmount(repay100);
  };

  const thousands = /\B(?=(\d{3})+(?!\d))/g;

  return (
    <>
      <Row>
        {!validated && (
          <Col>
            <div className="credit-container-top">
              <div className="tab-container-top">
                <div className="tab-top">
                  <h3>{t('active-loan.active-loan')}</h3>
                </div>
                <div className="form-top-title">
                  <h6>{t('active-loan.active-desc')}</h6>
                </div>
              </div>
              {loanInfo.data?.map((item, i) => {
                const dataCalculate = (item.balance / 100) * item.loan.interest;
                const dataTotalAmount = item.balance + dataCalculate;
                return (
                  <>
                    <div className="credit-range">
                      <div
                        className={
                          item.lastCycle.planDate === item.payCycle.planDate
                            ? 'active-loan'
                            : 'active-loan double'
                        }
                      >
                        <div className="content-inner-item">
                          <div className="tw-return-top-img">
                            <img src="/icon-card.svg" />
                          </div>
                          <div className="tw-return-container">
                            <h6
                              style={{
                                textAlign: 'left',
                              }}
                            >
                              {t('active-loan.loan-balance')}
                            </h6>
                            <span>
                              {item?.balance.toString().replace(thousands, ',')}
                              ₮
                            </span>
                          </div>
                        </div>
                        {item.lastCycle.planDate === item.payCycle.planDate ? (
                          <div className="single-loan">
                            <div className="active-loan-wrapper">
                              <h6>{t('loan.repayment-date')}</h6>
                              <span>{item?.planDate}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="double-date">
                            <div>
                              <div className="active-loan-wrapper">
                                <h6>{t('loan.repayment-date')}</h6>
                                <div className="wrapper-inner">
                                  <span>{beginDate}</span>
                                  <p className="repay-amount">
                                    {item?.lastCycle.repayAmount
                                      .toString()
                                      .replace(thousands, ',')}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="active-loan-wrapper">
                                <h6>{t('loan.repayment-date')}</h6>
                                <div className="wrapper-inner">
                                  <span>{lastDate}</span>
                                  <p className="repay-amount">
                                    {item?.payCycle.repayAmount
                                      .toString()
                                      .replace(thousands, ',')}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="custom-progressbar">
                        <ProgressBar now={item?.balance} max={maxLoan} />
                      </div>
                      <div className="remaining-days">
                        <p className="description">
                          {t('active-loan.remaining-days')}
                        </p>
                        <span className="day-number">
                          {item?.lastCycle.remainingDays}
                          <div> {t('loan.days')}</div>
                        </span>
                      </div>
                    </div>
                    <div className="credit-info">
                      <div className="credit-info-row">
                        <div className="item">
                          <h6>{t('active-loan.basic-payment')}</h6>
                          <span>
                            {item?.loan?.amount
                              .toString()
                              .replace(thousands, ',')}
                            ₮
                          </span>
                        </div>
                        <div className="item">
                          <h6>{t('loan.interest-rate')}</h6>
                          <span>
                            {dataCalculate.toString().replace(thousands, ',')}₮
                          </span>
                        </div>
                      </div>
                      <div className="credit-info-row">
                        <div className="item">
                          <h6>{t('active-loan.increased-interest')}</h6>
                          <span>{item?.increasedInterest}%</span>
                        </div>
                        <div className="item">
                          <h6>{t('active-loan.total-amount')}</h6>
                          <span>
                            {dataTotalAmount.toString().replace(thousands, ',')}
                            ₮
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
              <Row>
                <Col>
                  <div className="tw-return-top-line">
                    <div className="tw-return-bottom">
                      <div className="input">
                        <div
                          style={{
                            position: 'relative',
                            display: 'flex',
                            marginBottom: '8px',
                          }}
                        >
                          <div className="label-title">
                            <h5>{t('loan.repay-amount')}</h5>
                          </div>
                          <div
                            style={{
                              position: 'absolute',
                              right: '0',
                            }}
                            className="credit-image"
                          >
                            <span onClick={repayCredit}>100%</span>
                          </div>
                        </div>
                        <div className="input-item">
                          <InputGroup hasValidation>
                            <Form.Control
                              required
                              type="number"
                              placeholder="0"
                              value={addAmount}
                              onChange={(e) => {
                                setAddAmount(e.target.value);
                              }}
                              onWheel={(e) => e.target.blur()}
                            />
                            <Form.Control.Feedback type="invalid">
                              Хэтэвчний үлдэгдэл хүрэлцэхгүй байна.
                            </Form.Control.Feedback>
                          </InputGroup>
                        </div>
                      </div>
                      <div className="tw-single-button">
                        <Button onClick={submit} disabled={!addAmount}>
                          {t('loan.continue-button')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        )}
      </Row>
      {validated && (
        <Row>
          <Col
            style={{
              backgroundColor: '#FFFFFF',
              width: 'calc(100% - 280px)',
            }}
          >
            <Row>
              <div>
                <Row style={{ paddingTop: '24px' }}>
                  <Col>
                    <div className="credit-container-top">
                      <div className="tab-container-top">
                        <div className="tab-top">
                          <h3>{t('repay-loan.repay-confirm')}</h3>
                        </div>
                      </div>
                      <div className="confirm-top">
                        <div className="confirm-top-title">
                          <h6>{t('repay-loan.check-carefully')}</h6>
                        </div>
                      </div>
                      <div className="tw-credit-return">
                        <ul className="confirm-list">
                          <li>
                            <h4>{t('active-loan.loan-balance')}</h4>
                            <span>{loanInfo.data[0]?.balanceUI}₮</span>
                          </li>
                          <li>
                            <h4>{t('loan.repay-amount')}</h4>
                            <span>
                              {addAmount
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              ₮
                            </span>
                          </li>
                          <li>
                            <h4>{t('repay-loan.total-balance')}</h4>
                            <span>{calculateData}₮</span>
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
                            validated={validatedForm}
                            className="tw-credit-confirm"
                            onSubmit={handleSubmitPin}
                          >
                            <AutoTabProvider
                              style={{
                                padding: '0 32px',
                                paddingBottom: '40px',
                              }}
                            >
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
                            </AutoTabProvider>
                            <div className="confirm-button">
                              <Modal
                                show={show}
                                onHide={() => setShow(false)}
                                dialogClassName="success-modal"
                                centered
                              >
                                <div className="content-inner">
                                  <Modal.Header>
                                    <div className="image">
                                      <div className="image-inner">
                                        <img src="/modal-icon-success.svg" />
                                      </div>
                                    </div>
                                  </Modal.Header>
                                  <Modal.Body>
                                    <div className="body-content">
                                      <div className="title">
                                        <h5>{t('Success')}</h5>
                                      </div>
                                      <div className="desc">
                                        <p>{t('repay-credit')}</p>
                                      </div>
                                    </div>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button>{t('thanks')}</Button>
                                  </Modal.Footer>
                                </div>
                              </Modal>
                              <Button onClick={cancel}>
                                <span className="form-button-title">
                                  {t('loan-confirm.cancel')}
                                </span>
                              </Button>
                              <Button type="submit">
                                <span className="form-button-title">
                                  {t('repay-loan.repay-loan')}
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
            show={showSubmit}
            onHide={() => setShowSubmit(false)}
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
                        дугаартай зээлийн эргэн төлөлт амжилттай хийгдлээ.
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
      )}
    </>
  );
};

export default CreditReturn;
