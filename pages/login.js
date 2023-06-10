import { React, useContext, useState } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import Link from 'next/link';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';
import axios from '@/utils/axiosClient';
import IctContext from 'context/ict-context';
import FailNotification from 'components/notification/fail-notif';
import useTranslation from 'next-translate/useTranslation';
import LanguageChange from 'components/language-change';

const Login = (props) => {
  const { t } = useTranslation('login');
  const { user, authorized, setLogin, setPinStatus, setToken, setPaswoard } =
    useContext(IctContext);
  const [passwordShown, setPasswordShown] = useState(false);
  const [alert, setAlert] = useState({ show: false });

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const [validated, setValidated] = useState(false);

  const router = useRouter();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
    } else {
      const phone = form.phonenumber.value;
      const password = form.password.value;

      const body = {
        phone: phone,
        password: password,
      };

      setPaswoard(password);
      let authToken;
      let permToken;
      await axios.post('/api/login', body).then(
        async (resp) => {
          authToken = resp.data.authToken;
          permToken = resp.data.permToken;
          jsCookie.set('auth', authToken, { expires: 1 / 24 / 6 });
          jsCookie.set('perm', permToken, { expires: 1 / 24 / 6 });
          const userInfo = await getShortInfo().then((resp) => {
            setLogin(resp.data.result);
            return resp.data.result;
          });

          if (userInfo) {
            const route = userInfo.pin ? '/app/dashboard' : '/registration/pin';
            router.push(route);
          }
        },
        (error) => {
          if (error.response?.status === 408) {
            permToken = error.response.data.permToken;
            jsCookie.set('perm', permToken);
            router.push('/registration/personal-info');
          }
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
          <div className="tw-logo-title">
            <Link href="/#">
              <div>
                <img src="/monpay-logo-form.svg" />
              </div>
            </Link>
            <div className="tw-form-title">
              <span>{t('title')}</span>
            </div>
          </div>
          <Form
            className="tw-register"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            <Form.Group>
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend"></InputGroup.Text>
                <Form.Control
                  required
                  name="phonenumber"
                  type="text"
                  className="tw-input tw-phone"
                  placeholder={t('phone')}
                  onKeyPress={(event) => {
                    if (isNaN(event.key)) event.preventDefault();
                  }}
                  maxLength={8}
                  pattern="[1-9]{1}[0-9]{7}"
                  autoComplete="off"
                />
                <Form.Control.Feedback type="invalid">
                  {t('validation.phone')}
                </Form.Control.Feedback>
              </InputGroup>
              <InputGroup hasValidation>
                <InputGroup.Text
                  className="password"
                  id="inputGroupPrepend"
                ></InputGroup.Text>
                <Form.Control
                  required
                  name="password"
                  type={passwordShown ? 'text' : 'password'}
                  className="tw-input tw-password"
                  placeholder={t('password')}
                  autoComplete="off"
                />
                <span className="icon-on-off" onClick={togglePasswordVisiblity}>
                  <img src="/icon-off.svg" />
                </span>
                <Form.Control.Feedback type="invalid">
                  {t('validation.password')}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <div className="tw-recover-password">
              <Link href="/forgot-password">
                <Button>{t('recover')}</Button>
              </Link>
            </div>
            <div className="tw-form-buttons">
              <div className="tw-top-button">
                <Button type="submit">{t('login')}</Button>
              </div>
              <div className="tw-bottom-button">
                <Link href="/registration">
                  <Button type="submit">{t('register')}</Button>
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

export default Login;
