import Sidebar from 'components/sidebar/control';
import AccountSidebar from 'components/sidebar/account';
import Topbar from 'components/topbar';
import React, { useContext, useState } from 'react';
import useSWR from 'swr';
import {
  Col,
  Container,
  Row,
  Tabs,
  Tab,
  Button,
  InputGroup,
  Form,
  Modal,
} from 'react-bootstrap';
import IctContext from 'context/ict-context';
import { AutoTabProvider } from 'react-auto-tab';
import AccountInfo from 'pages/app/account-info';
import axios from 'axios';
import FailNotification from 'components/notification/fail-notif';
import Notification from 'components/notification/index';
import useTranslation from 'next-translate/useTranslation';
import CurrencyInput from 'react-currency-input-field';

const Account = ({ props }) => {
  const [recharge, setRecharge] = useState('');
  const [show, setShow] = useState(false);
  const [responseShow, setResponseShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [addAmount, setAddAmount] = useState();
  const [pinCode, setPinCode] = useState();
  const [amountShow, setAmountShow] = useState(false);
  const [boxChecked, setBoxChecked] = useState(false);
  const [currentTab, setCurrentTab] = useState('bankRecharge');
  const [response, setResponse] = useState({});
  const [alert, setAlert] = useState({ show: false });
  const [notification, setNotification] = useState({ show: false });
  const [rechargeError, setRechargeError] = useState({});
  const [checkboxUserId, setCheckboxUserId] = useState();
  const [showDelete, setShowDelete] = useState(false);
  const [totalAmount, setTotalAmount] = useState();
  const [active, setActive] = useState(false);

  const { sale, info } = useContext(IctContext);
  const { t } = useTranslation('account');

  const shouldFetch = true;
  const fetcher = async (url) =>
    await axios.get(url).then((res) => {
      shouldFetch = false;

      sale = res.data.result;
      return sale;
    });

  const { data, error } = useSWR(
    shouldFetch ? `/api/accountRecharge/visa_card/etoken-card` : null,
    fetcher
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(false);
    } else {
      setValidated(true);
      if (currentTab === 'bankRecharge') {
        const body = {
          amount: parseInt(addAmount),
        };
        axios.post('/api/accountRecharge/recharge', body).then(
          (resp) => {
            setRecharge(resp.data.result);
            setNotification({
              show: true,
              message: resp.data?.info,
            });
          },
          (error) => {
            setAlert({
              show: true,
              message: error.response?.data?.info,
            });
          }
        );
      } else if (currentTab === 'cardRecharge') {
        setAmountShow(true);
      }
    }
    setValidated(true);
  };
  const handleSubmitPin = (event) => {
    const form = event.target;
    if (form.checkValidity() === false) {
      event.preventDefault();
    } else {
      event.preventDefault();
      const pin = `${form.code1.value}${form.code2.value}${form.code3.value}${form.code4.value}`;
      const body = {
        pin: pin,
      };
      axios.post('/api/accountRecharge/visa_card/add-card', body).then(
        (resp) => {
          window.location.href = resp.data.result;
        },
        (error) => {
          setAlert({
            show: true,
            message: error.response?.data?.info,
          });
          if (error.response.data) {
            setShow(false);
          }
        }
      );
    }
  };
  const deleteSubmit = () => {
    const params = {
      cardId: checkboxUserId,
    };
    axios
      .delete(`/api/accountRecharge/visa_card/etoken-card-delete`, {
        params,
      })
      .then(
        (resp) => {
          setNotification({
            show: true,
            message: resp.data?.info,
          });
          setAmountShow(false);
        },
        (error) => {
          setAlert({
            show: true,
            message: error.response?.data?.info,
          });
          setAmountShow(false);
        }
      );
  };
  const handleSubmitCharge = (event) => {
    event.preventDefault();

    const form = event.target;

    if (form.checkValidity() === false) {
    } else {
      const pin = `${form.code1.value}${form.code2.value}${form.code3.value}${form.code4.value}`;
      const body = {
        user_id: info?.userId,
        card_id: checkboxUserId,
        amount: parseInt(totalAmount),
        pin: pin,
        account: info?.accountNo,
        profile_type: '1',
      };
      axios.post('/api/accountRecharge/visa_card/cart-charge', body).then(
        (resp) => {
          setResponse(resp.data);
          handleClose();
          setResponseShow(true);
        },
        (error) => {
          setAmountShow(false);

          setAlert({
            show: true,
            message: error.response?.data?.info,
          });
        }
      );
    }
  };

  const showMessage = () => {
    setTimeout(() => {
      setRechargeError('');
    }, 5000);
  };

  const handleClose = () => setAmountShow(false);

  const handleFilter = (value, e) => {
    value.checked = e.target.checked;
    setCheckboxUserId(value?.id);
    checked();
  };

  const checked = (val) => {
    if (boxChecked === false) {
      setBoxChecked(true);
    } else {
      setBoxChecked(false);
    }
  };

  const handleModal = () => {
    setResponseShow(false);
  };

  const handleTab = async (key) => {
    setCurrentTab(key);
  };

  const closeNotification = () => {
    setAlert(null);
  };

  const handleCloseDelete = () => setShowDelete(false);
  const handleChange = (e) => {
    e.preventDefault();
    const { value = '' } = e.target;
    const parsedValue = value.replace(/[^\d.]/gi, '');
    setAddAmount(parsedValue);
  };

  const handleOnBlur = () => setAddAmount(Number(addAmount).toFixed(2));
  const handleChangeCard = (e) => {
    e.preventDefault();
    const { value = '' } = e.target;
    const parsedValue = value.replace(/[^\d.]/gi, '');
    setTotalAmount(parsedValue);
  };

  const handleOnBlurCard = () => setTotalAmount(Number(totalAmount).toFixed(2));

  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col className="dashboard-right-side" lg={10}>
          <Row>
            <Col style={{ borderBottom: '1px solid #E8EDF5' }} className="p-0">
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
                          <h5>{t('account-charge.title')}</h5>
                        </div>
                        <div className="deposit-tab-content">
                          <Form
                            validated={validated}
                            name="bankRecharge"
                            onSubmit={handleSubmit}
                          >
                            <Tabs
                              id="controlled-tab-example"
                              defaultActiveKey="bankRecharge"
                              onSelect={handleTab}
                              className="recharge-tab"
                            >
                              <Tab
                                eventKey="bankRecharge"
                                title={t('account-charge.with-bank-app')}
                              >
                                <div className="content">
                                  <div className="custom-title">
                                    <h5>{t('account-charge.charge-amount')}</h5>
                                  </div>

                                  <div className="input-item">
                                    <InputGroup hasValidation>
                                      <CurrencyInput
                                        onWheel={(e) => e.target.blur()}
                                        name="fundAmount"
                                        id="currencyInput"
                                        data-number-to-fixed="2"
                                        data-number-stepfactor="100"
                                        value={addAmount}
                                        placeholder={t(
                                          'account-charge.enter-charge'
                                        )}
                                        onChange={handleChange}
                                        onBlur={handleOnBlur}
                                        required={currentTab === 'bankRecharge'}
                                        allowDecimals
                                        decimalsLimit="2"
                                        disableAbbreviations
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {t('account-charge.enter-charge')}
                                      </Form.Control.Feedback>
                                    </InputGroup>

                                    <Button
                                      type="submit"
                                      variant="primary"
                                      disabled={!addAmount}
                                    >
                                      {t('account-charge.charge-button')}
                                    </Button>
                                  </div>
                                  {recharge ? (
                                    <div>
                                      <div className="qr-image">
                                        <img
                                          src={
                                            'data:image/jpeg;base64, ' +
                                            recharge.qPay_QRimage
                                          }
                                          alt="Qpay code"
                                        />
                                      </div>
                                      <div className="desc">
                                        <p>{t('account-transfer.desc')}</p>
                                      </div>
                                      <div className="images-of-bank">
                                        <div className="item">
                                          <img src="/khanbank-logo.png" />
                                        </div>
                                        <div className="item">
                                          <img src="/tb-logo.png" />
                                        </div>
                                        <div className="item">
                                          <img src="/mostmoney-logo.png" />
                                        </div>
                                        <div className="item">
                                          <img src="/tdb-logo.png" />
                                        </div>
                                      </div>
                                      <div className="bottom">
                                        <div className="item">
                                          <img src="/xac-logo.png" />
                                        </div>
                                        <div className="item">
                                          <img src="/bank-app-2.svg" />
                                        </div>
                                        <div className="item">
                                          <img src="/bank-app-3.svg" />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </Tab>
                              <Tab
                                eventKey="cardRecharge"
                                title={t('account-charge.use-card')}
                              >
                                <div className="content">
                                  <div className="title">
                                    <h5>{t('account-charge.choose-card')}</h5>
                                  </div>
                                  <div className="card-section">
                                    {data?.map((cat, i) => (
                                      <div
                                        style={{
                                          display: 'flex',
                                        }}
                                        key={i}
                                      >
                                        <div className="card-item">
                                          <div
                                            onClick={(e) =>
                                              handleFilter(cat, e)
                                            }
                                            className={
                                              boxChecked
                                                ? 'card-item-inner clicked'
                                                : 'card-item-inner'
                                            }
                                          >
                                            <div className="card-image">
                                              <img src="/card-icon.svg" />
                                            </div>
                                            <div className="content-inner">
                                              <span className="card-number">
                                                {cat.card_number}
                                              </span>
                                              <h6 className="ppl-name">
                                                {cat.card_holder}
                                              </h6>
                                            </div>
                                            <div className="check-box">
                                              <Form.Check
                                                name="group1"
                                                type="radio"
                                                id={`inline-1`}
                                                key={cat.id}
                                                onChange={(e) =>
                                                  handleFilter(cat, e)
                                                }
                                                checked={boxChecked}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          className="delete-btn"
                                          onClick={() => setShowDelete(true)}
                                          disabled={!boxChecked}
                                        >
                                          <img src="/deposit-icon-delete.svg" />
                                        </button>
                                      </div>
                                    ))}
                                    <div className="add-new-card">
                                      <Button
                                        variant="primary"
                                        onClick={() => setShow(true)}
                                      >
                                        <img src="/icon-add-card.svg" />
                                        <h6>
                                          {t('account-charge.add-new-card')}
                                        </h6>
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="bot-side">
                                    <div className="title">
                                      <h5>
                                        {t('account-charge.charge-amount')}
                                      </h5>
                                    </div>
                                    <div className="input-item">
                                      <CurrencyInput
                                        onWheel={(e) => e.target.blur()}
                                        name="rechargeNumber"
                                        id="rechargeNumber"
                                        data-number-to-fixed="2"
                                        data-number-stepfactor="100"
                                        value={addAmount}
                                        placeholder={t(
                                          'account-charge.charge-amount'
                                        )}
                                        onChange={handleChangeCard}
                                        onBlur={handleOnBlurCard}
                                        required={currentTab === 'cardRecharge'}
                                        allowDecimals
                                        decimalsLimit="2"
                                        disableAbbreviations
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {t('account-charge.enter-charge')}!
                                      </Form.Control.Feedback>
                                      <Button
                                        type="submit"
                                        disabled={!checkboxUserId}
                                      >
                                        {t('account-charge.continue')}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Tab>
                            </Tabs>
                          </Form>
                        </div>
                      </div>
                    </Col>
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
              </Row>
            </div>
          </Row>
        </Col>
        <Modal
          show={amountShow}
          onHide={() => setAmountShow(false)}
          dialogClassName="transfer-modal"
          centered
        >
          <Modal.Header>
            <div className="content">
              <span>Гүйлгээний пин кодоо оруулна уу</span>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Form
                className="email-confirm-code"
                onSubmit={handleSubmitCharge}
              >
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
                              if (isNaN(event.key)) event.preventDefault();
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
                              if (isNaN(event.key)) event.preventDefault();
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
                              if (isNaN(event.key)) event.preventDefault();
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
                              if (isNaN(event.key)) event.preventDefault();
                            }}
                            autoComplete="off"
                            inputMode="numeric"
                          />
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="tw-single-button">
                    <Button name="pinconfirm" type="submit">
                      {t('account-charge.continue')}
                    </Button>
                  </div>
                </AutoTabProvider>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={responseShow}
          onHide={() => handleModal()}
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
                <div className="title">{response?.info}</div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleModal}>{t('thanks')}</Button>
            </Modal.Footer>
          </div>
        </Modal>
        <Modal
          show={show}
          onHide={() => setShow(false)}
          dialogClassName="transfer-modal"
          centered
        >
          <Modal.Header>
            <div className="content">
              <span>{t('account-conf.trans-pin')}</span>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div>
              <Form className="email-confirm-code" onSubmit={handleSubmitPin}>
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
                              if (isNaN(event.key)) event.preventDefault();
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
                              if (isNaN(event.key)) event.preventDefault();
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
                              if (isNaN(event.key)) event.preventDefault();
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
                              if (isNaN(event.key)) event.preventDefault();
                            }}
                            autoComplete="off"
                            inputMode="numeric"
                          />
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="tw-single-button">
                    <Button name="pinconfirm" type="submit">
                      {t('account-charge.continue')}
                    </Button>
                  </div>
                </AutoTabProvider>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          show={showDelete}
          onHide={() => handleCloseDelete()}
          dialogClassName="delete-template"
          centered
        >
          <Modal.Header closeButton>
            <div className="header-title">
              <h5>{t('record-delete')}</h5>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div className="template-body">
              <h5>{t('sure')}</h5>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div
              style={{
                display: 'flex',
                margin: 0,
              }}
            >
              <Button onClick={deleteSubmit}>{t('yes')}</Button>
            </div>
          </Modal.Footer>
        </Modal>
      </Row>
    </Container>
  );
};

export default Account;
