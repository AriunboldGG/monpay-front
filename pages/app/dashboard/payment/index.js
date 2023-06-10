import Sidebar from 'components/sidebar/control';
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Col,
  Container,
  Row,
  Accordion,
  Button,
  Modal,
  Form,
} from 'react-bootstrap';
import SidebarPayment from 'components/sidebar/payment';
import Topbar from 'components/topbar';
import AccountInfo from 'pages/app/account-info';
import axios from 'axios';
import IctContext from 'context/ict-context';
import FailNotification from 'components/notification/fail-notif';
import Notification from 'components/notification/index';
import useTranslation from 'next-translate/useTranslation';

const Payment = (props) => {
  const [show, setShow] = useState(false);
  const [showDelete, setShowDelete] = useState({
    modalShow: false,
    value: {},
    i: 0,
    j: 0,
  });
  const [showFiled, setShowFiled] = useState(false);
  const [alert, setAlert] = useState({ show: false });
  const [notification, setNotification] = useState({ show: false });
  const [infos, setInfos] = useState('');
  const [billProducts, setBillProducts] = useState([]);
  const [billHubInfo, setBillHubInfo] = useState();
  const [prodId, setProdId] = useState();
  const { t } = useTranslation('payment');
  const [uid, setUid] = useState();
  const [billName, setBillName] = useState();
  const [forDisabled, setForDisabled] = useState(false);
  const [activeId, setActiveId] = useState('0');

  const { setBill } = useContext(IctContext);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const billData = await axios(`/api/bill-hub/bill-products`);

      billData.data.result.map((item, i) => {
        if (item?.billUserList?.length) {
          setActiveId(i);
        }
      });

      setBillProducts(billData.data.result);
    }
    fetchData();
  }, []);

  const routerPushAndsetData = (value, e) => {
    const body = {};
    body.billProdId = value?.billProdId;
    body.billerUid = value?.billerUid;
    setBill(body);
    router.push('/app/dashboard/payment/single-payment');
  };

  const handleModal = (value, i, j) => {
    setProdId(value);
    setBillHubInfo(value.billProductSetting.billerUidParamName);
    setBillName(value?.billProductName);
    setShow(true);
  };

  const handleCheck = (value) => {
    if (value.target.value.length > 0) {
      setForDisabled(true);
    } else {
      setForDisabled(false);
    }
  };

  const handleClose = () => setShow(false);
  const handleCloseDelete = () =>
    setShowDelete({
      modalShow: false,
      value: {},
      i: 0,
      j: 0,
    });

  const handleSubmitDelete = (value, i, j) => {
    setShowDelete({
      modalShow: true,
      value: value,
      i: i,
      j: j,
    });
  };

  const deleteFunc = (data) => {
    const body = {
      billProdId: data.value?.billProdId,
      billerUid: data.value?.billerUid,
    };
    axios.post('/api/bill-hub/delete', body).then(
      (resp) => {
        billProducts[data.i].billUserList?.splice(data.j, 1);
        const newProducts = [...billProducts];
        setBillProducts(newProducts);
        setShowFiled(false);
        handleCloseDelete();
      },
      (error) => {
        setInfos(error.response.data.info);
        setShowFiled(true);
      }
    );
  };

  const handleSubmitCreate = (value, e) => {
    handleClose();
    const body = {
      billProdId: prodId?.billProdId,
      billerUid: uid,
    };

    axios.post('/api/bill-hub/bill-product-put', body).then(
      (resp) => {
        prodId.billUserList?.splice(1, 0, prodId.billUserList);
        const newProducts = [...billProducts];
        setBillProducts(newProducts);
        setNotification({
          show: true,
          message: resp.data?.info,
        });
        setShowFiled(false);
        setTimeout(() => {
          window.location.reload(false);
        }, 2000);
      },
      (error) => {
        setInfos(error.response.data.info);
        setShowFiled(true);
        setAlert({
          show: true,
          message: error.response?.data?.info,
        });
      }
    );
  };

  const closeNotification = () => {
    setShow(false);
  };

  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col className="dashboard-right-side" lg={10}>
          <Row>
            <Col
              style={{
                borderBottom: '1px solid #E8EDF5',
                padding: '0',
              }}
            >
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
                      <div className="payment-bottom">
                        <div className="payment-bottom-content payment-bottom-line">
                          <div className="payment-bottom-title">
                            <h4>{t('payment.pay-your-bills')}</h4>
                          </div>
                          <div className="payment-desc">
                            <p>{t('payment.registered-payments')}</p>
                          </div>
                        </div>
                        <div className="accordionPayment">
                          {billProducts?.map((cat, i) => (
                            <Accordion key={i} defaultActiveKey={activeId}>
                              {cat.productId == '178' ? (
                                <>
                                  <div
                                    className="payment-bottom-more"
                                    style={{
                                      position: 'relative',
                                    }}
                                  >
                                    <div className="payment-bottom-more-title">
                                      <h6>{cat.billProductName}</h6>
                                    </div>
                                    {cat.billUserList?.map((catt, j) => {
                                      return (
                                        <div className="payment-more" key={j}>
                                          <Button
                                            onClick={(e) =>
                                              routerPushAndsetData(catt, e)
                                            }
                                          >
                                            {t('payment.more')}
                                          </Button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              ) : (
                                <Accordion.Item
                                  eventKey={i}
                                  onSubmit={handleModal}
                                >
                                  <Accordion.Header>
                                    <div className="accordion-header-inner">
                                      <span className="accordion-header-title">
                                        {cat.billProductName}
                                      </span>
                                      <Button
                                        onClick={(e) => {
                                          handleModal(cat, e);
                                        }}
                                        className="accordion-header-link"
                                      >
                                        {t('plus')}
                                      </Button>
                                    </div>
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    {cat.billUserList?.map((catt, j) => {
                                      return (
                                        <div
                                          className="paymentInnerAccordion"
                                          key={j}
                                        >
                                          <div className="paymentInnerAccordionService">
                                            <h5>{t('acc-name')}</h5>
                                            <span>{catt.billerUid}</span>
                                          </div>
                                          <div className="paymentInnerAccordionMore">
                                            <Button
                                              onClick={(e) =>
                                                routerPushAndsetData(catt, e)
                                              }
                                            >
                                              {t('more')}
                                            </Button>
                                            <Button
                                              className="payment-inner-img"
                                              onClick={() =>
                                                handleSubmitDelete(catt, i, j)
                                              }
                                            >
                                              <img src="/icon-delete.svg" />
                                            </Button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </Accordion.Body>
                                </Accordion.Item>
                              )}
                            </Accordion>
                          ))}
                          <Modal
                            show={show}
                            onHide={() => handleClose()}
                            dialogClassName="save-template"
                            centered
                          >
                            <Modal.Header closeButton>
                              <div className="header-title">
                                <h5>{billName}</h5>
                              </div>
                            </Modal.Header>
                            <Modal.Body
                              style={{
                                paddingBottom: '0',
                              }}
                            >
                              <div className="template-body">
                                <div>
                                  <span
                                    style={{
                                      marginBottom: '12px',
                                    }}
                                    className="body-title"
                                  >
                                    {billHubInfo}
                                  </span>
                                  <div>
                                    <Form.Control
                                      className="save-temp-input"
                                      type="text"
                                      placeholder={billHubInfo}
                                      onChange={(e) => {
                                        handleCheck(e);
                                        setUid(e.target?.value);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </Modal.Body>
                            <Modal.Footer>
                              <div className="tw-single-button">
                                <Button
                                  disabled={!forDisabled}
                                  onClick={handleSubmitCreate}
                                >
                                  {t('payment-connect')}
                                </Button>
                              </div>
                            </Modal.Footer>
                          </Modal>
                          <Modal
                            show={showDelete.modalShow}
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
                                <Button
                                  type="submit"
                                  onClick={() => deleteFunc(showDelete)}
                                >
                                  {t('yes')}
                                </Button>
                              </div>
                            </Modal.Footer>
                          </Modal>
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
      </Row>
    </Container>
  );
};
export default Payment;

export async function getServerSideProps(ctx) {
  return { props: {} };
}
