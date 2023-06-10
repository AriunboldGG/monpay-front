import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
import IctContext from 'context/ict-context';
import LanguageChange from '../language-change';
import useTranslation from 'next-translate/useTranslation';

const Topbar = ({ name, logo }) => {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [alert, setAlert] = useState(false);
  const { user } = useContext(IctContext);
  const { t } = useTranslation('common');

  useEffect(() => {
    const userShortInfo = JSON.parse(localStorage.getItem('user'));
    if (!userShortInfo) return router.push('/login');
    setDisplayName(
      `${userShortInfo.lastName?.substring(0, 1)}. ${userShortInfo.firstName}`
    );
    isReadData();
  }, []);
  const isReadData = (value, i) => {
    const body = {
      limit: null,
    };
    axios.post(`/api/notifications/getnotification`, body).then(
      (resp) => {
        setNotifications(resp.data.result ?? []);
        resp.data.result &&
          resp.data.result.map((item) => {
            if (item.isRead == false) {
              setAlert(true);
            }
          });
      },
      (error) => {
        setNotifications([]);
      }
    );
  };

  return (
    <>
      <div className="topbar-inner mobile">
        <div className="image">
          <img src={logo} />
        </div>
        <span className="title">{name}</span>
      </div>
      <div className="Topbar">
        <div className="top-left-side">
          <div className="mobile-logo">
            <Link href="/#">
              <img src="/monpay-mobile-logo.svg" />
            </Link>
          </div>
          <div className="topbar-inner">
            <div className="image ">
              <img src={logo} />
            </div>
            <span className="title">{name}</span>
          </div>
        </div>
        <div className="top-right-side">
          <LanguageChange />
          <div className="mp-notification">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-autoclose-true">
                <img
                  src={
                    alert
                      ? '/alert-blue-notif.svg'
                      : '/topbar-icon-notification.svg'
                  }
                />
              </Dropdown.Toggle>
              <Dropdown.Menu className="mp-notifivation-menu">
                <div className="mp-medegdel">{t('notif')}</div>
                {user ? (
                  notifications &&
                  notifications.map((notification, i) => {
                    if (i < 4) {
                      return (
                        <Dropdown.Item
                          key={i}
                          href={
                            '/app/dashboard/notification/' +
                            notification.notificationId
                          }
                        >
                          {notification.isRead ? (
                            <>
                              <span className="mp-nof-icon"></span>
                            </>
                          ) : (
                            <span className="mp-nof-icon">
                              <img src="/new-ind.svg" />
                            </span>
                          )}
                          <div className="mp-notify-data">
                            <span className="mp-nof-title">
                              {notification.message}
                            </span>
                            <span className="mp-nof-date">
                              {notification.dateUI}
                            </span>
                          </div>
                        </Dropdown.Item>
                      );
                    }
                  })
                ) : (
                  <></>
                )}
                <span className="mp-show-all-nof">
                  <Link
                    href={
                      '/app/dashboard/notification/' +
                      (notifications ? notifications[0]?.notificationId : '')
                    }
                  >
                    {t('view-all')}
                  </Link>
                </span>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <Link href="/app/dashboard/profile" className="content">
            <div className="inner">
              <div className="info">
                <span className="people-name">{displayName}</span>
                <span className="people-phone-number">{user?.phone}</span>
              </div>
              <div className="avatar">
                <img className="profileImgSmall" src={user?.image} />
                <div className="user-icon-verify">
                  <img src="/user-icon-verify.svg" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Topbar;
