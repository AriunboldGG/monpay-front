import { useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Header from 'components/header/Header';
import Footer from 'components/Footer';
import Layout from 'components/Layout';
import { Container, Row, Col } from 'react-bootstrap';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from 'react-share';
import axios from 'axios';
import NotFound from 'components/NotFound';
import { useIct } from 'hooks/use-ict';
import { ictApiGetBaseData, ictApiWPGetPost } from 'lib/Api';
import Link from 'next/link';

//News single код
const Page = (props) => {
  const { site, router, page, themeOption, menu, post_type, newsSingle } =
    props;
  const { t, lang } = useTranslation('common');
  const { ictCtx, setIctCtx } = useIct();
  const [newsCategory, setNewsCategory] = useState([]);
  let is404 = true;
  useEffect(async () => {
    try {
      const respCats = await axios(`/api/post/get-category`);

      if (respCats?.data?.length) {
        setNewsCategory(respCats.data);
      }
    } catch (e) {}
  }, []);
  useEffect(() => {
    setIctCtx({
      ...ictCtx,
      paged: props.paged ? props.paged : 1,
      filters: props.filters ? props.filters : {},
      path: props.path ? props.path : '',
      themeOption: themeOption ? themeOption : {},
    });
  }, [props?.paged, props?.filters, props?.path]);

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
  let lang_link = {
    has_translation: true,
    post_type: 'page',
    id: 0,
  };

  if (newsSingle?.headline && newsSingle?.contentImg) {
    pageSlug = '';
    is404 = false;
    // lang_link = page.lang_link;
    //wordpress yoast-s damjuulj bui utgig api-s shuud irsen utgaar replace хийж буй мөр код
    yoastMeta.push({
      property: 'og:title',
      content: newsSingle.headline,
    });
    yoastMeta.push({
      property: 'og:image',
      content: newsSingle.contentImg,
    });
  }
  if (is404) {
    return <NotFound key="page-not-found" />;
  }

  const layoutSlug = 'monpay-single-partner';

  return (
    <Layout title={newsSingle.headline} slug={layoutSlug} yoastMeta={yoastMeta}>
      <Header
        themeOption={themeOption}
        menuTopBar={themeOption.header_topbar_menu}
        menu={menu}
      />
      <Container>
        <Row className="mp-partner-single-breadcrumb mp-left">
          <Col md={8} sm={12} className="mp-partner-single-column">
            {/* <div className="mp-partner-single-breadcrumb"> */}
            <div className="mp-link-css">
              <Link href="/" className="mp-partner-single-breadcrumb-home">
                {t('title')}
              </Link>
              <img src="/icon-right-arrow.svg" />
            </div>
            <div className="mp-link-css">
              <Link href="/news" className="mp-partner-single-breadcrumb-home">
                {t('breadNews')}
              </Link>
              <img src="/icon-right-arrow.svg" />
            </div>
            <div>
              <span className="mp-partner-single-breadcrumb-partnerNameLat">
                {newsCategory &&
                  newsCategory.map((itemCat, i) => {
                    if (newsSingle.newsCatId === itemCat.id) {
                      return (
                        <span className="cats" key={i}>
                          {itemCat.nameMn}
                        </span>
                      );
                    }
                  })}
              </span>
            </div>
            {/* </div> */}
          </Col>
          <Col md={4}></Col>
        </Row>
      </Container>
      <div>
        <Container>
          <Row>
            <Col className="mp-single-main-col">
              {(newsSingle?.contentImg ||
                newsSingle?.headline ||
                newsSingle?.createDateUI ||
                newsSingle?.notifyContent) && (
                <div>
                  <h3 className="tw-single-main-title">
                    {newsSingle?.headline}
                  </h3>
                  <div className="tw-single-category">
                    <span className="tw-publish-date">
                      {newsSingle?.createDateUI}
                      <span className="tw-publish-dot">.</span>
                    </span>
                    <span className="tw-publish-category">
                      {newsCategory &&
                        newsCategory.map((itemCat, i) => {
                          if (newsSingle.newsCatId === itemCat.id) {
                            return (
                              <span className="cats" key={i}>
                                {itemCat.nameMn}
                              </span>
                            );
                          }
                        })}
                    </span>
                  </div>
                  {/* <img src={newsSingle?.contentImg} /> */}
                  <div className="tw-single-container">
                    {newsSingle?.content && (
                      <div
                        className="content"
                        dangerouslySetInnerHTML={{
                          __html: '<p>' + newsSingle?.content + '</p>',
                        }}
                      ></div>
                    )}
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
        <Container>
          <Row>
            {(ictCtx || ictCtx.path) && (
              <Col>
                <div className="entry-share">
                  <div className="entry-share-medee">
                    <span className="entry-share-medee-span">
                      Мэдээг бусдадтай хуваалцах
                    </span>
                  </div>
                  <div className="entry-share-medee-icons">
                    <span className="entry-share-item-share-facebook">
                      <FacebookShareButton
                        url={
                          process.env.NEXT_PUBLIC_SITE_URL +
                          '/post/' +
                          newsSingle?.newsId
                        }
                        className="entry-share-item-share-facebook"
                      >
                        <img src="/fbicon-facebook.svg" />
                      </FacebookShareButton>
                    </span>
                    <span className="entry-share-item-share-linkedin">
                      <LinkedinShareButton
                        url={
                          process.env.NEXT_PUBLIC_SITE_URL +
                          '/post/' +
                          newsSingle?.newsId
                        }
                        className="entry-share-item-share-linkedin"
                      >
                        <img src="/linkicon-linkedin.svg" />
                      </LinkedinShareButton>
                    </span>
                    <span className="entry-share-item-share-twitter">
                      <TwitterShareButton
                        url={
                          process.env.NEXT_PUBLIC_SITE_URL +
                          '/post/' +
                          newsSingle?.newsId
                        }
                        via={'MonpayOfficial'}
                        title={newsSingle?.headline}
                        imageURL={newsSingle?.backgroundImg}
                        className="entry-share-item-share-twitter"
                      >
                        <img src="/twicon-twitter.svg" />
                      </TwitterShareButton>
                    </span>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </div>

      <Footer themeOption={themeOption} site={site} />
    </Layout>
  );
};

export default withRouter(Page);

export async function getStaticProps({ params, locale }) {
  let props = {
    menu: {},
    // path,
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

  if (params?.id && !isNaN(params.id)) {
    try {
      const respNewsSingle = await axios(
        `${process.env.MONPAY_API_URL}/news/${params.id}`
      );
      if (respNewsSingle?.data?.result) {
        props.newsSingle = respNewsSingle.data.result;
      }
    } catch (e) {}
  }
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
  allData.map(async (data) => {
    // const respNewsSingle = await axios(
    //     `${process.env.MONPAY_API_URL}/news/${data.partnerId}`
    // );
    // if (respNewsSingle?.data?.result) {
    //     allId.push({ params: { id: data.partnerId?.toString() } });
    // }
  });

  async function fetcher(offset) {
    return await axios.get(
      `${process.env.MONPAY_API_URL}/news?limit=50&pagingStart=-1&includeTotal=true&offset=${offset}`
    );
  }
  async function handleError(error) {
    Error(error.response ? error.response.status : 500);
  }

  let paths = [{ params: { id: '' } }];
  return {
    paths: allId,
    fallback: 'blocking',
  };
}
