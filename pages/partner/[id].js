import { useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Header from 'components/header/Header';
import Footer from 'components/Footer';
import Layout from 'components/Layout';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import GoogleMapMonpay from 'components/google-map/google-map';

import { useIct } from 'hooks/use-ict';
import { ictApiGetBaseData } from 'lib/Api';
import Link from 'next/link';

const Page = (props) => {
  const { site, router, page, themeOption, menu } = props;
  const { t, lang } = useTranslation('common');
  const { id } = router.query;
  //Back-s partnerin utga damjuulj bui heseh
  const { ictCtx, setIctCtx } = useIct();
  const [partnerSingle, setPartnerSingle] = useState({});
  const [partnersSame, setPartnersSame] = useState([]);

  const [partnerCatsSingle, setPartnerCatsSingle] = useState([]);
  const [partnerSingleBranchAddress, setpartnerSingleBranchAddress] = useState(
    []
  );
  const [BranchDescription, setBranchDescription] = useState([]);
  const [partnerNameLat, setPartnerNameLat] = useState([]);
  const [partnerImg, setPartnerImg] = useState([]);
  useEffect(() => {
    setIctCtx({
      ...ictCtx,
      paged: props.paged ? props.paged : 1,
      filters: props.filters ? props.filters : {},
      path: props.path ? props.path : '',
      themeOption: themeOption ? themeOption : {},
    });
  }, [props?.paged, props?.filters, props?.path]);

  useEffect(() => {
    categoryProduct();

    singleData();
  }, [id]);

  const singleData = () => {
    /* Partner Categories */

    const body = {
      Id: router.query.id,
    };
    axios.post(`/api/partner/single`, body).then(
      (resp) => {
        CLickFunction(resp.data[0].partnerCategoryId);

        setPartnerSingle(resp.data);

        setpartnerSingleBranchAddress(resp.data[0].branchList[0].address);

        setBranchDescription(resp.data[0].branchList[0].description);
        setPartnerNameLat(resp.data[0].partnerNameLat);
        setPartnerImg(resp.data[0].partnerImg);
      },
      (error) => {}
    );
    /* Partner Single */
  };
  const categoryProduct = () => {
    axios.post('/api/partner/categories').then(
      (resp) => {
        setPartnerCatsSingle(resp.data);
      },
      (error) => {}
    );
  };
  const CLickFunction = (value) => {
    const body = {
      limit: 3,
      partnerCategoryId: value,
    };
    axios.post('/api/partner/get-partner-same', body).then(
      (resp) => {
        setPartnersSame(resp.data);
      },
      (error) => {}
    );
  };
  // building
  if (router.isFallback) {
    return (
      <div className="ict-preloader">
        <div className="preloader">
          {router.locale === 'en'
            ? 'Please Wait ...'
            : router.locale === 'ru'
            ? 'Пожалуйста, подождите ...'
            : 'Түр хүлээнэ үү ...'}
        </div>
      </div>
    );
  }
  // Page initial datas
  let yoastTitle = t('page-not-found');
  let yoastMeta = [];
  let pageSlug = '404';
  let is404 = true;
  let lang_link = {
    has_translation: true,
    post_type: 'page',
    id: 0,
  };
  let titlePartner = partnerNameLat;
  if (page && page.yoast_title) {
    yoastMeta = page.yoast_meta;
    yoastTitle = page.yoast_title;
    pageSlug = page.slug;
    is404 = false;
    lang_link = page.lang_link;
  } else {
    titlePartner;
  }
  const layoutSlug = 'monpay-single-partner';

  return (
    <Layout title={titlePartner} slug={layoutSlug} yoastMeta={yoastMeta}>
      <Header
        themeOption={themeOption}
        menuTopBar={themeOption.header_topbar_menu}
        menu={menu}
      />
      <Container>
        <Row className="mp-partner-single-breadcrumb mp-left">
          <Col md={8} sm={12} className="mp-partner-single-column">
            <div className="mp-link-css">
              <Link href="/" className="mp-partner-single-breadcrumb-home">
                {t('title')}
              </Link>
              <img src="/icon-right-arrow.svg" />
            </div>
            <div className="mp-link-css">
              <Link
                href="/partners"
                className="mp-partner-single-breadcrumb-home"
              >
                {t('partner')}
              </Link>
              <img src="/icon-right-arrow.svg" />
            </div>
            <div>
              <span className="mp-partner-single-breadcrumb-partnerNameLat">
                {partnerNameLat}
              </span>
            </div>
          </Col>
          <Col md={4}></Col>
        </Row>
      </Container>

      <Container>
        <Row className="mp-partner-single-title-row">
          <div className="mp-partner-single-title">{partnerNameLat}</div>
        </Row>
      </Container>
      <Container>
        <div>
          <Row className="tw-partner-single">
            <Col className="single-big-content" md={8}>
              <Row>
                <Col
                  className="tw-partner-single-image"
                  md={2}
                  sm={12}
                  // lg={2}
                >
                  <div>
                    <img src={partnerImg} />
                  </div>
                </Col>
                <Col
                  className="tw-partner-single-content"
                  md={8}
                  sm={12}
                  // md={10}
                  // lg={10}
                >
                  <div>
                    <span className="tw-partner-single-main-title">
                      {t('tovch')}
                    </span>
                    <span className="tw-partner-single-desc">
                      {partnerSingleBranchAddress}
                    </span>
                  </div>

                  {(partnerSingle?.partnerNameLat ||
                    partnerSingle?.phone ||
                    partnerSingle?.email) && (
                    <Row className="tw-partner-information">
                      {partnerSingle?.partnerNameLat && (
                        <Col className="single-web col-3" sm={12} md={3}>
                          <img src="/link1.svg" />
                          <Link href="#">
                            <span>{partnerSingle?.partnerNameLat}</span>
                          </Link>
                        </Col>
                      )}
                      {partnerSingle?.phone && (
                        <Col className="single-phone col-3" sm={12} md={3}>
                          <img src="/icon-call.svg" />
                          <span>{partnerSingle?.phone}</span>
                        </Col>
                      )}
                      {partnerSingle?.email && (
                        <Col className="single-mail col-6" sm={12} md={6}>
                          <img src="/icon-send.svg" />
                          <span>{partnerSingle?.email}</span>
                        </Col>
                      )}
                    </Row>
                  )}
                </Col>
              </Row>
              <Row className="tw-partner-single-content-2">
                <Col className="p-0">
                  <div>
                    <span
                      className="tw-partner-single-desc-page"
                      dangerouslySetInnerHTML={{
                        __html: BranchDescription,
                      }}
                    ></span>
                  </div>
                  <div className="tw-google-map">
                    <div className="tw-google-address">{t('locationInfo')}</div>
                    <GoogleMapMonpay />
                  </div>
                  <div>
                    <span className="single-related-title">
                      {t('samePartner')}
                    </span>
                  </div>
                  <Row>
                    {partnersSame.map((itemSame, i) => {
                      return (
                        <Col sm={12} className="single-related-posts" key={i}>
                          <a href={`/partner/${itemSame.partnerId}`} key={i}>
                            <div className="post-content-partner p-0">
                              <div className="post-content-partner-inner">
                                <img
                                  className="content-image"
                                  src={itemSame.partnerImg}
                                />
                                <div className="post-title-partner">
                                  {itemSame.partnerNameLat}
                                </div>
                                <div
                                  className="post-desc-partner"
                                  dangerouslySetInnerHTML={{
                                    __html: itemSame.description,
                                  }}
                                />
                                <div className="post-link-partner">
                                  <img src="/icon-arrow-rightt.svg" />
                                </div>
                              </div>
                            </div>
                          </a>
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col className="partner-border" md={1}></Col>
            <Col md={3}>
              <div className="widget-title">
                <span className="title-partner">
                  {t('partnerOrganizations')}
                </span>
              </div>
              {partnerCatsSingle.map((itemCat, i) => (
                <div className="sub-menu" key={i}>
                  <span className="widget-menu-item">
                    {itemCat.categoryName}
                  </span>
                  <span className="cat-count">{itemCat.partnerCount}</span>
                </div>
              ))}
              <div className="partner-single-menu-bottom">
                <div className="image">
                  <img src="/monpay-white-logo.svg" />
                </div>
                <span className="description">{t('request')}</span>
                <div className="tw-menu-button">
                  <div className="tw-menu-button-inner">
                    <Link href={`mailto: Merchantservice@mobicom.mn`}>
                      {t('sendRequest')}
                    </Link>
                  </div>
                </div>
                <div className="tw-menu-apps">
                  <div className="tw-menu-item">
                    <Link href="https://itunes.apple.com/us/app/candy-pay/id978594162">
                      <img src="/icon-appstoree.svg" />
                    </Link>
                    <Link href="https://play.google.com/store/apps/details?id=mn.mobicom.candy">
                      <img src="/icon-appgalleryy.svg" />
                    </Link>
                    <Link href="https://appgallery.huawei.com/#/app/C102637533?sharePrepath=ag&locale=en_US&source=appshare&subsource=C102637533">
                      <img src="/icon-huaweii.svg" />
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
      <Footer themeOption={themeOption} site={site} />
    </Layout>
  );
};

export default withRouter(Page);

export async function getStaticProps({ params, locale }) {
  let props = {
    menu: {},
  };

  const apiGetBaseDataResult = await ictApiGetBaseData({
    lang: locale,
  });

  props.menu.main =
    apiGetBaseDataResult && apiGetBaseDataResult.menuMain
      ? apiGetBaseDataResult.menuMain
      : {};
  props.themeOption =
    apiGetBaseDataResult && apiGetBaseDataResult.themeOption
      ? apiGetBaseDataResult.themeOption
      : {};

  return {
    props,
    revalidate: 60 * 10, // In seconds
  };
}

export async function getStaticPaths() {
  let allData = [];
  let total = 0;
  const firstResp = await fetcher(0).catch((error) => handleError(error));
  total = firstResp?.data.total;
  allData = [...firstResp?.data.result];
  if (total > 50) {
    const pages = Math.floor(total / 50);
    for (let i = 1; i <= pages; i++) {
      const resp = await fetcher(i * 50).catch((error) => handleError(error));
      allData = [...allData, ...resp.data.result];
    }
  }

  const allId = [];
  allData.map((data) =>
    allId.push({ params: { id: data.partnerId?.toString() } })
  );

  async function fetcher(offset) {
    return await axios.get(
      `${process.env.MONPAY_API_URL}/partners?limit=50&pagingStart=-1&includeTotal=true&offset=${offset}`
    );
  }
  async function handleError(error) {
    Error(error.response ? error.response.status : 500);
  }

  let paths = [{ params: { id: '' } }];
  // let paths = [{ params: { id: 1 } }, { params: { id: 2 } }];
  // let paths = [{ params: { id: '' }, locale: 'mn' }];
  return {
    paths: allId,
    fallback: 'blocking',
  };
}
