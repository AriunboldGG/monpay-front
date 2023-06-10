import Sidebar from 'components/sidebar/control';
import AccountSidebar from 'components/sidebar/account';
import Topbar from 'components/topbar';
import React, { useState, useContext } from 'react';
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
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

const TransferConfirm = (props) => {
  const { transferInfo } = useContext(IctContext);
  const [show, setShow] = useState(false);
  const [response, setResponse] = useState({});
  const [action, setAction] = useState(null);

  const [actionTexts, setActionTexts] = useState({
    type1: 'Шилжүүлэг',
    type2: 'Шилжүүлэх',
    type3: 'дугаартай шилжүүлэг амжилттай боллоо.',
  });
  const router = useRouter();
  const { t } = useTranslation('account');

  const [validated, setValidated] = useState(false);

  React.useEffect(() => {
    if (!router.isReady) return;
    if (!transferInfo || !transferInfo.candy?.receiver) {
      router.push('/app/dashboard/account/transfer');
    }
    const action = router.query['action'];
    if (action === 'invoice') {
      setAction(action);
      const texts = {};
      texts.type1 = 'Нэхэмжлэл';
      texts.type2 = 'Нэхэмжлэх';
      texts.type3 = 'нэхэмжлэх амжилттай илгээгдлээ.';
      setActionTexts(texts);
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
      const body = createBody(pin);
      const path =
        action === 'invoice'
          ? '/api/account/invoice'
          : '/api/account/transfer-to-candy';
      axios.post(path, body).then(
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
          }
          event.stopPropagation();
        }
      );
    }
    setValidated(true);
  };

  const createBody = (val) => {
    const body = {};
    body.receiver = {
      value: transferInfo.candy?.receiver,
      system: transferInfo.candy?.system,
    };
    body.amount = Number(transferInfo.candy?.amount);
    body.description = transferInfo.candy?.description;
    body.actionType = 'surprise';
    body.pin = val;
    return body;
  };

  const handleModal = () => {
    setShow(false);
    if (response.success) {
      window.location.reload();
      router.push('/app/dashboard');
    }
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
                          <h5>{actionTexts.type1}</h5>
                        </div>
                        <div className="confirm-1">
                          <div className="confirm-title-out">
                            <span className="confirm-title">
                              {actionTexts.type2.toLowerCase()}
                            </span>
                          </div>
                          <div className="content">
                            <div className="content-inner">
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.receiver')}
                                </h5>
                                <span className="number">
                                  {transferInfo?.candy?.receiver}
                                  <div className="image">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M7.99984 0.666992C6.54944 0.666992 5.13162 1.09708 3.92566 1.90288C2.7197 2.70868 1.77977 3.85399 1.22472 5.19398C0.669681 6.53397 0.524457 8.00846 0.807415 9.43099C1.09037 10.8535 1.78881 12.1602 2.81439 13.1858C3.83998 14.2114 5.14665 14.9098 6.56918 15.1928C7.9917 15.4757 9.46619 15.3305 10.8062 14.7754C12.1462 14.2204 13.2915 13.2805 14.0973 12.0745C14.9031 10.8685 15.3332 9.45072 15.3332 8.00033C15.3309 6.05611 14.5575 4.19218 13.1828 2.81741C11.808 1.44264 9.94406 0.669286 7.99984 0.666992ZM11.1378 6.80499L7.80451 10.1383C7.67949 10.2633 7.50995 10.3335 7.33317 10.3335C7.1564 10.3335 6.98686 10.2633 6.86184 10.1383L4.86184 8.13833C4.79817 8.07683 4.74738 8.00326 4.71244 7.92193C4.6775 7.84059 4.65911 7.75311 4.65834 7.66459C4.65757 7.57607 4.67444 7.48829 4.70796 7.40636C4.74148 7.32443 4.79098 7.24999 4.85358 7.1874C4.91617 7.1248 4.99061 7.0753 5.07254 7.04178C5.15447 7.00826 5.24225 6.99139 5.33077 6.99216C5.41929 6.99293 5.50677 7.01132 5.58811 7.04626C5.66945 7.0812 5.74301 7.13199 5.80451 7.19566L7.33317 8.72433L10.1952 5.86233C10.3209 5.74089 10.4893 5.67369 10.6641 5.67521C10.8389 5.67673 11.0061 5.74684 11.1297 5.87045C11.2533 5.99405 11.3234 6.16126 11.325 6.33606C11.3265 6.51086 11.2593 6.67926 11.1378 6.80499Z"
                                        fill="#11D8E2"
                                      />
                                    </svg>
                                  </div>
                                </span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.receiver-name')}
                                </h5>
                                <span className="number">
                                  {transferInfo?.candy?.receiverName}
                                </span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {actionTexts.type2}
                                  {t('amount')}
                                </h5>
                                <span className="number">
                                  {transferInfo?.candy?.amount}₮
                                </span>
                              </div>
                              <div className="content-item">
                                <h5 className="item-title">
                                  {t('account-transfer.transaction-value ')}
                                </h5>
                                <span className="number">
                                  {transferInfo?.candy?.description}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Form
                            name="confirm"
                            className="email-confirm-code"
                            onSubmit={handleSubmit}
                          >
                            <div className="label-title">
                              <h5>
                                {actionTexts.type2 + ' '}
                                {t('confirmation')}
                              </h5>
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
                            {/* <div className="save-template">
                                                            <span>
                                                                {t(
                                                                    'account-conf.save-template'
                                                                )}
                                                            </span>
                                                            <div className="switch d-flex">
                                                                <Form.Control
                                                                    type="checkbox"
                                                                    id="unchecked-default"
                                                                    defaultChecked={
                                                                        checked
                                                                    }
                                                                    onChange={
                                                                        toggleHandler
                                                                    }
                                                                />
                                                                <Form.Label
                                                                    htmlFor="unchecked-default"
                                                                    className="cr"
                                                                />
                                                            </div>
                                                        </div>
                                                        {checked && (
                                                            <div className="input-item">
                                                                <InputGroup
                                                                    hasValidation
                                                                >
                                                                    <Form.Control
                                                                        required={
                                                                            checked
                                                                        }
                                                                        type="text"
                                                                        placeholder="Загварын нэр"
                                                                        name="template"
                                                                        onWheel={(
                                                                            e
                                                                        ) =>
                                                                            e.target.blur()
                                                                        }
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {t(
                                                                            'account-conf.pls-enter-temp'
                                                                        )}
                                                                    </Form.Control.Feedback>
                                                                </InputGroup>
                                                            </div>
                                                        )} */}
                            <div className="transfer-buttons">
                              <div className="buttons-inner">
                                <Button onClick={handleBack}>
                                  {t('account-conf.cancel')}
                                </Button>
                                <Button variant="primary" type="submit">
                                  {actionTexts.type2}
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
        onHide={() => handleModal()}
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
                  {actionTexts.type1 +
                    '  ' +
                    (response.success ? 'амжилттай' : 'амжилтгүй')}
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
                      {action && action === 'invoice'
                        ? response.invoiceDesc
                        : response.transactionId + ' дугаартай шилжүүлэг'}
                    </strong>
                    {t('was-success')}
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
    </Container>
  );
};

export async function getServerSideProps(ctx) {
  return {
    props: {},
  };
}
export default TransferConfirm;
