import Sidebar from 'components/sidebar/control';
import React, { useState, useEffect, useContext } from 'react';
import {
  Col,
  Container,
  Row,
  Form,
  Button,
  InputGroup,
  Modal,
} from 'react-bootstrap';
import Topbar from 'components/topbar';
import IctContext from 'context/ict-context';
import { useRouter } from 'next/router';

import SidebarUserProfile from 'components/sidebar/profile';
import FormData from 'form-data';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';
import FailNotification from 'components/notification/fail-notif';
import Notification from 'components/notification/index';

const ProfileMain = (props) => {
  const { t } = useTranslation('profile');
  const [show, setShow] = useState(false);
  const [showFiled, setShowFiled] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const [infos, setInfos] = useState('');
  const [alert, setAlert] = useState({ show: false });
  const [notification, setNotification] = useState({ show: false });
  const [response, setResponse] = useState({});

  const [user, setUser] = useState();
  const { setLogin } = useContext(IctContext);
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  const [img, setSelectedImage] = useState('');

  const setPhoto = (event) => {
    if (event.target.files[0].size <= 2000000) {
      setSelectedImage(event.target.files[0]);
      setShowFiled(false);
      setDisabled(true);
    } else {
      setInfos('2МВ-с бага хэмжээтэй зураг сонгоно уу!');
      setShowFiled(true);
      setShow(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity() === false) {
    } else {
      const fData = new FormData();
      fData.append('firstname', form.firstname.value);
      fData.append('lastname', form.lastname.value);
      fData.append('image', img);

      axios.post(`/api/profile/name`, fData).then(
        (resp) => {
          user.image = resp?.data?.result?.image;
          user.firstName = resp?.data?.result?.firstName;
          user.lastName = resp?.data?.result?.lastName;
          setResponse({ ...resp.data.info, success: true });
          setShow(true);
          setLogin(user);
          setDisabled(false);
        },
        (error) => {
          if (error.response.data.info) {
            setShow(true);
            setResponse({
              ...error.response?.data,
              success: false,
            });
          }

          event.stopPropagation();
        }
      );
    }
  };
  const closeNotification = () => {
    setAlert(null);
  };
  const handleTrue = () => {
    setDisabled(true);
  };
  const handleModal = () => {
    setShow(false);
    if (response.success) {
      router.push('/app/dashboard');
    }

    // router.push('/app/dashboard/account/transfer?type=candy');
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
              <Topbar name={t('settings')} logo="/icon-setting-topbar.svg" />
            </Col>
          </Row>
          <Row className="wrapper-row">
            <div
              style={{
                maxWidth: '768px',
                margin: 'auto',
                padding: '0',
              }}
            >
              <Row>
                <Col xs={12} lg={4}>
                  <SidebarUserProfile />
                </Col>
                <Col xs={12} lg={8} className="tw-user-col">
                  <div className="tw-user-container">
                    <Row>
                      <Col>
                        <div className="tw-user">
                          <div className="tw-user-top">
                            <h4>{t('personal-info')}</h4>
                          </div>
                          <div className="tw-user-items">
                            <div className="tw-user-profile-img">
                              <img
                                className="image"
                                src={
                                  img ? URL.createObjectURL(img) : user?.image
                                }
                              />
                            </div>
                            <div className="profile-photo-change">
                              <Form.Label>
                                <h6>{t('change-photo')}</h6>
                                <Form.Control
                                  style={{
                                    visibility: 'hidden',
                                  }}
                                  onChange={(e) => setPhoto(e)}
                                  type="file"
                                  accept="image/jpg, image/jpeg"
                                  className="custom-file-input"
                                />
                              </Form.Label>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Form noValidate onSubmit={handleSubmit}>
                      <Row>
                        <Col>
                          <div className="tw-user-bottom">
                            <div className="tw-user-form">
                              <div className="person-title">
                                <h5>{t('last-name')}</h5>
                              </div>
                              <div className="input-item">
                                <InputGroup hasValidation>
                                  <Form.Control
                                    required
                                    onChange={handleTrue}
                                    type="text"
                                    name="lastname"
                                    defaultValue={user?.lastName}
                                  />
                                </InputGroup>
                              </div>
                              <div className="person-title">
                                <h5
                                  style={{
                                    marginTop: '12px',
                                  }}
                                >
                                  {t('first-name')}
                                </h5>
                              </div>
                              <div className="input-item">
                                <InputGroup hasValidation>
                                  <Form.Control
                                    required
                                    onChange={handleTrue}
                                    name="firstname"
                                    type="text"
                                    defaultValue={user?.firstName}
                                  />
                                </InputGroup>
                              </div>
                            </div>
                          </div>
                          <div className="tw-user-button">
                            <Button
                              type="submit"
                              variant="primary"
                              disabled={!disabled}
                            >
                              {t('save')}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
                {notification?.show && (
                  <Notification
                    show={notification.show}
                    infos={notification.message}
                    close={closeNotification}
                  />
                )}
                {alert?.show && (
                  <FailNotification
                    show={alert.show}
                    infos={alert.message}
                    close={closeNotification}
                  ></FailNotification>
                )}
                <Modal
                  show={show}
                  onHide={() => setShow(false)}
                  dialogClassName={
                    response.success ? 'success-modal' : 'fail-modal'
                  }
                  centered
                >
                  <div className="content-inner">
                    <Modal.Header>
                      <div className="image">
                        <div className="image-inner">
                          <img
                            src={
                              response.success
                                ? '/modal-icon-success.svg'
                                : '/modal-icon-danger.svg'
                            }
                          />
                        </div>
                      </div>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="body-content">
                        <div className="title">
                          <h5>
                            {response.success ? 'Амжилттай' : 'Амжилтгүй'}
                          </h5>
                        </div>
                        <div className="desc">
                          {response.success ? (
                            <p>Таны хувийн мэдээлэл амжилттай солигдлоо</p>
                          ) : (
                            <p>
                              <strong>{response.info}</strong>
                            </p>
                          )}
                        </div>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={handleModal}>
                        {response.success ? 'Баярлалаа' : 'Хаах'}
                      </Button>
                    </Modal.Footer>
                  </div>
                </Modal>
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default ProfileMain;
