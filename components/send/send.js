import React, { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import axios from 'axios';
import IctContext from 'context/ict-context';
import FailNotification from 'components/notification/fail-notif';
import { useRouter } from 'next/router';

const Send = () => {
  const [dataTemplate, setDataTemplate] = useState([]);
  const [alert, setAlert] = useState({ show: false });
  const { setSelect } = useContext(IctContext);

  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    axios.get('/api/account/transfer-template').then(
      (resp) => {
        setDataTemplate(resp.data);
      },
      (error) => {
        return null;
      }
    );
  }

  const { t } = useTranslation('dashboard');

  const handleSelect = (value) => {
    setSelect(value);
    router.push('/app/dashboard/account/transfer?type=bank');
  };

  const closeNotification = () => {
    setAlert(null);
  };

  return (
    <div className="content-inner">
      <div className="title">
        <h5>{t('easy-transaction')}</h5>
      </div>
      {dataTemplate.length === 0 ? (
        <div className="none-trans-temp">
          <div className="trans-image">
            <img src="/icon-empty.svg" />
          </div>
          <div>
            <p className="none-paragraph">{t('trans-temp-desc')}</p>
          </div>
        </div>
      ) : (
        <>
          {dataTemplate.map((template, i) => (
            <div className="easy-transfer" key={i}>
              <div className="content-item">
                <div className="saved-banks">
                  <h5 className="title">{template.templateName}</h5>
                  <div>
                    <span className="bank">{template.destBankName}</span>
                    <span className="bank-id">{template.destAccountNo}</span>
                  </div>
                </div>
                <Button onClick={(e) => handleSelect(template.templateId)}>
                  <h5>{t('transfer')}</h5>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.23525 5.96695C2.66958 4.11534 4.11534 2.66958 5.96696 2.23525C7.30417 1.92158 8.69583 1.92158 10.033 2.23525C11.8847 2.66958 13.3304 4.11534 13.7647 5.96696C14.0784 7.30417 14.0784 8.69583 13.7647 10.033C13.3304 11.8847 11.8847 13.3304 10.033 13.7648C8.69583 14.0784 7.30417 14.0784 5.96696 13.7648C4.11534 13.3304 2.66958 11.8847 2.23525 10.033C1.92158 8.69583 1.92158 7.30417 2.23525 5.96695Z"
                      stroke="#4341CC"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6.35014 9.64992L9.64997 6.35008M9.64997 6.35008L7.29295 6.35008M9.64997 6.35008L9.64997 8.70711"
                      stroke="#4341CC"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </>
      )}
      {alert?.show && (
        <FailNotification
          show={alert.show}
          infos={alert.message}
          close={closeNotification}
        ></FailNotification>
      )}
    </div>
  );
};

export default Send;
