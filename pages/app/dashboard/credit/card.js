import React, { useState, useRef } from 'react';
import Sidebar from 'components/sidebar/control';
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import Topbar from 'components/topbar';
import FormData from 'form-data';
import SignatureCanvas from 'react-signature-canvas';
import axios from 'axios';
import useTranslation from 'next-translate/useTranslation';

const CreditNoClient = (props) => {
  let sigPad = useRef({});

  const [show, setShow] = useState(false);
  const [error, setErorr] = useState(false);
  const [errorinfo, setErrorInfo] = useState(false);
  const [front, setFrontImg] = useState('');
  const [back, setBackImg] = useState('');
  const [selfie, setSelfieImg] = useState('');
  const fData = new FormData();
  const { t } = useTranslation('card');

  const setPhotoFront = (event) => {
    if (event.target.files[0].size <= 8000000) {
      setFrontImg(event.target.files[0]);
      setErorr(false);
    } else {
      setErorr(true);
      setErrorInfo('8mb бага хэмжээтэй зураг сонгоно уу.');
    }
  };

  const setPhotoBack = (event) => {
    if (event.target.files[0].size <= 8000000) {
      setBackImg(event.target.files[0]);
      setErorr(false);
    } else {
      setErorr(true);
      setErrorInfo('8mb бага хэмжээтэй зураг сонгоно уу.');
    }
  };

  const setPhotoSelfie = (event) => {
    if (event.target.files[0].size <= 8000000) {
      setSelfieImg(event.target.files[0]);
      setErorr(false);
    } else {
      setErorr(true);
      setErrorInfo('8mb бага хэмжээтэй зураг сонгоно уу.');
    }
  };

  const sendPhoto = () => {
    const fData = new FormData();
    fData.append('front', front);
    fData.append('back', back);
    fData.append('selfie', selfie);

    if (sigPad.current.toData().length !== 0) {
      fData.append('signature', sigPad.current.toDataURL('image/png'));
    }

    axios.post(`/api/online/send`, fData).then(
      (resp) => {},
      (error) => {}
    );
  };
  function clear() {
    sigPad.current.clear();
  }

  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col lg={10} className="dashboard-right-side">
          <Row>
            <Col className="p-0" style={{ borderBottom: '1px solid #E8EDF5' }}>
              <Topbar
                name={t('loan-service')}
                logo="/icon-card-dashboard.svg"
              />
            </Col>
          </Row>
          <Row className="wrapper-row">
            <div
              style={{
                padding: '32px 0 40px 0',
                maxWidth: '768px',
                margin: 'auto',
              }}
            >
              <Row>
                <div className="card-big-div">
                  <div className="national-card-header">
                    <h5 className="title">{t('card-info')}</h5>
                    <span className="lil-title">{t('pls-correct')}</span>
                  </div>
                  <div className="image-insert-section">
                    <Row>
                      <Col xs={12} lg={6}>
                        <div className="image-insert-inner">
                          <span className="national-card-desc">
                            {t('id-front')}
                          </span>
                          <img
                            className="national-card-image"
                            src={
                              front
                                ? URL.createObjectURL(front)
                                : '/mn-id-card-front.png'
                            }
                          />
                          <div className="insert-button">
                            <div className="tw-user-change">
                              <Form.Label>
                                {t('up-photo')}
                                <Form.Control
                                  style={{
                                    visibility: 'hidden',
                                  }}
                                  onChange={(e) => setPhotoFront(e)}
                                  type="file"
                                  accept="image/*"
                                  className="custom-file-input"
                                />
                              </Form.Label>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} lg={6}>
                        <div className="image-insert-inner">
                          <span className="national-card-desc">
                            {t('id-back')}
                          </span>
                          <img
                            className="national-card-image"
                            src={
                              back
                                ? URL.createObjectURL(back)
                                : '/mn-id-card-back.png'
                            }
                          />
                          <div className="insert-button">
                            <div className="tw-user-change">
                              <Form.Label>
                                {t('up-photo')}
                                <Form.Control
                                  style={{
                                    visibility: 'hidden',
                                  }}
                                  onChange={(e) => setPhotoBack(e)}
                                  type="file"
                                  accept="image/*"
                                  className="custom-file-input"
                                />
                              </Form.Label>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div className="credit-selfie-wrapper">
                    <div className="selfie-header">
                      <h5>{t('up-selfie')}</h5>
                      <p>{t('pls-correct')}</p>
                    </div>
                    <div className="selfie-contain">
                      <div className="selfie-body">
                        <div className="body-image">
                          <img
                            src={
                              selfie
                                ? URL.createObjectURL(selfie)
                                : '/selfie-vector.svg'
                            }
                          />
                        </div>
                      </div>
                      <div className="">
                        <div className="image-insert-inner">
                          <div className="insert-button">
                            <div className="tw-user-change">
                              <Form.Label>
                                {t('up-photo')}
                                <Form.Control
                                  style={{
                                    visibility: 'hidden',
                                  }}
                                  onChange={(e) => setPhotoSelfie(e)}
                                  type="file"
                                  accept="image/*"
                                  className="custom-file-input"
                                />
                              </Form.Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="signature-section">
                    <div>
                      <div className="signature-top">
                        <span className="signature-title">
                          {t('signature')}
                        </span>
                        <Button className="signature-button" onClick={clear}>
                          {t('clear')}
                        </Button>
                      </div>
                      <div className="personal-signature">
                        <SignatureCanvas
                          penColor="#161E34"
                          ref={sigPad}
                          canvasProps={{
                            width: '100%',
                            height: 158,
                            className: 'sigCanvas',
                          }}
                        />
                      </div>
                      <div className="introduction-section">
                        <strong className="warning">{t('note')}:</strong>
                        <span>{t('desc')}</span>
                        <div className="tw-single-button">
                          <Button
                            type="submit"
                            variant="primary"
                            onClick={() => sendPhoto()}
                          >
                            {t('Cont')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default CreditNoClient;
