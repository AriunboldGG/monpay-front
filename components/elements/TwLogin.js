import React, { useState, useEffect } from 'react';
import { RenderElementWrapper } from 'components/elements/RenderElements';
import { Form, Button, Col, Row, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { isLoggedIn, login } from 'lib/auth';
const TwLogin = (props) => {
  const $atts = props.atts
    ? props.atts
    : { element_atts: { class: ['tw-element tw-login'] } };
  const [step, setStep] = useState(0);

  // Login
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [errorMessageStatus, setErrorMessageStatus] = useState(0);

  // Forgot password
  const [Phonenumber, setPhonenumber] = useState();
  const [token, setToken] = useState();

  // Verify code
  const [verifyCode1, setVerifyCode1] = useState();
  const [verifyCode2, setVerifyCode2] = useState();
  const [verifyCode3, setVerifyCode3] = useState();
  const [verifyCode4, setVerifyCode4] = useState();
  const [verifyCode5, setVerifyCode5] = useState();
  const [verifyCode6, setVerifyCode6] = useState();

  // Verify code
  const [NewPassword, setNewPassword] = useState();
  const [ConfirmPassword, setConfirmPassword] = useState();
  const [JWTToken, setJWTToken] = useState();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const msg = await login({ username, password });
    setErrorMessage(msg);
  };

  const handleSubmitPhone = (e) => {
    e.preventDefault();
    var axios = require('axios');
    var data = JSON.stringify({ Phonenumber: Phonenumber });
    var config = {
      method: 'post',
      url: 'http://183.177.98.155/api/Account/Forgotpassword/Getsmstoken',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          if (JSON.parse(response.data).Status === 1) {
            setToken(JSON.parse(response.data).Message);
            setStep(parseInt(step) + 1);
            handleReset();
          } else {
            setErrorMessage(JSON.parse(response.data).Message);
          }
        }
      })
      .catch(function (error) {});
  };

  const handleSubmitVerify = (e) => {
    e.preventDefault();
    if (
      token &&
      verifyCode1 &&
      verifyCode2 &&
      verifyCode3 &&
      verifyCode4 &&
      verifyCode5 &&
      verifyCode6
    ) {
      var axios = require('axios');
      var data = JSON.stringify({
        Token: token,
        SMSToken:
          verifyCode1 +
          verifyCode2 +
          verifyCode3 +
          verifyCode4 +
          verifyCode5 +
          verifyCode6,
      });

      var config = {
        method: 'post',
        url: 'http://183.177.98.155/api/Account/Verifysmstoken',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          if (response.status === 200) {
            if (JSON.parse(response.data).Status === 1) {
              setJWTToken(JSON.parse(response.data).Message);
              setStep(parseInt(step) + 1);
              handleReset();
            } else {
              setErrorMessage(JSON.parse(response.data).Message);
            }
          }
        })
        .catch(function (error) {});
    }
  };

  const handleSubmitNewpass = (e) => {
    e.preventDefault();
    var axios = require('axios');
    var data = JSON.stringify({
      JWTToken: JWTToken,
      NewPassword: NewPassword,
      ConfirmPassword: ConfirmPassword,
    });

    var config = {
      method: 'post',
      url: 'http://183.177.98.155/api/Account/Forgotpassword/Reset',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          if (JSON.parse(response.data).Status === 1) {
            setStep(0);
            setErrorMessage(
              'Амжилттай солигдлоо. Та шинэ нууц үгээ ашиглан нэвтрэнэ үү'
            );
            setErrorMessageStatus(1);
          } else {
            setErrorMessage(JSON.parse(response.data).Message);
          }
        }
      })
      .catch(function (error) {});
  };

  const handleStepPrev = (e) => {
    e.preventDefault();
    handleReset();
    setStep(parseInt(step) - 1);
  };

  const handleReset = (e) => {
    setErrorMessage('');
  };

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  const inputNextFocus = (e) => {
    const { maxLength, value, name } = e.target;
    const [fieldName, fieldIndex] = name.split('-');

    // Check if they hit the max character length
    if (value.length >= maxLength) {
      // Check if it's not the last input field
      if (parseInt(fieldIndex, 10) < 6) {
        // Get the next input field
        const nextSibling = document.querySelector(
          `input[name=verifyCode-${parseInt(fieldIndex, 10) + 1}]`
        );

        // If found, focus the next field
        if (nextSibling !== null) {
          nextSibling.focus();
          nextSibling.value = '';
        }
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      Router.replace('/profile');
      return null;
    }
  }, []);

  if (isLoggedIn()) {
    return null;
  } else {
    return (
      <RenderElementWrapper atts={$atts}>
        <div className="tw-login-header">
          <span>{step === 0 ? 'Нэвтрэх' : 'Нууц үг сэргээх'}</span>
          {step === 2 && (
            <p>Дугаарт мессежээр ирсэн 6 оронтой кодыг оруулна уу</p>
          )}
        </div>
        {errorMessage && (
          <Row className="tw-form-row">
            <Col className="tw-form-col" lg={12}>
              <Form.Group className="tw-mb-0 tw-mt-40">
                <Alert
                  className="tw-mb-0"
                  variant={errorMessageStatus === 0 ? 'danger' : 'success'}
                >
                  <p>{errorMessage}</p>
                </Alert>
              </Form.Group>
            </Col>
          </Row>
        )}
        {step === 0 && (
          <Form
            className="tw-login-form"
            method="post"
            onSubmit={handleLoginSubmit}
          >
            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={6}>
                <img src="" />
                <Row className="tw-form-row">
                  <Col></Col>
                  <Col className="tw-form-col" lg={6}>
                    <Form.Group>
                      <Form.Control
                        required
                        name="password"
                        type="password"
                        className="itFormControl"
                        placeholder="Нууц үг"
                        onChange={(e) => {
                          const value = e.target.value;
                          setPassword(value);
                        }}
                      />
                      <Form.Label className="itFormLabel">Нууц үг</Form.Label>
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col className="tw-form-col" lg={6}>
                <Form.Group>
                  <Form.Control
                    required
                    name="username"
                    type="text"
                    className="itFormControl"
                    placeholder="Утасны дугаар"
                    onChange={(e) => {
                      const value = e.target.value;
                      setUsername(value);
                    }}
                  />
                  <Form.Label className="itFormLabel">Утасны дугаар</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    Утасны дугаар
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="tw-form-row">
              <Col></Col>
              <Col className="tw-form-col" lg={6}>
                <Form.Group>
                  <Form.Control
                    required
                    name="password"
                    type="password"
                    className="itFormControl"
                    placeholder="Нууц үг"
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);
                    }}
                  />
                  <Form.Label className="itFormLabel">Нууц үг</Form.Label>
                </Form.Group>
              </Col>
            </Row>

            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <div className="itLoginButtonContainer d-flex justify-content-center">
                    <Button
                      className="itLoginButton tw-login-buttons"
                      type="submit"
                    >
                      Нэвтрэх
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <Row className="loginRow no-gutters">
                    <Col className="d-none d-lg-block">
                      <div className="itMenuModalLine col-md-auto"></div>
                    </Col>
                    <Col lg={4}>
                      <div className="itMenuModalLineText">Бүртгэлгүй бол?</div>
                    </Col>
                    <Col className="d-none d-lg-block">
                      <div className="itMenuModalLine col-md-auto"></div>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <Row className="tw-form-row loginRow">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <div className="itLoginSignUpButtonContainer d-flex justify-content-center">
                    <Link
                      className="itLoginSignUpButton tw-login-buttons btn btn-primary"
                      href="/register"
                    >
                      Бүртгэл үүсгэх
                    </Link>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="tw-form-row loginRow">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <ul className="itModalLoginListItems">
                    {/* <li className="itModalLoginListItem">
                                                <a href="#">Яагаад бүртгүүлэх ёстой вэ?</a>
                                            </li> */}
                    <li className="itModalLoginListItem">
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleReset();
                          setStep(parseInt(step) + 1);
                        }}
                      >
                        Нууц үгээ мартсан
                      </Link>
                    </li>
                  </ul>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        )}
        {step === 1 && (
          <Form className="tw-login-form" onSubmit={handleSubmitPhone}>
            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <Form.Control
                    required
                    name="phonenumber"
                    type="number"
                    className="itFormControl tw-input-no-arrow"
                    placeholder="Утасны дугаар"
                    onChange={(e) => {
                      const value = e.target.value;
                      setPhonenumber(value);
                    }}
                  />
                  <Form.Label className="itFormLabel">Утасны дугаар</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    Утасны дугаар
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <div className="itLoginSignUpButtonContainer d-flex justify-content-center">
                    <Button
                      className="itLoginSignUpButton tw-login-buttons"
                      type="submit"
                    >
                      Үргэлжлүүлэх
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <div className="itLoginButtonContainer d-flex justify-content-center">
                    <Link
                      className="itLoginButton tw-login-buttons btn btn-primary"
                      href="/login"
                    >
                      Буцах
                    </Link>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        )}
        {step === 2 && (
          <Form
            className="tw-login-form tw-login-verify-code"
            onSubmit={handleSubmitVerify}
          >
            <Row className="tw-form-row">
              <Col className="tw-form-col col-2">
                <Form.Group>
                  <Form.Control
                    onInput={maxLengthCheck}
                    maxLength={1}
                    required
                    name="verifyCode-1"
                    type="number"
                    className="itFormControl verifyCode tw-input-no-arrow"
                    onChange={(e) => {
                      const value = e.target.value;
                      setVerifyCode1(value);
                      inputNextFocus(e);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col className="tw-form-col col-2">
                <Form.Group>
                  <Form.Control
                    onInput={maxLengthCheck}
                    maxLength={1}
                    required
                    name="verifyCode-2"
                    type="number"
                    className="itFormControl verifyCode tw-input-no-arrow"
                    onChange={(e) => {
                      const value = e.target.value;
                      setVerifyCode2(value);
                      inputNextFocus(e);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col className="tw-form-col col-2">
                <Form.Group>
                  <Form.Control
                    onInput={maxLengthCheck}
                    maxLength={1}
                    required
                    name="verifyCode-3"
                    type="number"
                    className="itFormControl verifyCode tw-input-no-arrow"
                    onChange={(e) => {
                      const value = e.target.value;
                      setVerifyCode3(value);
                      inputNextFocus(e);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col className="tw-form-col col-2">
                <Form.Group>
                  <Form.Control
                    onInput={maxLengthCheck}
                    maxLength={1}
                    required
                    name="verifyCode-4"
                    type="number"
                    className="itFormControl verifyCode tw-input-no-arrow"
                    onChange={(e) => {
                      const value = e.target.value;
                      setVerifyCode4(value);
                      inputNextFocus(e);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col className="tw-form-col col-2">
                <Form.Group>
                  <Form.Control
                    onInput={maxLengthCheck}
                    maxLength={1}
                    required
                    name="verifyCode-5"
                    type="number"
                    className="itFormControl verifyCode tw-input-no-arrow"
                    onChange={(e) => {
                      const value = e.target.value;
                      setVerifyCode5(value);
                      inputNextFocus(e);
                    }}
                  />
                </Form.Group>
              </Col>
              <Col className="tw-form-col col-2">
                <Form.Group>
                  <Form.Control
                    onInput={maxLengthCheck}
                    maxLength={1}
                    required
                    name="verifyCode-6"
                    type="number"
                    className="itFormControl verifyCode tw-input-no-arrow"
                    onChange={(e) => {
                      const value = e.target.value;
                      setVerifyCode6(value);
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <div className="itLoginSignUpButtonContainer d-flex justify-content-center">
                    <Button
                      className="itLoginSignUpButton tw-login-buttons"
                      type="submit"
                    >
                      Үргэлжлүүлэх
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <div className="itLoginButtonContainer d-flex justify-content-center">
                    <Link
                      className="itLoginButton tw-login-buttons btn btn-primary"
                      href="#"
                      onClick={handleStepPrev}
                    >
                      Буцах
                    </Link>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        )}
        {step === 3 && (
          <Form
            className="tw-login-form tw-login-verify-code"
            onSubmit={handleSubmitNewpass}
          >
            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <Form.Control
                    required
                    name="NewPassword"
                    type="password"
                    className="itFormControl"
                    placeholder="Шинэ нууц үг"
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewPassword(value);
                    }}
                  />
                  <Form.Label className="itFormLabel">Шинэ нууц үг</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    Шинэ нууц үг
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <Form.Control
                    required
                    name="ConfirmPassword"
                    type="password"
                    className="itFormControl"
                    placeholder="Нууц үг давтах"
                    onChange={(e) => {
                      const value = e.target.value;
                      setConfirmPassword(value);
                    }}
                  />
                  <Form.Label className="itFormLabel">
                    Нууц үг давтах
                  </Form.Label>
                  <Form.Control.Feedback type="invalid">
                    Нууц үг давтах
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <div className="itLoginSignUpButtonContainer d-flex justify-content-center">
                    <Button
                      className="itLoginSignUpButton tw-login-buttons"
                      type="submit"
                    >
                      Үргэлжлүүлэх
                    </Button>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row className="tw-form-row">
              <Col className="tw-form-col" lg={12}>
                <Form.Group>
                  <div className="itLoginButtonContainer d-flex justify-content-center">
                    <Link
                      className="itLoginButton tw-login-buttons btn btn-primary"
                      href="#"
                      onClick={handleStepPrev}
                    >
                      Буцах
                    </Link>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        )}
      </RenderElementWrapper>
    );
  }
};

export default TwLogin;
