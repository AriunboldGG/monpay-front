import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const PaymentSidebar = (props) => {
  const router = useRouter();
  const { t } = useTranslation('payment-sidebar');

  return (
    <div className="sidebar-of-content">
      <div className="sidebar-content-inner">
        <div className="sidebar-title">
          <h6>{t('payment')}</h6>
        </div>
        <ul className="sidebarListAccount">
          <div className="top-list">
            <Link href="/app/dashboard/payment">
              <div
                className={
                  router.pathname == '/app/dashboard/payment' ? 'active' : ''
                }
              >
                <li className="li-item">
                  <div className="item-inner">
                    <div className="icon add">
                      <img src="/icon-add-my.svg" />
                    </div>
                    <span>{t('own-payment')}</span>
                  </div>
                </li>
              </div>
            </Link>
            <Link href="/app/dashboard/payment/other-payment">
              <div
                className={
                  router.pathname == '/app/dashboard/payment/other-payment'
                    ? 'active'
                    : ''
                }
              >
                <li className="li-item">
                  <div className="item-inner">
                    <div className="icon transfer">
                      <img src="/sidebar-icon-transfer.svg" />
                    </div>
                    <span>{t('payment-of-others')}</span>
                  </div>
                </li>
              </div>
            </Link>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default PaymentSidebar;
