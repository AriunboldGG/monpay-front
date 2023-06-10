import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Button, ProgressBar, Form } from 'react-bootstrap';
import Link from 'next/link';
import IctContext from 'context/ict-context';
import { getFullInfo } from 'service/user';
import moment from 'moment';
import axios from 'axios';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const FeaturedInfo = (props) => {
  const { info, billAmount, setUserInfo, setLogout, setBillInfoAmount } =
    useContext(IctContext);
  const [show, setShow] = useState(false);
  const [loanInfo, setLoanInfo] = useState([]);
  const [loanValue, setLoanValue] = useState({});
  const [loanFilterInfo, setLoanFilterInfo] = useState(false);
  const [billProducts, setBillProducts] = useState([]);
  const [loanFail, setLoanFail] = useState(true);
  const [loanFilterValue, setLoanFilterValue] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkboxUserId, setCheckboxUserId] = useState(false);
  const [active, setActive] = useState(false);
  const { maxLoan, setMax } = useContext(IctContext);
  const { t } = useTranslation('dashboard');

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      var lastUpdated = moment(info?.lastUpdated);
      var now = moment(new Date());
      if (!info || now.diff(lastUpdated, 'seconds') > 10) {
        getFullInfo().then(
          (resp) => {
            if (resp) {
              clearInterval(interval);
              setUserInfo(resp);
            }
          },
          (error) => {
            if (error && error.status === 401) {
              setLogout();
            }
          }
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const billData = await axios(`/api/bill-hub/bill-products`).catch(
        (error) => {
          if (error && error.status === 401) {
            setLogout();
          }
        }
      );
      if (billData) setBillProducts(billData.data.result);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const products = await axios
        .get('/api/credit/loan-info')
        .then((resp) => {
          setLoanInfo(resp.data);
          setLoanFilterInfo(true);
          return resp.data;
        })
        .catch((error) => {
          return [];
        });
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const products = await axios
        .get('/api/credit/loan-products')
        .then((resp) => {
          setLoanValue(resp.data);
          setLoanFilterValue(true);
          return resp.data.possibleProduct;
        })
        .catch((error) => {
          return [];
        });
      const max = [];
      products.map((d) => {
        max.push(d.amount);
      });
      products.filter((item) => {
        if (item.isActive === false) {
          setLoanFail(true);
        }
      });
      setMax(Math.max(...max));
    }
    fetchData();
  }, []);

  const handleFilter = (value) => {
    setBillInfoAmount(value);
    setActive(value);
    setCheckboxUserId(true);
  };

  const handlePush = () => {
    router.push('/app/dashboard/credit');
  };

  const toggle = () => {
    const state = show;
    setShow(!state);
  };

  const thousands = /\B(?=(\d{3})+(?!\d))/g;

  return (
    <Row className="dashboard-features" style={{ marginBottom: '24px' }}>
      <Col xl={9} xs={12} lg={9}>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <div className="mp-wallet background">
              <div className="content">
                <div className="content-inner">
                  <div className="logo">
                    <img src="/features-icon-monpay.svg" />
                  </div>
                  <div className="mp-current-wallet">
                    <div className="content-item">
                      <h6>{t('balance')}</h6>
                      <div className={show ? 'hide' : 'show'}>
                        <img onClick={toggle} src="/account-icon-on.svg" />
                      </div>
                    </div>
                    <span>
                      {show
                        ? '***.***'
                        : info?.balance.toString().replace(thousands, ',') ??
                          '0.00'}
                      ₮
                    </span>
                  </div>
                  <div className="mp-wallet-id">
                    <h6>{t('mp-account')}</h6>
                    <span>{info?.accountNo}</span>
                    <CopyToClipboard
                      text={info?.accountNo}
                      onCopy={() =>
                        alert(
                          !copied ? 'Дансны дугаар амжилттай хуулагдлаа' : null
                        )
                      }
                    >
                      <div className="icon">
                        <img src="/dbicon-copy.svg" />
                      </div>
                    </CopyToClipboard>
                  </div>
                </div>
              </div>
              <div className="Buttons">
                <div className="button-item">
                  <Link href="/app/dashboard/account">
                    <Button className="button-left">
                      <div className="item-inner">
                        <img src="/features-icon-add.svg" />
                        <h5>{t('charge')}</h5>
                      </div>
                    </Button>
                  </Link>
                </div>
                <div className="button-item">
                  <Link href="/app/dashboard/account/transfer">
                    <Button className="button-right">
                      <div className="item-inner">
                        <img src="/features-icon-transfer.svg" />
                        <h5>{t('transfer')}</h5>
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Col>
          {/* <Col xs={12} md={12} lg={6}>
            {loanFilterValue === false && loanFilterInfo === false ? (
              <div
                className="mp-wallet loan contract"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #E8EDF5',
                  height: '100%',
                }}
              >
                <div className="content">
                  <div className="content-inner">
                    <div className="image-out">
                      <img src="/icon-history-dashboard.svg" />
                    </div>
                    <div className="texts">
                      <span className="descreption">{t('desc')}</span>
                      <span className="descreption">
                        {t('close-you')}
                        <strong
                          style={{
                            color: '#4341CC',
                            margin: '0 2px',
                          }}
                        >
                          {t('title-1')}
                        </strong>
                        {t('title-2')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : loanFilterValue === true && loanFilterInfo === false ? (
              <div
                className="mp-wallet loan possibble"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #E8EDF5',
                }}
              >
                <div className="content">
                  <div className="content-inner">
                    <div className="mp-current-wallet">
                      <h6>{t('possible-products')}</h6>
                    </div>
                    <div className="boxes">
                      <ul>
                        {loanValue.possibleProduct
                          .slice(0, 4)
                          .map((item, i) => (
                            <div key={i}>
                              <li onClick={() => handleFilter(i)}>
                                <div
                                  className={
                                    active === i ? 'contentt' : 'contents'
                                  }
                                >
                                  <div className="dashboard-loan-check">
                                    <Form.Check
                                      inline
                                      name="group1"
                                      type="radio"
                                      id={`inline-1`}
                                      checked={active === i ? true : false}
                                    />
                                  </div>
                                  <div className="numbers">
                                    <span className="loan-currency">
                                      {item.amount
                                        .toString()
                                        .replace(thousands, ',')}
                                      ₮
                                    </span>
                                    <span className="loan-interest">
                                      {(Number(item?.interest) * 100).toFixed(
                                        1
                                      ) || '0.00'}
                                      %
                                    </span>
                                  </div>
                                </div>
                              </li>
                            </div>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="button-item">
                  <Button onClick={handlePush} disabled={!checkboxUserId}>
                    <div className="item-inner">
                      <img src="/dashboard-icon-arrow-right.svg" />
                      <h5>{t('get-loan')}</h5>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="mp-wallet loan"
                style={{
                  borderRadius: '8px',
                  border: '1px solid #E8EDF5',
                }}
              >
                <div className="content">
                  {loanInfo.map((item, i) => {
                    return (
                      <div className="content-inner" key={i}>
                        <div className="mp-current-wallet">
                          <h6>{t('loan-balance')}</h6>
                          <span>{item?.balanceUI}₮</span>
                        </div>
                        <div className="progress-out">
                          <ProgressBar now={item?.balance} max={maxLoan} />
                        </div>
                        <div className="bottom-content">
                          <div className="left">
                            <h6>{t('remaining-days')}</h6>
                          </div>
                          <div className="right">
                            <h6>
                              {item
                                ? item?.lastCycle?.remainingDays
                                : item?.payCycle.remainingDays}
                              <div>{t('days')}</div>
                            </h6>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="button-item">
                  <Link href="/app/dashboard/credit">
                    <Button>
                      <div className="item-inner">
                        <img src="/dashboard-icon-arrow-right.svg" />
                        <h5>{t('loan-repay')}</h5>
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Col> */}
        </Row>
      </Col>
      <Col xl={3} xs={12} lg={3}>
        <div
          className="transaction-template"
          style={{
            borderRadius: '8px',
            border: '1px solid #E8EDF5',
          }}
        >
          <div className="content">
            <div className="title">
              <h6>{t('consumption-fee')}</h6>
            </div>
            <div className="images" style={{ display: 'flex' }}>
              {billProducts.map((item, i) => (
                <div className="content" key={i}>
                  <Link href="/app/dashboard/payment">
                    <div className="image-item">
                      <img className="image2" src={item.icon} alt="Bill icon" />
                    </div>
                  </Link>
                  <h5>{item.billProductCode}</h5>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default FeaturedInfo;
