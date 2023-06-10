import React, { useContext, useState, useEffect } from 'react';
import IctContext from 'context/ict-context';
import { getFullInfo } from 'service/user';
import moment from 'moment';
import useTranslation from 'next-translate/useTranslation';
import { CopyToClipboard } from 'react-copy-to-clipboard';

/*
  Дансны үлдэгдэл , дугаар харуулж байгаа хэсэг
  
*/

const AccountInfo = ({ balanceInfo }) => {
  const { info, setUserInfo, setLogout } = useContext(IctContext);
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  const { t } = useTranslation('common');

  const toggle = () => {
    const state = show;
    setShow(!state);
  };

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

  const thousands = /\B(?=(\d{3})+(?!\d))/g;

  return (
    <div className="deposit-account">
      <div className="content">
        <div className="deposit-left-side">
          <div className="image">
            <img src="/deposit-icon-monpay.svg" />
          </div>
          <div className="content-inner">
            <div className="content-item">
              <h6>{t('balance')}</h6>
              <div className={show ? 'hide' : 'show'}>
                <img onClick={toggle} src="/account-icon-on.svg" />
              </div>
            </div>
            <span>
              {show
                ? '***.***'
                : info?.balance.toString().replace(thousands, ',') ?? '0.00'}
              ₮
            </span>
          </div>
        </div>
        <div className="deposit-right-side">
          <div className="top-content">
            <h6>{t('monpay-account')}</h6>
            <CopyToClipboard
              text={info?.accountNo}
              onCopy={() =>
                alert(!copied ? 'Дансны дугаар амжилттай хуулагдлаа' : null)
              }
            >
              <div className="image">
                <img src="/deposit-icon-copy.svg" />
              </div>
            </CopyToClipboard>
          </div>
          <div className="account-no">
            <span>{info?.accountNo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
