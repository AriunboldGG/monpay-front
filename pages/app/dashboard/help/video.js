import Sidebar from 'components/sidebar/control';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import SidebarContract from 'components/sidebar/contract';
import ReactPlayer from 'react-player';
import Topbar from 'components/topbar';
import useTranslation from 'next-translate/useTranslation';

const Question = (props) => {
  const { t } = useTranslation('common');

  return (
    <Container fluid>
      <Row>
        <Col className="g-0">
          <Sidebar />
        </Col>
        <Col lg={10} className="dashboard-right-side">
          <Row>
            <Col style={{ borderBottom: '1px solid #E8EDF5' }} className="p-0">
              <Topbar name="Тусламж" logo="/icon-info-topbar.svg" />
            </Col>
          </Row>
          <Row className="wrapper-row app-contract">
            <div
              style={{
                maxWidth: '1032px',
                margin: 'auto',
                padding: '0',
              }}
            >
              <Row>
                <Col xs={12} lg={3}>
                  <div className="accountContainerLeft">
                    <SidebarContract />
                  </div>
                </Col>
                <Col xs={12} lg={9}>
                  <Row className="tw-question-second-row">
                    <div className="question-bottom">
                      <div className="question-title">
                        <h4>{t('helpful-vid')}</h4>
                      </div>
                      <div className="tw-question-accordion">
                        <Row className="tw-guide-video">
                          <Col
                            className="tw-guide-video-col-left"
                            lg={6}
                            md={6}
                            xs={12}
                          >
                            <div className="tw-video-thumb">
                              <div className="tw-video-thumb-img">
                                <div className="tw-video-thumb-icon">
                                  <ReactPlayer
                                    url="https://www.youtube.com/watch?v=KyxuL72ER_M"
                                    width="100%"
                                    height="189px"
                                    playIcon={<img src="/icon-play-btn.svg" />}
                                  />
                                </div>
                              </div>
                              <div className="tw-video-thumb-title">
                                <h4>
                                  MonPay Мессенжер - Бүтээгдэхүүн борлуулах
                                </h4>
                              </div>
                            </div>
                            <div className="tw-video-thumb">
                              <div className="tw-video-thumb-img">
                                <div className="tw-video-thumb-icon">
                                  <ReactPlayer
                                    url="https://www.youtube.com/watch?v=nchpqBnnAa4"
                                    width="100%"
                                    height="189px"
                                    playIcon={<img src="/icon-play-btn.svg" />}
                                  />
                                </div>
                              </div>
                              <div className="tw-video-thumb-title">
                                <h4>MonPay Мессенжер - Шилжүүлэг</h4>
                              </div>
                            </div>
                            <div className="tw-video-thumb">
                              <div className="tw-video-thumb-img">
                                <div className="tw-video-thumb-icon">
                                  <ReactPlayer
                                    url="https://www.youtube.com/watch?v=TrKRTkc1BRg"
                                    width="100%"
                                    height="189px"
                                    playIcon={<img src="/icon-play-btn.svg" />}
                                  />
                                </div>
                              </div>
                              <div className="tw-video-thumb-title">
                                <h4>MonPay Мессенжер - Нэхэмжлэх</h4>
                              </div>
                            </div>
                          </Col>
                          <Col
                            className="tw-guide-video-col-right"
                            lg={6}
                            md={6}
                            xs={12}
                          >
                            <div className="tw-video-thumb">
                              <div className="tw-video-thumb-img">
                                <div className="tw-video-thumb-icon">
                                  <ReactPlayer
                                    url="https://www.youtube.com/watch?v=iTtNMgVNwVY"
                                    width="100%"
                                    height="189px"
                                    playIcon={<img src="/icon-play-btn.svg" />}
                                  />
                                </div>
                              </div>
                              <div className="tw-video-thumb-title">
                                <h4>MonPay Мессенжер - Төлбөр хуваах</h4>
                              </div>
                            </div>
                            <div className="tw-video-thumb">
                              <div className="tw-video-thumb-img">
                                <div className="tw-video-thumb-icon">
                                  <ReactPlayer
                                    url="https://www.youtube.com/watch?v=mTZCkA-Dg1c"
                                    width="100%"
                                    height="189px"
                                    playIcon={<img src="/icon-play-btn.svg" />}
                                  />
                                </div>
                              </div>
                              <div className="tw-video-thumb-title">
                                <h4>Emart MonPay-д нэгдлээ.</h4>
                              </div>
                            </div>
                            <div className="tw-video-thumb">
                              <div className="tw-video-thumb-img">
                                <div className="tw-video-thumb-icon">
                                  <ReactPlayer
                                    url="https://www.youtube.com/watch?v=syqnjIMLkj4"
                                    width="100%"
                                    height="189px"
                                    playIcon={<img src="/icon-play-btn.svg" />}
                                  />
                                </div>
                              </div>
                              <div className="tw-video-thumb-title">
                                <h4>
                                  MonPay апликейшнаар хэрэгцээний зээл авахад
                                  хурдан бас хялбар
                                </h4>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Row>
                </Col>
              </Row>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default Question;
