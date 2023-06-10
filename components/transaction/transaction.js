import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const TransHistory = (props) => {
  const [graphicProducts, setGraphicProducts] = useState([]);
  const [banners, setBanner] = useState([]);
  const router = useRouter();
  const { t } = useTranslation('dashboard');
  let dayjs = require('dayjs');
  var relativeTime = require('dayjs/plugin/relativeTime');
  dayjs.extend(relativeTime);

  useEffect(() => {
    if (props.dataTemp) {
    } else {
      fetchData();
    }
  }, []);
  async function fetchData() {
    const params = {
      limit: 3,
      beginDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
    };

    axios.get(`/api/sales/total`, { params: params }).then(
      (resp) => {
        setGraphicProducts(resp.data.result ?? []);
      },
      (error) => {}
    );

    axios.get(`/api/banner/get-banner`).then(
      (resp) => {
        setBanner(resp.data);
      },
      (error) => {}
    );
  }
  const handleSubmit = () => {
    router.push(`/app/dashboard/transaction-history`);
  };

  return (
    <Row style={{ marginBottom: '32px' }}>
      <Col lg={9}>
        <div className="trans-history">
          <div className="top-side">
            <h5>{t('payment-history')}</h5>
            <a onClick={handleSubmit}>{t('read-more')}</a>
          </div>
          {graphicProducts.map((contItem, i) => (
            <div className="content" key={i}>
              <div className="content-item">
                <div className="content-left">
                  <h5 className="title">{contItem.description}</h5>
                  <span>{contItem.dateUI}</span>
                </div>
                <div className="content-right">
                  <div className="right-inner">
                    <h5 className="title">{contItem.amountUI}</h5>
                  </div>
                  <div className="image-waiting">
                    <img src="/trans-icon-payment.svg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Col>
      <Col lg={3}>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          className="mySwiper"
        >
          {banners &&
            banners.map((banner) => {
              return (
                <div key={banner.id} className="trans-slider">
                  <SwiperSlide>
                    <img src={banner.featured_image} />
                  </SwiperSlide>
                </div>
              );
            })}
        </Swiper>
      </Col>
    </Row>
  );
};

export default TransHistory;
