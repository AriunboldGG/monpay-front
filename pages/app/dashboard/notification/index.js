import Sidebar from 'components/sidebar/control';
import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Topbar from 'components/topbar';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import InfiniteScroll from 'react-infinite-scroll-component';
import useTranslation from 'next-translate/useTranslation';

const NotificationID = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation('common');
  const [notifications, setNotifications] = useState([]);
  const [limit, setLimit] = useState(25);
  const [notificationactive, setNotification] = useState([]);
  useEffect(() => {
    const body = {
      limit: limit,
    };
    axios.post(`/api/notifications/getnotification`, body).then(
      (resp) => {
        setNotifications(resp.data.result);
      },
      (error) => {}
    );
  }, [limit]);
  const fetchMoreData = () => {
    setTimeout(() => {
      setLimit(limit + 10);
    }, 1500);
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
              <Topbar name={t('notif')} />
            </Col>
          </Row>
          <Row className="wrapper-row">
            <div
              style={{
                maxWidth: '1032px',
                margin: 'auto',
                padding: '0',
              }}
            >
              <Row className="notif">
                <Col xs={12} lg={4}>
                  <div className="notif-stack">
                    <h5 className="notif-header">{t('notifs')}</h5>

                    <InfiniteScroll
                      dataLength={limit}
                      next={fetchMoreData}
                      hasMore={true}
                    >
                      <ul>
                        {notifications &&
                          notifications.map((notification) => (
                            <Link
                              href={
                                '/app/dashboard/notification/' +
                                notification.notificationId
                              }
                              key={notification.notificationId}
                            >
                              <div>
                                <li
                                  className={
                                    notification.isRead
                                      ? 'notif-descreptions'
                                      : 'yesif-descreptions'
                                  }
                                >
                                  <p>{notification.message}</p>
                                  <span className="notif-date">
                                    {notification.dateUI}
                                  </span>
                                </li>
                              </div>
                            </Link>
                          ))}
                      </ul>
                    </InfiniteScroll>
                  </div>
                </Col>
                <Col xs={12} lg={8}>
                  <div className="notif-detail-item">
                    <div className="header">
                      <span className="notif-item-header">
                        {notificationactive?.title}
                        {notificationactive?.info}
                      </span>
                      <div>
                        <span className="notif-date">
                          {notificationactive?.dateUI}
                        </span>
                      </div>
                    </div>
                    <div className="notif-info">
                      <div className="notif-header">
                        {notificationactive?.message}
                      </div>
                      <div>
                        <img src={notificationactive?.img} />
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default NotificationID;
