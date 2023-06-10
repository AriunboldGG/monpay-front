import React, { useState, useEffect, useContext } from 'react';
import Sidebar from 'components/sidebar/control';
import { Col, Container, Row, Form, Button, Modal } from 'react-bootstrap';
import Topbar from 'components/topbar';
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import AccountInfo from 'pages/app/account-info';
import IctContext from 'context/ict-context';
import { useRouter } from 'next/router';
import CreditNoClient from './service';
import CreditReturn from './active-credit';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

const Credit = (props) => {
  const [show, setShow] = useState(false);
  const [serviceShow, setServiceShow] = useState(false);
  const router = useRouter();
  const [loanInfo, setLoanInfo] = useState({});
  const [productIsActive, setProductIsActive] = useState({});
  const [loanTestInfo, setIoanTestInfo] = useState(false);
  const [loanTestValue, setIoanTestValue] = useState(false);
  const [loanFail, setLoanFail] = useState(true);
  const [lastDate, setLastDate] = useState('');
  const [beginDate, setBeginDate] = useState('');
  const [sliderValue, setSliderValue] = useState('');
  const [checkboxDetected, setCheckboxDetected] = useState(false);
  const { billAmount } = useContext(IctContext);
  const { t } = useTranslation('loan');
  const [loanValue, setLoanValue] = useState({});
  const { setLoan, setMax } = useContext(IctContext);
  const [error, setError] = useState('');
  let dayjs = require('dayjs');

  useEffect(() => {
    maxProduct();
    fetchData();
  }, []);

  async function fetchData() {
    const billdata = await axios
      .get('/api/credit/loan-info')
      .then((resp) => {
        setIoanTestInfo(true);
        const date = resp?.data[0].lastCycle.planDate;
        const beginDate = resp?.data[0].payCycle.planDate;
        setLastDate(dayjs(date).format('YYYY-MM-DD'));
        setBeginDate(dayjs(beginDate).format('YYYY-MM-DD'));
      })
      .catch((error) => {});
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (error.code === 3) {
      setServiceShow(true);
    } else {
      const body = {};
      body.amount = Number(loanValue.amount); // зээлийн дүн
      body.interest = loanValue.interest; // зээлийн хүү
      body.month = loanValue.month; // зээлийн сар

      setLoan(body);
      router.push('/app/dashboard/credit/confirm');
    }
  };

  useEffect(() => {
    const sliderIndex = billAmount;

    async function fetchData() {
      const products = await axios
        .get('/api/credit/loan-products')
        .then((resp) => {
          setProductIsActive(resp.data);
          setIoanTestValue(true);
          return resp.data.possibleProduct;
        })
        .catch((error) => {
          return [];
        });

      const max = [];
      const marks = [{ 0: '0' }];
      const marksTemp = [];
      products.map((d) => {
        const map = {};
        map[`${d.amount}`] = prettyInt(d.amount);
        marks.push(map);
        marksTemp.push(prettyInt(d.amount));
        max.push(d.amount);
      });

      setMax(Math.max(...max));
      const dataWithMarks = {
        products: products,
        marks: marksTemp,
      };

      setLoanInfo(dataWithMarks);
      products.filter((item) => {
        if (item.isActive === false) {
          setLoanFail(true);
        }
      });
      setLoanValue(
        dataWithMarks && dataWithMarks?.products[sliderIndex]
          ? dataWithMarks?.products[sliderIndex]
          : dataWithMarks?.products[0]
      );

      setSliderValue(sliderIndex);
    }
    fetchData();
  }, []);

  const maxProduct = () => {
    axios
      .get('/api/credit/loan-product-max')
      .then((resp) => {})
      .catch((error) => {
        if (error.response.data.info.code === 3) {
          setError(error.response.data.info);
        }
      });
  };

  function prettyInt(x) {
    return Math.round(x)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const markChanged = (value) => {
    setLoanValue(loanInfo?.products[value]);
    setSliderValue(value);
  };

  const handleFilter = (value, e) => {
    setCheckboxDetected(true);
    if (error.info) {
      setCheckboxDetected(true);
    } else {
      setCheckboxDetected(false);
    }
  };

  const repayUpdate = () => {
    fetchData();
  };

  let today = new Date();

  let monthTime = loanValue?.month
    ? loanValue.month * 30 * 24 * 60 * 60 * 1000
    : 0;

  let ms = today.getTime() + monthTime;
  let calculatedDate = new Date(ms);

  const calculatedDateData =
    calculatedDate.getFullYear() +
    '.' +
    (calculatedDate.getMonth() + 1) +
    '.' +
    calculatedDate.getDate();

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
                maxWidth: '504px',
                margin: 'auto',
                padding: '0',
              }}
            >
              <AccountInfo />
              <Row style={{ paddingTop: '24px' }}>
                <Col xs={12} lg={12}>
                  {loanTestInfo === false && loanTestValue === false ? (
                    <CreditNoClient />
                  ) : loanTestInfo === false && loanTestValue === true ? (
                    <Form onSubmit={handleSubmit}>
                      <div
                        className={
                          loanFail
                            ? 'credit-container-top'
                            : 'credit-container-top fail'
                        }
                      >
                        <div className="tab-container-top">
                          <div className="tab-top">
                            <h3>{t('loan.get-loan-title')}</h3>
                          </div>
                          <div className="form-top-title">
                            <h6>{t('loan.get-desc')}</h6>
                          </div>
                        </div>
                        <div className="credit-range">
                          <h4>{t('loan.get-loan-amount')}</h4>
                          <div className="current-value">
                            <span>{loanValue?.amountUI}₮</span>
                          </div>
                          <div className="credit-range-item">
                            {(loanInfo?.marks?.length && (
                              <Slider
                                value={sliderValue}
                                marks={
                                  loanInfo.marks.length
                                    ? loanInfo.marks.length > 1
                                      ? [
                                          loanInfo.marks[0],
                                          loanInfo.marks[
                                            loanInfo.marks.length - 1
                                          ],
                                        ]
                                      : [loanInfo.marks[0]]
                                    : []
                                }
                                max={loanInfo.products?.length - 1}
                                onChange={markChanged}
                              />
                            )) ||
                              null}
                          </div>
                        </div>
                        <div className="credit-info">
                          <div className="credit-info-row">
                            <div className="item">
                              <h6>{t('loan.interest-rate')}</h6>
                              <span>
                                {(Number(loanValue?.interest) * 100).toFixed(
                                  1
                                ) || '0.00'}
                                %
                              </span>
                            </div>
                            <div className="item">
                              <h6>{t('loan.loan-term')}</h6>
                              <span>
                                {loanValue?.month * 30}

                                <div>{t('loan.days')}</div>
                              </span>
                            </div>
                          </div>
                          <div className="credit-info-row">
                            <div
                              className="item"
                              style={{
                                borderTop: '1px solid #E8EDF5',
                              }}
                            >
                              <h6>{t('loan.repayment-date')}</h6>
                              <span>{calculatedDateData}</span>
                            </div>
                            <div
                              className="item"
                              style={{
                                borderTop: '1px solid #E8EDF5',
                              }}
                            >
                              <h6>{t('loan.repay-amount')}</h6>
                              <span>
                                {(
                                  loanValue?.interest * loanValue?.amount +
                                  loanValue?.amount
                                )
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                ₮
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="credit-container-bottom">
                          <div className="form-check-radio other-payment">
                            <Form.Check
                              inline
                              required
                              name="group1"
                              type="checkbox"
                              feedbackType="invalid"
                              onChange={(e) => handleFilter()}
                            />
                            <span>
                              {t('loan.im')}
                              <Button
                                onClick={setShow}
                                className="terms-condition"
                              >
                                {t('loan.agree-button')}
                              </Button>
                              {t('loan.agree')}
                            </span>
                          </div>
                          <div
                            style={{
                              padding: '0 32px 32px 32px',
                            }}
                          >
                            <Button
                              type="submit"
                              className="form-button"
                              disabled={!checkboxDetected}
                            >
                              <span className="form-button-title">
                                {t('loan.continue-button')}
                              </span>
                            </Button>
                          </div>
                          <Modal
                            show={show}
                            onHide={() => setShow(false)}
                            dialogClassName="terms-condition-modal"
                            centered
                          >
                            <Modal.Header closeButton>
                              Үйлчилгээний нөхцөл
                            </Modal.Header>
                            <Modal.Body>
                              <div className="body-content">
                                <h5 className="terms-min-title">
                                  Монпэй гэж юу вэ?
                                </h5>
                                <p className="terms-desc">test</p>
                                <h5 className="terms-min-title">
                                  Хэрхэн Монпэй-д бүртгүүлэх вэ?
                                </h5>
                                <p className="terms-desc">test</p>
                                <h5 className="terms-min-title">
                                  Хэрхэн Монпэй-д бүртгүүлэх вэ?
                                </h5>
                                <p className="terms-desc">
                                  Монпэй нь Монгол банкаар баталгаажсан,
                                  Монголын анхны тусгай зөвшөөрөл бүхий үндэсний
                                  цахим төлбөр тооцооны хэрэгсэл юм. Хэрэглэгч
                                  та Монпэй апликейшн ашиглан худалдан авалт
                                  хийх, төлбөр тооцоог хялбар аргаар, түргэн
                                  шуурхай гүйцэтгэхийн зэрэгцээ төрөл бүрийн
                                  өдөр тутмын хэрэгцээт үйлчилгээг ашиглах,
                                  хөнгөлөлт урамшуулалд хамрагдах боломжтой.
                                </p>
                                <h5 className="terms-min-title">
                                  Хэрхэн Монпэй-д бүртгүүлэх вэ?
                                </h5>
                                <p className="terms-desc">
                                  Монпэй нь Монгол банкаар баталгаажсан,
                                  Монголын анхны тусгай зөвшөөрөл бүхий үндэсний
                                  цахим төлбөр тооцооны хэрэгсэл юм. Хэрэглэгч
                                  та Монпэй апликейшн ашиглан худалдан авалт
                                  хийх, төлбөр тооцоог хялбар аргаар, түргэн
                                  шуурхай гүйцэтгэхийн зэрэгцээ төрөл бүрийн
                                  өдөр тутмын хэрэгцээт үйлчилгээг ашиглах,
                                  хөнгөлөлт урамшуулалд хамрагдах боломжтой.
                                </p>
                                <h5 className="terms-min-title">
                                  Хэрхэн Монпэй-д бүртгүүлэх вэ?
                                </h5>
                                <p className="terms-desc">
                                  Монпэй нь Монгол банкаар баталгаажсан,
                                  Монголын анхны тусгай зөвшөөрөл бүхий үндэсний
                                  цахим төлбөр тооцооны хэрэгсэл юм. Хэрэглэгч
                                  та Монпэй апликейшн ашиглан худалдан авалт
                                  хийх, төлбөр тооцоог хялбар аргаар, түргэн
                                  шуурхай гүйцэтгэхийн зэрэгцээ төрөл бүрийн
                                  өдөр тутмын хэрэгцээт үйлчилгээг ашиглах,
                                  хөнгөлөлт урамшуулалд хамрагдах боломжтой.
                                </p>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button onClick={() => setShow(false)}>
                                Хаах
                              </Button>
                            </Modal.Footer>
                          </Modal>

                          <Modal
                            show={serviceShow}
                            onHide={() => setServiceShow(false)}
                            dialogClassName="credit-container-top service"
                            centered
                          >
                            <Modal.Header closeButton>
                              <div className="tab-container-top">
                                <div className="tab-top">
                                  <h3>{t('loan.title')}</h3>
                                </div>
                                <div className="form-top-title">
                                  <h6>{t('loan.descreption')}</h6>
                                </div>
                              </div>
                            </Modal.Header>
                            <Modal.Body>
                              <div className="tw-client-middle">
                                <div className="parent-div">
                                  <div className="tw-middle-img">
                                    <img src="/icon-history-client.svg" />
                                  </div>
                                </div>
                                <div className="tw-middle-title">
                                  <h4>{t('loan.descriptiooooon')}</h4>
                                </div>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <div className="credit-container-bottom">
                                <Link href="/app/dashboard/help">
                                  <Button type="submit" className="form-button">
                                    <div className="tw-form-button-container">
                                      <div className="tw-form-button-img">
                                        <img src="/icon-pin-noclient.svg" />
                                      </div>
                                      <span className="form-button-title">
                                        {t('loan.contract-point')}
                                      </span>
                                    </div>
                                  </Button>
                                </Link>
                              </div>
                            </Modal.Footer>
                          </Modal>
                        </div>
                      </div>
                    </Form>
                  ) : (
                    <CreditReturn />
                  )}
                </Col>
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Credit;
