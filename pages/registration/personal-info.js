import { React, useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import LanguageChange from 'components/language-change';
import IctContext from 'context/ict-context';
import axios from 'axios';
import FormData from 'form-data';
import FailNotification from 'components/notification/fail-notif';

const PersonalInfo = (props) => {
  const [alert, setAlert] = useState({ show: false });
  const [user, setUser] = useState();
  const [validated, setValidated] = useState(false);
  const [showFiled, setShowFiled] = useState(false);
  const [img, setSelectedImage] = useState('');
  const { t } = useTranslation('registration');
  const { setLogin } = useContext(IctContext);
  const router = useRouter();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
    } else {
      const fData = new FormData();
      fData.append('firstname', form.firstname.value);
      fData.append('lastname', form.lastname.value);
      fData.append('registerNo', form.registerNo.value);
      fData.append('image', img);
      await axios.post('/api/user/login-register', fData).then(
        async (resp) => {
          router.push('/registration/personal-success');
        },
        (error) => {
          setAlert({
            show: true,
            message: error.response?.data?.info,
          });
          event.stopPropagation();
        }
      );
    }
    setValidated(true);
  };

  const setPhoto = (event) => {
    if (event.target.files[0].size <= 2000000) {
      setSelectedImage(event.target.files[0]);
      setShowFiled(false);
    } else {
      setInfos('2МВ-с бага хэмжээтэй зураг сонгоно уу!');
      setShowFiled(true);
      setShow(false);
    }
  };

  const getShortInfo = async () => {
    return axios.get('/api/user/short');
  };

  const closeNotification = () => {
    setAlert(null);
  };

  return (
    <Container fluid>
      <Row className="tw-form">
        <Col
          className="tw-image-section d-none d-xl-flex"
          style={{
            backgroundImage: `url("/image-section-background.png")`,
          }}
          xl={7}
          xxl={7}
        >
          <div className="big-image">
            <img className="monpay-logo" src="/monpay-logo-formm.svg" />
            <div className="image-stack">
              <img className="big-image" src="/login-4-images.png" />
              <img className="get-apps" src="/get-apps.svg" />
            </div>
          </div>
        </Col>
        <Col className="tw-login-form" xl={5} xxl={5} xs={12}>
          <LanguageChange />
          <div className="tw-logo-title personal-information">
            <Link href="/#">
              <div>
                <img src="/monpay-logo-form.svg" />
              </div>
            </Link>
            <div className="tw-form-title">
              <span>{t('personal-information')}</span>
              <p>{t('pls-enter')}</p>
            </div>
            <div className="tw-user personal-user-set">
              <div className="tw-user-items">
                <div className="tw-user-profile-img">
                  <img
                    className="image"
                    src={img ? URL.createObjectURL(img) : user?.image}
                  />
                </div>
                <div className="profile-photo-change">
                  <Form.Label>
                    <h6>{t('change-image')}</h6>
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
          </div>
          <Form
            className="tw-register personal-information"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Form.Group>
              <InputGroup hasValidation>
                <Form.Label>{t('last-name')}</Form.Label>
                <Form.Control
                  required
                  name="lastname"
                  type="text"
                  placeholder={t('last-name')}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {t('pls-enter-last')}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <InputGroup hasValidation>
                <Form.Label>{t('first-name')}</Form.Label>
                <Form.Control
                  required
                  name="firstname"
                  type="text"
                  placeholder={t('first-name')}
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {t('pls-enter-first')}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <InputGroup hasValidation>
                <Form.Label>{t('register')}</Form.Label>
                <Form.Control
                  required
                  name="registerNo"
                  placeholder={t('register')}
                  onKeyPress={(event) => {
                    if (isNaN(event.key)) event.preventDefault();
                  }}
                  autoComplete="off"
                  inputMode="numeric"
                  maxLength={6}
                />
                <Form.Control.Feedback type="invalid">
                  {t('enter-register')}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <div className="tw-form-buttons">
              <div className="tw-top-button">
                <Button type="submit">{t('confirm')}</Button>
              </div>
              <div className="tw-bottom-button">
                <Link href="/login">
                  <Button type="submit"> {t('back')}</Button>
                </Link>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
      {alert?.show && (
        <FailNotification
          show={alert.show}
          infos={alert.message}
          close={closeNotification}
        ></FailNotification>
      )}
    </Container>
  );
};

export default PersonalInfo;
