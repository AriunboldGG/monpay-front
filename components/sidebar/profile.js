import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const SidebarUserProfile = (props) => {
  const { t } = useTranslation('profile-sidebar');
  const router = useRouter();
  const [user, setUser] = useState();
  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);
  return (
    <div className="sidebar-of-content">
      <div className="sidebar-content-inner">
        <div className="sidebar-title">
          <h6>{t('settings')}</h6>
        </div>
        <ul className="sidebarListAccount">
          <div className="top-list">
            <Link href="/app/dashboard/profile">
              <div
                className={
                  router.pathname == '/app/dashboard/profile' ? 'active' : ''
                }
              >
                <li className="li-item">
                  <div className="item-inner">
                    <div className="icon user">
                      <img src="/icon-user.svg" />
                    </div>
                    <span>{t('personal-info')}</span>
                  </div>
                </li>
              </div>
            </Link>

            <Link href="/app/dashboard/profile/phone">
              <div
                className={
                  router.pathname.search('/dashboard/profile/phone') >= 0
                    ? 'active'
                    : ''
                }
              >
                <li className="li-item">
                  <div className="item-inner">
                    <div className="icon mobile">
                      <img src="/icon-mobile-profile.svg" />
                    </div>
                    <span>{t('phone-number')}</span>
                  </div>
                </li>
              </div>
            </Link>
            <Link
              href={
                user?.email
                  ? '/app/dashboard/profile/email'
                  : '/app/dashboard/profile/email-confirm'
              }
            >
              <div
                className={
                  router.pathname.search('/dashboard/profile/email') >= 0
                    ? 'active'
                    : ''
                }
              >
                <li className="li-item">
                  <div className="item-inner">
                    <div className="icon mail">
                      <img src="/icon-mail.svg" />
                    </div>
                    <span>{t('email')}</span>
                  </div>
                </li>
              </div>
            </Link>
          </div>
          <Link href="/app/dashboard/profile/password-change">
            <div
              className={
                router.pathname == '/app/dashboard/profile/password-change'
                  ? 'active'
                  : ''
              }
            >
              <div className="top-border">
                <li className="li-item">
                  <div className="item-inner">
                    <div className="icon password">
                      <img src="/icon-password.svg" />
                    </div>
                    <span>{t('change-pass')}</span>
                  </div>
                </li>
              </div>
            </div>
          </Link>
          <Link href="/app/dashboard/profile/pincode">
            <div
              className={
                router.pathname.search('/dashboard/profile/pincode') >= 0
                  ? 'active'
                  : ''
              }
            >
              <li className="li-item">
                <div className="item-inner">
                  <div className="icon more">
                    <img src="/icon-more.svg" />
                  </div>
                  <span>{t('pin-code')}</span>
                </div>
              </li>
            </div>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
