import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const AccountSidebar = (props) => {
  const router = useRouter();
  const { t } = useTranslation('account-sidebar');

  return (
    <div className="sidebar-of-content">
      <div className="sidebar-content-inner">
        <div className="sidebar-title">
          <h6>{t('account-action')}</h6>
        </div>
        <ul className="sidebarListAccount">
          <div className="top-list">
            <Link href="/app/dashboard/account">
              <div
                className={
                  router.pathname == '/app/dashboard/account' ? 'active' : ''
                }
              >
                <li className="li-item">
                  <div className="item-inner">
                    <div className="icon add">
                      <img src="/icon-add-my.svg" />
                    </div>
                    <span>{t('cash-in')}</span>
                  </div>
                </li>
              </div>
            </Link>
            <Link href="/app/dashboard/account/transfer">
              <div
                className={
                  router.pathname.search('/app/dashboard/account/') >= 0
                    ? 'active'
                    : ''
                }
              >
                <li className="li-item">
                  <div className="item-inner">
                    <div className="icon transfer">
                      <img src="/sidebar-icon-transfer.svg" />
                    </div>
                    <span>{t('transfer')}</span>
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

export default AccountSidebar;
