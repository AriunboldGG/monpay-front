import Sidebar from 'components/sidebar/control';
import AccountSidebar from 'components/sidebar/account';
import Topbar from 'components/topbar';
import React, { useState, useContext, useRef } from 'react';
import {
  Container,
  Col,
  Row,
  Button,
  Modal,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { AutoTabProvider } from 'react-auto-tab';
import AccountInfo from 'pages/app/account-info';
import IctContext from 'context/ict-context';
import { useRouter } from 'next/router';
import axios from 'axios';
import FailNotification from 'components/notification/fail-notif';
import useTranslation from 'next-translate/useTranslation';

const TransferConfirm = (props) => {
  const { transferInfo } = useContext(IctContext);
  const [checked, setChecked] = useState(false);
  const [response, setResponse] = useState({});
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [alert, setAlert] = useState({ show: false });
  const [imgSource, setImgSource] = useState('');
  const [validated, setValidated] = useState(false);
  const { t } = useTranslation('account');
  const formreset = useRef(null);

  React.useEffect(() => {
    if (!transferInfo || !transferInfo.bank?.bankCode) {
      router.push('/app/dashboard/account/transfer?type=bank');
    }
    setImgSource(
      `/banks/${transferInfo?.bank.bankCode?.toLowerCase()}-logo.png`
    );
  }, []);

  const toggleHandler = (e) => {
    setChecked(e.target.checked);
  };

  const handleBack = () => {
    router.back('');
  };

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
            setShow(true);
            setResponse({ ...resp.data.result, success: true });
          },
          (error) => {
            setShow(true);
            setResponse({
              ...error.response.data,
              success: false,
            });
          }
        );
        if (checked) {
          const template = createTemplate(form.template.value);
          axios.post('/api/account/transfer-template', template).then(
            (resp) => {},
            (error) => {
              setAlert({
                show: true,
                message: error.response?.data?.info,
              });
              event.stopPropagation();
            }
          );
        }
      } else {
        //TODO: Handle invalid pin
      }
    }
    setValidated(true);
  };

  const createBody = (pin) => {
    const body = {};
    const reqBody = transferInfo.bank;
    body.bankName = reqBody.bankCode;
    body.bankAccount = reqBody.bankAccount;
    body.bankAccountName = reqBody.bankAccountName;
    body.amount = Number(reqBody.amount);
    body.decription = reqBody.description;
    body.srcAccountNo = reqBody.srcAccountNo;
    body.pin = pin;
    return body;
  };

  const createTemplate = (name) => {
    const body = {};
    const reqBody = transferInfo.bank;
    body.destBankCode = reqBody.bankCode;
    body.destAccountNo = reqBody.bankAccount;
    body.destCustomerName = reqBody.bankAccountName;
    body.destBankName = reqBody.bankName;
    body.decription = reqBody.description;
    body.templateName = name;
    return body;
  };

  const handleClose = () => {
    setShow(false);
    formreset.current.reset();
    if (response.success) {
      window.location.reload();
      router.push('/app/dashboard');
    }
  };

  const closeNotification = () => {
    setAlert(null);
  };

  const nameArray = transferInfo?.bank?.bankAccountName?.split(' ') || [];
  const newStr =
    nameArray.length > 1
      ? nameArray[0] +
        ' ' +
        nameArray[1]?.replace(
          nameArray[1].substr(1, nameArray[1].length - 0),
          nameArray[1].substr(1, nameArray[1].length - 3).replace(/./g, '*')
        )
      : '';
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
                  <Row>
                    <Col>
                      <div className="deposit-tab">
                        <div className="title">
                          <h5>{t('account-conf.conf-transfer')}</h5>
                        </div>
                        <div className="confirm-1">
                          <div className="confirm-title-out">
                            <span className="confirm-title">
                              {t('account-conf.to-bank-transfer')}
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
                                    <img src={imgSource} />
                                  </div>
                                  {transferInfo?.bank?.bankName}
                                </span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.recipient-account')}
                                </h5>
                                <span className="number">
                                  {transferInfo?.bank?.bankAccount}
                                </span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.recipient-name')}
                                </h5>
                                <span className="number">{newStr}</span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.amount')}
                                </h5>
                                <span className="number">
                                  {transferInfo?.bank?.amount || '0.00'}₮
                                </span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.transaction-value ')}
                                </h5>
                                <span className="number">
                                  {transferInfo?.bank?.description}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Form
                            ref={formreset}
                            className="email-confirm-code"
                            onSubmit={handleSubmit}
                          >
                            <div className="label-title">
                              <h5>{t('account-conf.trans-pin')}</h5>
                            </div>
                            <AutoTabProvider>
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
                                      tabbable="true"
                                      onKeyPress={(event) => {
                                        if (isNaN(event.key))
                                          event.preventDefault();
                                      }}
                                      autoComplete="off"
                                      inputMode="numeric"
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
                                      tabbable="true"
                                      onKeyPress={(event) => {
                                        if (isNaN(event.key))
                                          event.preventDefault();
                                      }}
                                      autoComplete="off"
                                      inputMode="numeric"
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
                                      tabbable="true"
                                      onKeyPress={(event) => {
                                        if (isNaN(event.key))
                                          event.preventDefault();
                                      }}
                                      autoComplete="off"
                                      inputMode="numeric"
                                      required
                                    />
                                  </div>
                                </li>
                              </ul>
                            </AutoTabProvider>

                            <div className="confirm-bank">
                              <div className="save-template">
                                <span>{t('account-conf.save-template')}</span>
                                <div className="switch d-flex">
                                  <Form.Control
                                    type="checkbox"
                                    id="unchecked-default"
                                    defaultChecked={checked}
                                    onChange={toggleHandler}
                                  />
                                  <Form.Label
                                    htmlFor="unchecked-default"
                                    className="cr"
                                  />
                                </div>
                              </div>
                              {checked && (
                                <div className="input-item">
                                  <InputGroup hasValidation>
                                    <Form.Control
                                      required={checked}
                                      type="text"
                                      placeholder="Загварын нэр"
                                      name="template"
                                      onWheel={(e) => e.target.blur()}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {t('account-conf.pls-enter-temp')}
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </div>
                              )}
                            </div>
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
                <h5>{t('transfer')}</h5>
                <h5>{response.success ? 'амжилттай' : 'амжилтгүй'}</h5>
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
      {alert?.show && (
        <FailNotification
          show={alert.show}
          infos={alert.message}
          close={closeNotification}
        ></FailNotification>
      )}
    </Container>
  );
};

export default TransferConfirm;
