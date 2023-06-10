import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

const SidebarContract = (props) => {
  const router = useRouter();
  const { t } = useTranslation('help-sidebar');

  return (
    <div className="sidebar-of-content">
      <div className="sidebar-content-inner">
        <div className="sidebar-title">
          <h6>{t('help')}</h6>
        </div>
        <ul className="sidebarListAccount">
          <div className="top-list">
            <Link href="/app/dashboard/help">
              <div
                className={
                  router.pathname == '/app/dashboard/help' ? 'active' : ''
                }
              >
                <li className="li-item">
                  <div className="item-inner">
                    <div className="icon pin">
                      <img src="/sidebar-icon-pin.svg" />
                    </div>
                    <span>{t('contract-point')}</span>
                  </div>
                </li>
              </div>
            </Link>
            <Link href="/app/dashboard/help/question">
              <div
                className={
                  router.pathname == '/app/dashboard/help/question'
                    ? 'active'
                    : ''
                }
              >
                <li className="li-item">
                  <div className="item-inner">
                    <div className="icon question">
                      <img src="/sidebar-icon-question.svg" />
                    </div>
                    <span>{t('faq')}</span>
                  </div>
                </li>
              </div>
            </Link>
          </div>
          <Link href="/app/dashboard/help/video">
            <div
              className={
                router.pathname == '/app/dashboard/help/video' ? 'active' : ''
              }
            >
              <div className="top-border">
                <li className="li-item">
                  <div className="item-inner">
                    <div className="icon video">
                      <img src="/sidebar-icon-video.svg" />
                    </div>
                    <span>{t('watch-video')}</span>
                  </div>
                </li>
              </div>
            </div>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default SidebarContract;
