import Sidebar from 'components/sidebar/control';
import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Topbar from 'components/topbar';
import axios from 'axios';
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
    dataIsNotif();
  }, [limit]);

  useEffect(() => {
    const getNotification = (data) => {
      const body = {
        id: data,
      };
      axios.post(`/api/notifications/getnotificationid`, body).then(
        (resp) => {
          setNotification(resp.data.result);
        },
        (error) => {
          setNotification(error?.response?.data);
        }
      );
    };
    getNotification(id);
  }, [id]);

  const fetchMoreData = () => {
    setTimeout(() => {
      setLimit(limit + 25);
    }, 1000);
  };
  const dataIsNotif = () => {
    const body = {
      limit: limit,
    };
    axios.post(`/api/notifications/getnotification`, body).then(
      (resp) => {
        setNotifications(resp.data.result);
      },
      (error) => {}
    );
  };
  const ReadSelevt = (value) => {
    const body = {
      Id: value,
    };
    axios.post(`/api/notifications/get-notification-read`, body).then(
      (resp) => {
        router.push('/app/dashboard/notification/' + value);
        dataIsNotif();
      },
      (error) => {}
    );
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
              <Topbar name={t('notif')} logo={'/icon-notify.svg'} />
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
                <Col xs={{ order: 'last' }} lg={4}>
                  <div className="notif-stack">
                    <h5 className="notif-header">{t('notifs')}</h5>

                    <ul className="notif-scroll">
                      <InfiniteScroll
                        dataLength={limit}
                        next={fetchMoreData}
                        hasMore={true}
                        height={690}
                        loader={
                          <div className="loader">Мэдэгдэл дууслаа...</div>
                        }
                      >
                        {notifications?.map((notification) => (
                          <div
                            key={notification.notificationId}
                            onClick={() =>
                              ReadSelevt(notification.notificationId)
                            }
                          >
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
                        ))}
                      </InfiniteScroll>
                    </ul>
                  </div>
                </Col>
                <Col xs={{ order: 'first' }} lg={8}>
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
