import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { AutoTabProvider } from 'react-auto-tab';
import axios from 'axios';
import FailNotification from '../notification/fail-notif';
import Notification from '../notification/index';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const TabPaymentOther = (props) => {
  const [validated, setValidated] = useState(false);
  const [billProducts, setBillProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [selectedProd, setSelectedProd] = useState(null);
  const [addPhoneNumber, setAddPhoneNumber] = useState();
  const [alert, setAlert] = useState({ show: false });
  const router = useRouter();

  const [notification, setNotification] = useState({ show: false });
  const { t } = useTranslation('payment');
  const [addAmount, setAddAmount] = useState(0);
  const [checkedOne, setCheckedOne] = useState(false);
  const [checkedTwo, setCheckedTwo] = useState(false);
  const [forDisabled, setForDisabled] = useState(false);
  const [response, setResponse] = useState({});

  const handleChangeOne = () => {
    setCheckedOne(!checkedOne);
    setCheckedTwo(false);
  };

  const handleChangeTwo = () => {
    setCheckedTwo(!checkedTwo);
    setCheckedOne(false);
  };

  useEffect(() => {
    async function fetchData() {
      const billData = await axios(`/api/bill-hub/bill-products`);
      setBillProducts(billData.data.result);
      setSelectedProd(billData.data.result[0]);
    }

    fetchData();
  }, []);

  const handleCheck = (value) => {
    if (value.target.value.length > 0) {
      setForDisabled(true);
    } else {
      setForDisabled(false);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity() === false) {
    } else {
      if (form.code1) {
        const pin = `${form.code1.value}${form.code2.value}${form.code3.value}${form.code4.value}`;
        const body = {
          amount: addAmount.target?.value,

          pin: pin,
          billProdId: selectedProd
            ? selectedProd.billProdId
            : billProducts[0].billProdId,
          billerUid: addPhoneNumber,
          custNo: event.target.custNumber?.value,
        };
        axios.post('/api/bill-hub/bill-pay', body).then(
          (resp) => {
            setResponse({ ...resp.data.info, success: true });
            setShow(true);
            setShowPin(false);
          },
          (error) => {
            if (error.response.data.info) {
              setShow(true);
              setShowPin(false);
              setResponse({
                ...error.response?.data,
                success: false,
              });
            }

            event.stopPropagation();
          }
        );
      } else {
        setShow(true);
      }
    }
    setValidated(true);
  };
  const setPhoneNumber = (value) => {
    if (value && value?.length == 8) {
      setAddPhoneNumber(value);
      // clickFunction(value);
    }
  };
  const handleSelect = (event) => {
    const index = event?.currentTarget?.value;
    if (index) setSelectedProd(billProducts[index]);
  };

  const handleClose = () => setShow(false);
  const closeNotification = () => {
    setAlert(null);
  };
  const handleModal = () => {
    setShow(false);
    if (response.success) {
      router.push('/app/dashboard');
    } else {
      router.back();
    }
  };

  const handleShowPin = () => {
    setShowPin(true);
  };

  return (
    <div className="content-other">
      <div className="tab-container-top">
        <div className="tab-top">
          <h3>{t('other-payments.title')}</h3>
        </div>
        <div className="form-top-title">
          <h6>{t('other-payments.desc')}</h6>
        </div>
      </div>
      <div className="form-payment-other">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Label className="form-label-title">
            <h6>{t('other-payments.service')}</h6>
          </Form.Label>
          {billProducts.length > 0 && (
            <Form.Select
              aria-label="Default select example"
              className="form-select-payment"
              onChange={handleSelect}
              defaultValue={billProducts[0].billProdId}
            >
              {billProducts?.map((Prodname, index) => {
                return (
                  <option value={index} className="label-item" key={index}>
                    {Prodname.billProductName}
                  </option>
                );
              })}
            </Form.Select>
          )}
          <Form.Group className="form-phone" controlId="formGroupPassword">
            <Form.Label
              className="form-phone-text"
              style={{ paddingTop: '12px' }}
            >
              {selectedProd?.billProductName}
            </Form.Label>
            <Form.Control
              required
              type="number"
              name="phoneNumber"
              placeholder={selectedProd?.billProductSetting.billerUidParamName}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                handleCheck(e);
              }}
            />
            <Form.Control.Feedback type="invalid">
              {t('rec-acc-number')}
            </Form.Control.Feedback>
          </Form.Group>
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
          <Form.Group className="form-phone" controlId="formGroupPassword">
            <Form.Label>{t('other-payments.amount')}</Form.Label>
            <Form.Control
              type="number"
              name="amountTotal"
              placeholder="Мөнгөн дүн"
              onChange={(value) => {
                setAddAmount(value);
              }}
            />
          </Form.Group>
          {checkedTwo == true ? (
            <Form.Group
              className="form-phone"
              controlId="formGroupPassword"
              style={{ paddingBottom: '32px' }}
            >
              <Form.Label style={{ paddingTop: '12px' }}>
                {t('single-payment.org-id')}
              </Form.Label>
              <Form.Control
                required
                type="text"
                name="custNumber"
                placeholder={t('single-payment.org-id')}
                onKeyPress={(event) => {
                  if (isNaN(event.key)) event.preventDefault();
                }}
                autoComplete="off"
                maxLength={10}
              />
            </Form.Group>
          ) : (
            <></>
          )}
          <div style={{ borderTop: '1px solid #E8EDF5' }}>
            <Button
              onClick={handleShowPin}
              className="form-button"
              disabled={!forDisabled}
            >
              <span className="form-button-title">
                {t('other-payments.continue')}
              </span>
            </Button>
          </div>
          <Modal
            show={showPin}
            onHide={() => setShowPin(false)}
            dialogClassName="transfer-modal"
            centered
          >
            <Modal.Header>
              <div className="content">
                <span>{t('single-payment.enter-pin')}</span>
              </div>
            </Modal.Header>
            <Modal.Body>
              <div>
                <Form className="email-confirm-code">
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
                      <Button
                        name="pinconfirm"
                        type="submit"
                        onClick={handleClose}
                      >
                        {t('other-payments.continue')}
                      </Button>
                    </div>
                  </AutoTabProvider>
                </Form>
              </div>
            </Modal.Body>
          </Modal>
        </Form>
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
      </div>
    </div>
  );
};
export default TabPaymentOther;
