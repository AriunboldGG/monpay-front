import Sidebar from 'components/sidebar/control';
import AccountSidebar from 'components/sidebar/account';
import Topbar from 'components/topbar';
import TransTemplate from 'components/sidebar/trans-template';
import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  Container,
  Col,
  Row,
  Tabs,
  Tab,
  FormControl,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import IctContext from 'context/ict-context';
import axios from 'axios';
import { System } from 'utils/constants';
import AccountInfo from 'pages/app/account-info';
import { useRouter } from 'next/router';
import FailNotification from 'components/notification/fail-notif';
import useTranslation from 'next-translate/useTranslation';
import CurrencyInput from 'react-currency-input-field';

const AccountTransfer = (props) => {
  //TODO: PIN CODE BHGUI BOL ANHAARUULAAD PIN PAGE RUU ROUTE HIIH
  const router = useRouter();
  const [validated, setValidated] = useState(false);
  const [camInfoFound, setCamInfoFound] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [bankName, setBankName] = useState('');
  const [lastChecked, setLastChecked] = useState('');
  const [currentTab, setCurrentTab] = useState('candy');
  const [banks, setBanks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedFundType, setSelectedFundType] = useState('phone');
  const [actionType, setActionType] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);
  const [alert, setAlert] = useState({ show: false });
  const [selectedTemplate, setSelectedTemplate] = useState({
    destAccountNo: '',
    destCustomerName: '',
  });
  const [addAmount, setAddAmount] = useState();
  const [addAmountFund, setAddAmountFund] = useState();
  const [addAmountBank, setAddAmountBank] = useState();
  const [forDisabled, setForDisabled] = useState('');
  const [forDisabledBank, setForDisabledBank] = useState(false);

  const { t } = useTranslation('account', 'topbar');
  const [camUserInfo, setCamUserInfo] = useState({
    bankName: '',
    username: '',
    accountNo: '',
  });
  const { info, transferInfo, selectId, setTransfer } = useContext(IctContext);

  React.useEffect(() => {
    if (router.isReady) {
      if (!router.query.type) {
        router.push(router.pathname + '?type=candy', undefined, {
          shallow: true,
        });
        handleTab('candy');
      } else {
        handleTab(router.query.type);
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (selectId) {
      setTemplateId(selectId);
    }
  }, [templates]);

  const setTemplateId = async (id) => {
    if (id) {
      const temp = templates.find((template) => template.templateId === id);
      if (temp) {
        const bankCode = temp.destBankCode;
        const selectedBankInfo = banks.find((bank, i) => {
          return bank.code === bankCode;
        });
        setSelectedBank(selectedBankInfo || {});
      }
      setSelectedTemplate(temp || { destAccountNo: '', destCustomerName: '' });
      if (temp?.destAccountNo.length) {
        setForDisabledBank(true);
      }
      if (temp?.destCustomerName) {
        setBankName({ name: temp.destCustomerName });
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(false);
    } else {
      setValidated(true);
      //DON'T REMOVE COMMENTED LINES INSIDE CANDY FORM.
      if (currentTab === 'candy') {
        handleCandyTransfer(form, event.nativeEvent?.submitter?.name);
      } else if (currentTab === 'bank') {
        handleBankTransfer(form);
      } else if (currentTab === 'fund') {
        handleFundTransfer(form);
      }
    }
    setValidated(true);
  };
  const handleCandyTransfer = (form, action) => {
    const receiver = form.receivers.value;
    const body = {};
    const isInvalid = hasInvalidReceiver(receiver);
    if (!isInvalid) {
      const system = getSystem(receiver)?.name;
      body.receiver = receiver;
      body.receiverName = receiverName;
      body.system = system;
    } else {
      //TODO: Handle invalid inputs
    }

    body.amount = Number(parseInt(addAmount));
    body.description = form.description.value;
    body.actionType = 'surprise';
    setTransfer({ candy: body });
    const path = '/app/dashboard/account/confirm';
    if (action === 'invoice')
      path = '/app/dashboard/account/confirm?action=invoice';
    router.push(path);
  };

  const handleBankTransfer = (form) => {
    const body = {};
    if (selectedBank) {
      body.bankCode = selectedBank.code;
      body.bankName = selectedBank.nameMn;
      body.bankAccount = form.bankAccount.value;
      body.bankAccountName = form.bankAccountName.value;
      body.amount = parseInt(addAmountBank);
      body.description = form.bankDescription.value;
      body.srcAccountNo = info.accountNo;
      setTransfer({ bank: body });
      router.push('/app/dashboard/account/confirm-bank');
    } else {
      //TODO: Handle invalid inputs
    }
  };

  const handleFundTransfer = (form) => {
    const body = {};
    body.bankCode = camUserInfo.bankCode;
    body.bankName = camUserInfo.bankName;
    body.bankAccount = camUserInfo.accountNo;
    body.bankAccountName = camUserInfo.username;
    body.amount = parseInt(addAmountFund);
    body.description = form.fundDescription.value;
    body.srcAccountNo = info.accountNo;
    setTransfer({ fund: body });
    router.push('/app/dashboard/account/confirm-fund');
  };

  const getSystem = (val) => {
    if (val && val.length === 8) return System.ISDN;
    if (val && val.length === 11) return System.ACCOUNTNO;
    return null;
  };

  const hasInvalidReceiver = (receiver) => {
    return !!!getSystem(receiver);
  };

  const checkUsername = async (val) => {
    if (!val || val.length !== 8 || val === lastChecked) return null;

    setLastChecked(val);
    const name = await getReceiverName(val);
    if (name) setReceiverName(name.result);
  };
  const checkBankname = async (val) => {
    setLastChecked(val);
    const name = await getBankName(val);
    if (name) setBankName(name.result);
    setForDisabledBank(true);
  };

  const checkCamInfo = async (identifier) => {
    const body = { selectedFundType, identifier };
    const camInfo = await getCamInfo(body);
    if (camInfo) {
      setCamInfoFound(camInfo.status === 'ACCEPTED');

      if (camInfo.status === 'ACCEPTED') {
        setCamUserInfo(camInfo);
      } else {
        setCamUserInfo({
          bankName: '',
          username: '',
          accountNo: '',
        });
        setAlert({
          show: true,
          message: camInfo.responseMessage,
        });
      }
    } else {
      setCamInfoFound(false);
    }
  };

  const getCamInfo = async (body) => {
    const { selectedFundType, identifier } = body;
    if (selectedFundType && identifier && identifier.length > 0) {
      const reqBody = {
        secondIdentifierType: selectedFundType?.toUpperCase(),
        secondIdentifier: identifier,
      };

      return await axios.post('/api/cam/lookup', reqBody).then(
        (resp) => {
          return resp.data;
        },
        (error) => {
          setAlert({
            show: true,
            message: error.response?.data?.info,
          });
          return null;
        }
      );
    } else {
      return null;
    }
  };

  const getReceiverName = async (val) => {
    const body = {
      phone: val,
    };
    return await axios.post('/api/user/username', body).then(
      (resp) => resp.data,
      (error) => {
        setAlert({
          show: true,
          message: error.response?.data?.info,
        });
        return null;
      }
    );
  };
  const getBankName = async (val) => {
    const body = {
      accountNo: val,
      bankCode: selectedBank.code,
    };
    return await axios.post('/api/bank/name-retrieve', body).then(
      (resp) => resp.data,
      (error) => {
        setAlert({
          show: true,
          message: error.response?.data?.info,
        });
        return null;
      }
    );
  };

  const getBanks = async () => {
    return await axios.get('/api/bank/list').then(
      (resp) => resp.data,
      (error) => {
        setAlert({
          show: true,
          message: error.response?.data?.info,
        });
        return null;
      }
    );
  };

  const getTemplates = async () => {
    return await axios.get('/api/account/transfer-template').then(
      (resp) => resp.data,
      (error) => {
        setAlert({
          show: true,
          message: error.response?.data?.info,
        });
        return null;
      }
    );
  };

  const handleTab = async (key) => {
    router.push(router.pathname + `?type=${key}`, undefined, {
      shallow: true,
    });

    setCurrentTab(key);

    if (key === 'candy' && transferInfo?.candy?.receiverName)
      setReceiverName(transferInfo?.candy?.receiverName);

    if (key === 'bank') {
      const bankList = await getBankList();

      if (!templates || templates.length === 0) {
        const templateList = (await getTemplates()) || [];
        setTemplates(templateList);
      }
      if (firstLoad && transferInfo?.bank?.bankCode) {
        if (bankList) setBankInfoOnBack(bankList);
      }
    }
  };

  const handleCheck = (value) => {
    if (value?.target.value) {
      setForDisabled(true);
    } else {
      setForDisabled(false);
    }
  };

  const getBankList = async () => {
    if (!banks || banks.length === 0) {
      const list = await getBanks();
      if (!!!list) return null;

      setBanks(list);
      if (!selectedBank) setSelectedBank(list[0]);
      return list;
    } else {
      return banks;
    }
  };

  //Sets values back on router/browser back action
  const setBankInfoOnBack = (bankList) => {
    const selectedBankInfo = bankList.find((b) => {
      return b.code === transferInfo?.bank?.bankCode;
    });
    const template = {
      destAccountNo: transferInfo.bank.bankAccount,
      destCustomerName: transferInfo.bank.bankAccountName,
    };
    setSelectedTemplate(template);
    setSelectedBank(selectedBankInfo || {});
    setFirstLoad(false);
  };

  const handleBankSelect = (event) => {
    setSelectedTemplate((old) => ({
      ...old,
      destAccountNo: '',
    }));
    setBankName('');
    setLastChecked('');
    const code = event?.currentTarget?.value;
    const selected = banks.find((bank) => bank.code === code);
    if (code) setSelectedBank(selected);
  };

  const handleFundSelect = (event) => {
    const selectedType = event?.currentTarget?.value;
    setSelectedFundType(selectedType);
  };

  const closeNotification = () => {
    setAlert(null);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { value = '' } = e.target;
    const parsedValue = value.replace(/[^\d.]/gi, '');
    setAddAmount(parsedValue);
  };

  const handleChangeBank = (e) => {
    e.preventDefault();
    const { value = '' } = e.target;
    const parsedValue = value.replace(/[^\d.]/gi, '');
    setAddAmountBank(parsedValue);
  };

  const handleChangeFund = (e) => {
    e.preventDefault();
    const { value = '' } = e.target;
    const parsedValue = value.replace(/[^\d.]/gi, '');
    setAddAmountFund(parsedValue);
  };

  const handleOnBlurFund = () =>
    setAddAmountFund(Number(addAmountFund).toFixed(2));

  const str = bankName?.name;

  const nameArray = str?.split(' ') || [];
  const newStr =
    nameArray.length > 1
      ? nameArray[0] +
        ' ' +
        nameArray[1]?.replace(
          nameArray[1].substr(1, nameArray[1].length - 0),
          nameArray[1].substr(1, nameArray[1].length - 3).replace(/./g, '*')
        )
      : '';

  const clickFunction = async (value) => {
    setSelectedTemplate({
      ...selectedTemplate,
      destAccountNo: value,
    });
    handleCheck();
    checkBankname(value);
  };

  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col lg={10} className="dashboard-right-side">
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
                  {currentTab === 'bank' && (
                    <TransTemplate
                      data={templates}
                      setSelected={setTemplateId}
                    />
                  )}
                </Col>
                <Col xs={12} lg={9}>
                  <AccountInfo />
                  <Row style={{ paddingTop: '24px' }}>
                    <Col>
                      <div className="deposit-tab">
                        <div className="title">
                          <h5>{t('account-transfer.title')}</h5>
                        </div>
                        <div className="deposit-tab-content">
                          <Form
                            noValidate
                            validated={validated}
                            name="candy"
                            onSubmit={handleSubmit}
                          >
                            <Tabs
                              id="controlled-tab-example"
                              defaultActiveKey=""
                              activeKey={currentTab}
                              onSelect={handleTab}
                            >
                              <Tab
                                eventKey="candy"
                                title={t('account-transfer.between-accounts')}
                              >
                                <div className="content">
                                  <div className="transfer-title">
                                    <h5>{t('account-transfer.receiver')}</h5>
                                  </div>
                                  <div className="input-item">
                                    <FormControl
                                      onChange={(e) => handleCheck(e)}
                                      required={currentTab === 'candy'}
                                      name="receivers"
                                      defaultValue={
                                        transferInfo?.candy?.receiver
                                      }
                                      type="text"
                                      placeholder={t(
                                        'account-transfer.receiver'
                                      )}
                                      minLength="8"
                                      maxLength="8"
                                      pattern="[1-9]{1}[0-9]{7}"
                                      autoComplete="off"
                                      onBlur={(e) =>
                                        checkUsername(e.target.value)
                                      }
                                      onWheel={(e) => e.target.blur()}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {t('account-transfer.receiver')}
                                    </Form.Control.Feedback>
                                  </div>
                                  <div className="transfer-title">
                                    <h5>
                                      {t('account-transfer.receiver-name')}
                                    </h5>
                                  </div>
                                  <div className="input-item">
                                    <FormControl
                                      style={{
                                        backgroundColor:
                                          'rgba(232, 237, 245, 0.32)',
                                      }}
                                      required={currentTab === 'candy'}
                                      name="pin"
                                      type="text"
                                      readOnly
                                      disabled
                                      placeholder={t(
                                        'account-transfer.receiver-name'
                                      )}
                                      value={receiverName}
                                    />
                                  </div>
                                  <div className="transfer-title">
                                    <h5>
                                      {t('account-transfer.transfer-amount')}
                                    </h5>
                                  </div>
                                  <div className="input-item">
                                    <CurrencyInput
                                      onWheel={(e) => e.target.blur()}
                                      name="amount"
                                      id="amount"
                                      data-number-stepfactor="100"
                                      value={addAmount}
                                      placeholder={t(
                                        'account-transfer.transfer-amount'
                                      )}
                                      onChange={handleChange}
                                      required={currentTab === 'candy'}
                                      defaultValue={transferInfo?.candy?.amount}
                                      allowDecimals
                                      decimalsLimit="2"
                                      disableAbbreviations
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {t('account-transfer.transfer-amount')}
                                    </Form.Control.Feedback>
                                  </div>
                                  <div className="transfer-title">
                                    <h5>
                                      {t('account-transfer.transaction-value ')}
                                    </h5>
                                  </div>
                                  <div className="input-item">
                                    <FormControl
                                      required={currentTab === 'candy'}
                                      name="description"
                                      defaultValue={
                                        transferInfo?.candy?.description
                                      }
                                      type="text"
                                      placeholder={t(
                                        'account-transfer.transaction-value '
                                      )}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                      {t('account-transfer.transaction-value ')}
                                    </Form.Control.Feedback>
                                  </div>
                                </div>
                                <div className="transfer-buttons">
                                  <div
                                    className="buttons-inner"
                                    style={{
                                      padding: '0 32px 32px',
                                    }}
                                  >
                                    <Button
                                      disabled={!forDisabled}
                                      type="submit"
                                      name="invoice"
                                      onClick={(e) => setActionType('invoice')}
                                    >
                                      {t('account-transfer.to-claim')}
                                    </Button>
                                    <Button
                                      disabled={!forDisabled}
                                      type="submit"
                                      name="transferToCandy"
                                      onClick={(e) => setActionType('')}
                                    >
                                      {t('account-transfer.transfer')}
                                    </Button>
                                  </div>
                                </div>
                              </Tab>
                              <Tab
                                eventKey="bank"
                                title={t('account-transfer.to-bank')}
                              >
                                <div className="content">
                                  <div
                                    style={{
                                      paddingTop: 'unset',
                                    }}
                                    className="title"
                                  >
                                    <h5>
                                      {t('account-transfer.recipient-bank')}
                                    </h5>
                                  </div>
                                  <div className="bank-dropdown">
                                    <Form.Select
                                      aria-label="Default select example"
                                      className="select-bank"
                                      value={selectedBank?.code}
                                      required={currentTab === 'bank'}
                                      name="bankCode"
                                      onChange={handleBankSelect}
                                    >
                                      {banks?.map((bank, index) => {
                                        return (
                                          <option
                                            value={bank.code}
                                            className="label-item"
                                            key={index}
                                          >
                                            {bank.nameMn}
                                          </option>
                                        );
                                      })}
                                    </Form.Select>
                                    <div className="transfer-title">
                                      <h5>
                                        {t(
                                          'account-transfer.recipient-account'
                                        )}
                                      </h5>
                                    </div>
                                    <div className="input-item">
                                      <InputGroup hasValidation>
                                        <Form.Control
                                          required={currentTab === 'bank'}
                                          name="bankAccount"
                                          type="number"
                                          placeholder={t(
                                            'account-transfer.recipient-account'
                                          )}
                                          value={
                                            selectedTemplate?.destAccountNo
                                          }
                                          onChange={(e) => {
                                            clickFunction(e.target.value);
                                          }}
                                          minLength="10"
                                          maxLength="10"
                                          pattern="[1-9]{1}[0-9]{7}"
                                          autoComplete="off"
                                          onBlur={(e) =>
                                            checkBankname(e.target.value)
                                          }
                                          onWheel={(e) => e.target.blur()}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {t(
                                            'account-transfer.recipient-account'
                                          )}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </div>
                                    <div className="transfer-title">
                                      <h5>
                                        {t('account-transfer.recipient-name')}
                                      </h5>
                                    </div>
                                    <div className="input-item">
                                      <InputGroup hasValidation>
                                        <Form.Control
                                          required={currentTab === 'bank'}
                                          name="bankAccountName"
                                          disabled
                                          readOnly
                                          hidden
                                          type="text"
                                          placeholder={t(
                                            'account-transfer.recipient-name'
                                          )}
                                          value={str}
                                          onChange={(e) => {
                                            setSelectedTemplate({
                                              ...selectedTemplate,
                                              destCustomerName: e.target.value,
                                            });
                                          }}
                                        />
                                        <Form.Control
                                          style={{
                                            backgroundColor:
                                              'rgba(232, 237, 245, 0.32)',
                                          }}
                                          required={currentTab === 'bank'}
                                          disabled
                                          readOnly
                                          type="text"
                                          placeholder={t(
                                            'account-transfer.recipient-name'
                                          )}
                                          value={newStr}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {t('account-transfer.recipient-name')}
                                          .
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </div>
                                    <div className="transfer-title">
                                      <h5>{t('account-transfer.amount')}</h5>
                                    </div>
                                    <div className="input-item">
                                      <InputGroup hasValidation>
                                        <CurrencyInput
                                          onWheel={(e) => e.target.blur()}
                                          name="bankAmount"
                                          id="bankAmount"
                                          data-number-stepfactor="100"
                                          value={addAmountBank}
                                          placeholder="Мөнгөн дүн"
                                          onChange={handleChangeBank}
                                          required={currentTab === 'bank'}
                                          defaultValue={
                                            transferInfo?.bank?.amount
                                          }
                                          allowDecimals
                                          decimalsLimit="2"
                                          disableAbbreviations
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {t('account-transfer.amount')}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </div>
                                    <div className="transfer-title">
                                      <h5>
                                        {t(
                                          'account-transfer.transaction-value '
                                        )}
                                      </h5>
                                    </div>
                                    <div className="input-item">
                                      <InputGroup hasValidation>
                                        <Form.Control
                                          required={currentTab === 'bank'}
                                          name="bankDescription"
                                          defaultValue={
                                            transferInfo?.bank?.description
                                          }
                                          type="text"
                                          placeholder={t(
                                            'account-transfer.transaction-value '
                                          )}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {t(
                                            'account-transfer.transaction-value '
                                          )}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </div>
                                  </div>
                                  <div className="tw-single-button">
                                    <Button
                                      disabled={!forDisabledBank}
                                      type="submit"
                                      name="transferToBank"
                                    >
                                      {t('account-charge.continue')}
                                    </Button>
                                  </div>
                                </div>
                              </Tab>
                              <Tab
                                eventKey="fund"
                                title={t('account-transfer.account-fund')}
                              >
                                <div className="content">
                                  <Row>
                                    <Col sm={12} lg={6}>
                                      <div className="grid-form">
                                        <div className="transfer-title">
                                          <h5>
                                            {t(
                                              'account-transfer.type-of-consolidated'
                                            )}
                                          </h5>
                                        </div>
                                        <div className="input-item">
                                          <div className="bank-dropdown">
                                            <InputGroup hasValidation>
                                              <Form.Select
                                                required={currentTab === 'fund'}
                                                aria-label="Default select example"
                                                className="select-bank"
                                                defaultValue="phone"
                                                name="fundType"
                                                onChange={handleFundSelect}
                                              >
                                                <option
                                                  value="phone"
                                                  className="label-item"
                                                >
                                                  {t('phone-number')}
                                                </option>
                                                <option
                                                  value="mobile"
                                                  className="label-item"
                                                >
                                                  {t('home-tele')}
                                                </option>
                                                <option
                                                  value="email"
                                                  className="label-item"
                                                >
                                                  {t('email')}
                                                </option>
                                              </Form.Select>
                                              <Form.Control.Feedback type="invalid">
                                                {t('account-select')}
                                              </Form.Control.Feedback>
                                            </InputGroup>
                                          </div>
                                        </div>
                                        <div className="transfer-title">
                                          <h5>
                                            {t(
                                              'account-transfer.recipient-bank'
                                            )}
                                          </h5>
                                        </div>
                                        <div className="input-item">
                                          <InputGroup hasValidation>
                                            <Form.Control
                                              style={{
                                                backgroundColor:
                                                  'rgba(232, 237, 245, 0.32)',
                                              }}
                                              required={currentTab === 'fund'}
                                              readOnly
                                              name="fundBank"
                                              placeholder={t(
                                                'account-transfer.recipient-bank'
                                              )}
                                              value={camUserInfo.bankName}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {t(
                                                'account-transfer.recipient-bank'
                                              )}
                                            </Form.Control.Feedback>
                                          </InputGroup>
                                        </div>
                                      </div>
                                    </Col>
                                    <Col sm={12} lg={6}>
                                      <div className="grid-form">
                                        <div>
                                          <div className="transfer-title">
                                            <h5>
                                              {t(
                                                'account-transfer.value-of-consolidated'
                                              )}
                                            </h5>
                                          </div>
                                          <div className="input-item">
                                            <InputGroup hasValidation>
                                              <Form.Control
                                                required={currentTab === 'fund'}
                                                type="text"
                                                maxLength="50"
                                                placeholder={t(
                                                  'account-transfer.value-of-consolidated'
                                                )}
                                                name="fundValue"
                                                onBlur={(e) =>
                                                  checkCamInfo(e.target.value)
                                                }
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {t(
                                                  'account-transfer.value-of-consolidated'
                                                )}
                                              </Form.Control.Feedback>
                                            </InputGroup>
                                          </div>
                                        </div>
                                        <div>
                                          <div className="transfer-title">
                                            <h5>
                                              {t(
                                                'account-transfer.recipient-account-number'
                                              )}
                                            </h5>
                                          </div>
                                          <div className="input-item">
                                            <InputGroup hasValidation>
                                              <Form.Control
                                                style={{
                                                  backgroundColor:
                                                    'rgba(232, 237, 245, 0.32)',
                                                }}
                                                required={currentTab === 'fund'}
                                                readOnly
                                                type="text"
                                                name="fundAccount"
                                                placeholder={t(
                                                  'account-transfer.recipient-account-number'
                                                )}
                                                value={camUserInfo.accountNo}
                                              />
                                              <Form.Control.Feedback type="invalid">
                                                {t(
                                                  'account-transfer.recipient-account-number'
                                                )}
                                              </Form.Control.Feedback>
                                            </InputGroup>
                                          </div>
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                  <div className="transfer-title">
                                    <h5>
                                      {t('account-transfer.recipient-name')}
                                    </h5>
                                  </div>
                                  <div className="input-item">
                                    <InputGroup hasValidation>
                                      <Form.Control
                                        style={{
                                          backgroundColor:
                                            'rgba(232, 237, 245, 0.32)',
                                        }}
                                        required={currentTab === 'fund'}
                                        type="text"
                                        readOnly
                                        name="fundReceiver"
                                        placeholder={t(
                                          'account-transfer.recipient-name'
                                        )}
                                        value={camUserInfo.username}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {t('account-transfer.recipient-name')}.
                                      </Form.Control.Feedback>
                                    </InputGroup>
                                  </div>
                                  <div className="transfer-title">
                                    <h5>{t('account-transfer.amount')}</h5>
                                  </div>
                                  <div className="input-item">
                                    <InputGroup hasValidation>
                                      <CurrencyInput
                                        onWheel={(e) => e.target.blur()}
                                        name="fundAmount"
                                        id="fundAmount"
                                        data-number-to-fixed="2"
                                        data-number-stepfactor="100"
                                        value={addAmountFund}
                                        placeholder={t(
                                          'account-transfer.amount'
                                        )}
                                        onChange={handleChangeFund}
                                        onBlur={handleOnBlurFund}
                                        required={currentTab === 'fund'}
                                        allowDecimals
                                        decimalsLimit="2"
                                        disableAbbreviations
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {t('account-transfer.amount')}.
                                      </Form.Control.Feedback>
                                    </InputGroup>
                                  </div>
                                  <div className="transfer-title">
                                    <h5>
                                      {t('account-transfer.transaction-value ')}
                                    </h5>
                                  </div>
                                  <div className="input-item">
                                    <InputGroup hasValidation>
                                      <Form.Control
                                        required={currentTab === 'fund'}
                                        type="text"
                                        name="fundDescription"
                                        placeholder={t(
                                          'account-transfer.transaction-value '
                                        )}
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {t(
                                          'account-transfer.transaction-value '
                                        )}
                                      </Form.Control.Feedback>
                                    </InputGroup>
                                  </div>
                                  <div className="tw-single-button">
                                    <Button
                                      type="submit"
                                      disabled={!camInfoFound}
                                    >
                                      {t('account-charge.continue')}
                                    </Button>
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
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
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

export default AccountTransfer;
