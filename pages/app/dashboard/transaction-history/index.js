import React, { useState, useContext, useEffect } from 'react';
import Sidebar from 'components/sidebar/control';
import {
  Col,
  Container,
  Row,
  Tab,
  Nav,
  Table,
  Form,
  Pagination,
  Button,
  Modal,
} from 'react-bootstrap';
import Topbar from 'components/topbar';
import IctContext from 'context/ict-context';
import { getFullInfo } from 'service/user';
import moment from 'moment';
import axios from 'axios';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';
import TransactionGraphic from './graphic';
import FailNotification from 'components/notification/fail-notif';
import useTranslation from 'next-translate/useTranslation';
import QRCode from 'react-qr-code';

const TransactionHistory = (props) => {
  //Гүйлгээний түүх

  let dayjs = require('dayjs');
  const [defaultSwitch, setDefaultSwitch] = useState(false);
  const [newValue, setNewValue] = useState([null, null]);
  const [show, setShow] = useState(false);
  const [showEbarimt, setShowEbarimt] = useState(false);
  const [totalSalesList, setTotalSalesList] = useState({});
  const barimtClose = () => setShowEbarimt(false);

  const [params, setParams] = useState({
    offset: 1,
    limit: 50,
    pagingStart: 1,
    beginDate: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  });

  const [paramSales, setParamSales] = useState({
    offset: 0,
    limit: 10,
    pagingStart: 1,
    beginDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  });

  const [salesProducts, setSalesProducts] = useState([]);
  const [saleId, setSaleId] = useState();
  const [ebarimt, setEbarimt] = useState();
  const [selectTab, setSelectTab] = useState('0');
  const [alert, setAlert] = useState({ show: false });
  const { t } = useTranslation('transaction');
  const { info, setUserInfo, setLogout } = useContext(IctContext);
  const { sale } = useContext(IctContext);

  const shouldFetch = true;
  useEffect(() => {
    axios.get(`/api/sales/sales`, { params: paramSales }).then(
      (resp) => {
        setSalesProducts(resp.data.result);
        salesProducts?.map((item) => {
          setSaleId(item.saleId);
        });
      },
      (error) => {}
    );
  }, [paramSales]);

  useEffect(() => {
    var lastUpdated = moment(info?.lastUpdated);
    var now = moment(new Date());
    if (!info || now.diff(lastUpdated, 'seconds') > 10) {
      getFullInfo().then(
        (resp) => {
          if (resp) {
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
  }, []);

  useEffect(() => {
    axios.get(`/api/sales/total`, { params: params }).then(
      (resp) => {
        setTotalSalesList(resp.data);
      },

      (error) => {}
    );
  }, [params]);

  const fetcher = async (url) =>
    await axios.get(url, { params }).then((res) => {
      sale = res.data.result;
      return sale;
    });
  const changeDateRange = (value) => {
    setNewValue(value);
    if (value[0] && value[1]) {
      setParams((params) => ({
        ...params,
        beginDate: value[0],
        endDate: value[1],
      }));
    }
  };

  const nextSubmit = () => {
    if (totalSalesList.result.length > 50) {
      setParams((params) => ({
        ...params,
        offset: params.offset + 50,
      }));
    }
  };

  const prevSubmit = () => {
    setParams((params) => ({
      ...params,
      offset: params.offset - totalSalesList?.result?.length,
    }));
  };

  const nextSubmitSales = () => {
    if (salesProducts.length > 50) {
      setParamSales((paramSales) => ({
        ...paramSales,
        offset: paramSales.offset + 1,
      }));
    }
  };

  const prevSubmitSales = () => {
    setParamSales((paramSales) => ({
      ...paramSales,
      offset: paramSales.offset - salesProducts.length,
    }));
  };

  let depositTotal = 0;
  let withdrawTotal = 0;

  const graphDataTemp = [];
  const graphDataTempincome = [];
  const graphDataTempexpenditur = [];

  if (totalSalesList && totalSalesList.result?.length) {
    totalSalesList?.result.map((d) => {
      const graphSingle = {
        name: '',
        Орлого: 0,
        Зарлага: 0,
      };

      graphSingle.name = d.dateUI;

      if (d.amount >= 0) {
        graphSingle['Орлого'] = d.amount;
        depositTotal += d.amount;
      } else {
        graphSingle['Зарлага'] = d.amount * -1;

        withdrawTotal += d.amount * -1;
      }

      graphDataTemp.push(graphSingle);
    });
  }
  const handlePaging = (value) => {
    setParams((params) => ({
      ...params,
      limit: value.target.value,
      offset: 1,
    }));
  };
  const handlePagingSales = (value) => {
    setParamSales((paramSales) => ({
      ...paramSales,
      limit: value.target.value,
      offset: 1,
    }));
  };
  const toggleHandler = (value) => {
    setDefaultSwitch(!defaultSwitch);
  };

  const disabledDate = (current) => {
    return current && current < dayjs().endOf('day').add(1);
  };
  const EbarmitSubmit = (value) => {
    const body = {
      saleID: value.saleId,
    };

    axios.post(`/api/sales/e-barimt`, body).then(
      (resp) => {
        setEbarimt(resp.data.result);
        setShowEbarimt(true);
      },
      (error) => {
        setAlert({
          show: true,
          message: error.response?.data?.info,
        });
      }
    );
  };
  const closeNotification = () => {
    setAlert(null);
  };

  const toggleShow = () => {
    setShow(!show);
  };

  const thousands = /\B(?=(\d{3})+(?!\d))/g;

  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col lg={10} className="dashboard-right-side">
          <Row>
            <Col style={{ borderBottom: '1px solid #E8EDF5' }} className="p-0">
              <Topbar
                name={t('trans-history')}
                logo="/icon-history-topbar.svg"
              />
            </Col>
          </Row>
          <Row className="wrapper-row">
            <div
              style={{ maxWidth: '1032px', margin: 'auto' }}
              className="tw-transaction-container"
            >
              <div className="tw-transaction-body">
                <Tab.Container defaultActiveKey="1">
                  <Nav className="trans-real-tab">
                    <Nav.Item>
                      <Nav.Link eventKey="1">{t('tab-1.title')}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="2">{t('tab-2.title')}</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <Tab.Content>
                    <Tab.Pane eventKey="1">
                      <div className="tw-transaction-top">
                        <div className="title">
                          <h4> {t('tab-1.title')}</h4>
                        </div>
                        <span>{t('tab-1.desc')}</span>
                      </div>
                      <div className="tw-transaction-top-items">
                        <Row className="tw-trans-row">
                          <Col lg={4} xs={12} className="tw-trans-col">
                            <div className="tw-transaction-top-item">
                              <div className="tw-transaction-top-img">
                                <img src="/icon-wallet-transaction.svg" />
                              </div>
                              <div className="tw-transaction-top-title">
                                <h6>{t('tab-1.current-balance')}</h6>
                                <span>
                                  {info?.balance
                                    .toString()
                                    .replace(thousands, ',') ?? '0.00'}
                                  ₮
                                </span>
                              </div>
                            </div>
                          </Col>
                          <Col lg={4} xs={12} className="tw-trans-col">
                            <div className="tw-transaction-top-item">
                              <div className="tw-transaction-top-img tw-transaction-icon-second">
                                <img src="/icon-income-trans.svg" />
                              </div>
                              <div className="tw-transaction-top-title">
                                <h6>{t('tab-1.total-income')}</h6>
                                <span>
                                  {depositTotal
                                    .toString()
                                    .replace(thousands, ',')}
                                  ₮
                                </span>
                              </div>
                            </div>
                          </Col>
                          <Col lg={4} xs={12} className="tw-trans-col">
                            <div
                              className="tw-transaction-top-item"
                              style={{
                                margin: '0',
                              }}
                            >
                              <div className="tw-transaction-top-img tw-transaction-icon-third">
                                <img src="/icon-outcome.svg" />
                              </div>

                              <div className="tw-transaction-top-title">
                                <h6>{t('tab-1.total-exp')}</h6>
                                <span>
                                  {withdrawTotal
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',') ??
                                    '0.00'}
                                  ₮
                                </span>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <div className="transaction-history-outer">
                        <div
                          className="transaction-history-inner"
                          style={{ width: '100%' }}
                        >
                          <Tab.Container defaultActiveKey="0">
                            <div className="tabs">
                              <Nav variant="pills">
                                <Nav.Item
                                  className="tw-nav-all"
                                  onClick={() => setSelectTab(0)}
                                >
                                  <Nav.Link eventKey="0">
                                    {t('tab-1.all')}
                                  </Nav.Link>
                                </Nav.Item>
                                <Nav.Item
                                  className="tw-nav-income"
                                  onClick={() => setSelectTab(1)}
                                >
                                  <Nav.Link eventKey="1">
                                    {t('tab-1.income')}
                                  </Nav.Link>
                                </Nav.Item>
                                <Nav.Item
                                  className="tw-nav-outcome"
                                  onClick={() => setSelectTab(2)}
                                >
                                  <Nav.Link eventKey="2">
                                    {t('tab-1.expense')}
                                  </Nav.Link>
                                </Nav.Item>
                                <div className="date-graphic">
                                  <div className="content">
                                    <LocalizationProvider
                                      dateAdapter={AdapterDateFns}
                                    >
                                      <DateRangePicker
                                        disabledDate={disabledDate}
                                        value={newValue}
                                        inputFormat="MM-dd-yyyy"
                                        onChange={changeDateRange}
                                        renderInput={(startProps, endProps) => (
                                          <React.Fragment>
                                            <input
                                              ref={startProps.inputRef}
                                              {...startProps.inputProps}
                                              className="date-item"
                                            />
                                            -
                                            <input
                                              ref={endProps.inputRef}
                                              {...endProps.inputProps}
                                              className="date-item"
                                            />
                                          </React.Fragment>
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </div>
                                  <div className="item">
                                    <div className="switch d-flex">
                                      <span>{t('tab-1.by-graphic')}</span>
                                      <Form.Control
                                        type="checkbox"
                                        id="unchecked-default"
                                        value={defaultSwitch}
                                        onChange={(e) => toggleHandler(e)}
                                      />
                                      <Form.Label
                                        htmlFor="unchecked-default"
                                        className="cr"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Nav>
                            </div>
                            {defaultSwitch == true ? (
                              <TransactionGraphic
                                graphDataTemp={graphDataTemp}
                                tabData={selectTab}
                                apexData={totalSalesList.result}
                              />
                            ) : (
                              <>
                                <Tab.Content>
                                  <Tab.Pane eventKey="0">
                                    <div className="tabs-header ">
                                      <Table
                                        className="transaction-history"
                                        responsive="sm"
                                      >
                                        <thead>
                                          <tr>
                                            <th>{t('tab-1.date')}</th>
                                            <th>{t('tab-1.trans-value')}</th>
                                            <th>{t('tab-1.first-balance')}</th>
                                            <th>{t('tab-1.trans-amount')}</th>
                                            <th>{t('tab-1.final-balance')}</th>
                                            <th>
                                              {t('tab-1.related-account')}
                                            </th>
                                          </tr>
                                        </thead>
                                        {totalSalesList &&
                                          totalSalesList.result?.length > 0 &&
                                          totalSalesList?.result.map(
                                            (cat, i) => (
                                              <tbody key={i}>
                                                <tr>
                                                  <td>
                                                    <h5>{cat.dateUI}</h5>
                                                  </td>
                                                  <td>
                                                    <h5>{cat.description}</h5>
                                                  </td>
                                                  <td>
                                                    <span>
                                                      {cat.balanceOld
                                                        .toString()
                                                        .replace(
                                                          /\B(?=(\d{3})+(?!\d))/g,
                                                          ','
                                                        )}
                                                    </span>
                                                  </td>
                                                  <td>
                                                    <span
                                                      className={
                                                        cat.amount < 0
                                                          ? 'total-decrease'
                                                          : 'total-increase'
                                                      }
                                                    >
                                                      {cat.amountUI}
                                                    </span>
                                                  </td>
                                                  <td>
                                                    <span>
                                                      {cat.balance
                                                        .toString()
                                                        .replace(
                                                          /\B(?=(\d{3})+(?!\d))/g,
                                                          ','
                                                        )}
                                                    </span>
                                                  </td>
                                                  <td>
                                                    <h5>{cat.sourceMsisdn}</h5>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            )
                                          )}
                                      </Table>
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane eventKey="1">
                                    <div className="tabs-header">
                                      <Table
                                        className="transaction-history"
                                        responsive="sm"
                                      >
                                        <thead>
                                          <tr>
                                            <th>{t('tab-1.date')}</th>
                                            <th>{t('tab-1.trans-value')}</th>
                                            <th>{t('tab-1.first-balance')}</th>
                                            <th>{t('tab-1.trans-amount')}</th>
                                            <th>{t('tab-1.final-balance')}</th>
                                            <th>
                                              {t('tab-1.related-account')}
                                            </th>
                                          </tr>
                                        </thead>
                                        {totalSalesList &&
                                          totalSalesList.result?.length > 0 &&
                                          totalSalesList?.result.map(
                                            (cat, i) => {
                                              if (cat.amount > 0) {
                                                return (
                                                  <tbody key={i}>
                                                    <tr>
                                                      <td>
                                                        <h5>{cat.dateUI}</h5>
                                                      </td>
                                                      <td>
                                                        <h5>
                                                          {cat.description}
                                                        </h5>
                                                      </td>
                                                      <td>
                                                        <span>
                                                          {cat.balanceOld
                                                            .toString()
                                                            .replace(
                                                              /\B(?=(\d{3})+(?!\d))/g,
                                                              ','
                                                            )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span className="total-increase">
                                                          {cat.amountUI}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span>
                                                          {cat.balance
                                                            .toString()
                                                            .replace(
                                                              /\B(?=(\d{3})+(?!\d))/g,
                                                              ','
                                                            )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <h5>{cat.source}</h5>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                );
                                              }
                                              {
                                                return (cat = null);
                                              }
                                            }
                                          )}
                                      </Table>
                                    </div>
                                  </Tab.Pane>
                                  <Tab.Pane eventKey="2">
                                    <div className="tabs-header">
                                      <Table
                                        className="transaction-history"
                                        responsive="sm"
                                      >
                                        <thead>
                                          <tr>
                                            <th>{t('tab-1.date')}</th>
                                            <th>{t('tab-1.trans-value')}</th>
                                            <th>{t('tab-1.first-balance')}</th>
                                            <th>{t('tab-1.trans-amount')}</th>
                                            <th>{t('tab-1.final-balance')}</th>
                                            <th>
                                              {t('tab-1.related-account')}
                                            </th>
                                          </tr>
                                        </thead>
                                        {totalSalesList &&
                                          totalSalesList.result?.length > 0 &&
                                          totalSalesList?.result.map(
                                            (cat, i) => {
                                              if (cat.amount < 0) {
                                                return (
                                                  <tbody key={i}>
                                                    <tr>
                                                      <td>
                                                        <h5>{cat.dateUI}</h5>
                                                      </td>
                                                      <td>
                                                        <h5>
                                                          {cat.description}
                                                        </h5>
                                                      </td>
                                                      <td>
                                                        <span>
                                                          {cat.balanceOld
                                                            .toString()
                                                            .replace(
                                                              /\B(?=(\d{3})+(?!\d))/g,
                                                              ','
                                                            )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span className="total-decrease">
                                                          {cat.amountUI}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span>
                                                          {cat.balance
                                                            .toString()
                                                            .replace(
                                                              /\B(?=(\d{3})+(?!\d))/g,
                                                              ','
                                                            )}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <h5>{cat.source}</h5>
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                );
                                              }
                                              {
                                                return (cat = null);
                                              }
                                            }
                                          )}
                                      </Table>
                                    </div>
                                  </Tab.Pane>
                                </Tab.Content>
                                <div className="transaction-pagination">
                                  <div className="inner-content">
                                    <div className="trans-dropdown">
                                      <Form>
                                        <Form.Select
                                          className="form-select-payment"
                                          onChange={handlePaging}
                                        >
                                          <option
                                            value="50"
                                            className="form-label-option"
                                          >
                                            50
                                          </option>
                                        </Form.Select>
                                      </Form>
                                    </div>
                                    <Pagination>
                                      <Pagination.Prev
                                        className="prev"
                                        onClick={prevSubmit}
                                      />
                                      <Pagination.Next
                                        className="next"
                                        onClick={nextSubmit}
                                      />
                                    </Pagination>
                                  </div>
                                </div>
                              </>
                            )}
                          </Tab.Container>
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="2">
                      <div className="tw-transaction-top">
                        <div className="title">
                          <h4>{t('tab-2.title')}</h4>
                        </div>
                        <span>{t('tab-2.desc')}</span>
                      </div>
                      <div className="transaction-history-outer">
                        <div
                          className="transaction-history-inner"
                          style={{ width: '100%' }}
                        >
                          <div className="tabs-header">
                            <Table
                              className="transaction-history"
                              responsive="sm"
                            >
                              <thead>
                                <tr>
                                  <th>{t('tab-1.date')}</th>
                                  <th>{t('tab-2.product')}</th>
                                  <th>{t('tab-2.amount')}</th>
                                  <th>{t('tab-2.status')}</th>
                                  <th>{t('tab-1.noat')}</th>
                                </tr>
                              </thead>
                              {salesProducts?.map((cat, i) => (
                                <tbody key={i}>
                                  <tr>
                                    <td>
                                      <h5>{cat.createDateUI}</h5>
                                    </td>
                                    {cat.saleProductList?.map(
                                      (productname, i) => (
                                        <td key={i}>
                                          <h5>{productname.productName}</h5>
                                        </td>
                                      )
                                    )}

                                    <td>
                                      <span
                                        className={
                                          cat.totalAmount < 0
                                            ? 'total-decrease'
                                            : 'total-increase'
                                        }
                                      >
                                        {cat.totalAmountUI}
                                      </span>
                                    </td>
                                    <td>
                                      <span>{cat.saleStatusUI}</span>
                                    </td>
                                    <td className="with-noat">
                                      <Button
                                        onClick={() => EbarmitSubmit(cat)}
                                      >
                                        <div className="noat-image">
                                          <img src="/icon-show-qr.svg" />
                                        </div>
                                        <span>{t('tab-1.noat')}</span>
                                      </Button>
                                    </td>
                                  </tr>
                                </tbody>
                              ))}
                            </Table>
                            <Modal
                              show={showEbarimt}
                              onHide={barimtClose}
                              className="with-noat-modal"
                            >
                              <Modal.Header closeButton>
                                {t('tab-1.noat-title')}
                              </Modal.Header>
                              <Modal.Body>
                                <div className="qr-image">
                                  <QRCode value={ebarimt?.qrdata} />
                                </div>
                                <div className="qr-date">
                                  <span>{t('tab-1.date')}</span>
                                  <span className="qr-item">
                                    {ebarimt?.createDateUI}
                                  </span>
                                </div>
                                <div className="qr-date">
                                  <span>{t('tab-1.lotteno')}</span>
                                  <span className="qr-item">
                                    {ebarimt?.lotteryNo}
                                  </span>
                                </div>
                                <div className="qr-date">
                                  <span>{t('tab-1.amount')}</span>
                                  <span className="qr-item">
                                    {ebarimt?.totalAmountUI}₮
                                  </span>
                                </div>
                                <div className="bottom">
                                  <div className="qr-date">
                                    <span>{t('tab-1.ebarimtid')}</span>
                                    <span className="qr-item">
                                      {ebarimt?.billId}
                                    </span>
                                  </div>
                                </div>
                              </Modal.Body>
                            </Modal>
                          </div>
                          <div className="transaction-pagination">
                            <div className="inner-content">
                              <div className="trans-dropdown">
                                <Form>
                                  <Form.Select
                                    className="form-select-payment"
                                    onChange={handlePagingSales}
                                  >
                                    <option
                                      value="50"
                                      className="form-label-option"
                                    >
                                      50
                                    </option>
                                  </Form.Select>
                                </Form>
                              </div>
                              <Pagination>
                                <Pagination.Prev
                                  className="prev"
                                  onClick={prevSubmitSales}
                                />
                                <Pagination.Next
                                  className="next"
                                  onClick={nextSubmitSales}
                                />
                              </Pagination>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>
            </div>
          </Row>
        </Col>
        {alert?.show && (
          <FailNotification
            show={alert.show}
            infos={alert.message}
            close={closeNotification}
          ></FailNotification>
        )}
      </Row>
    </Container>
  );
};
export default TransactionHistory;
