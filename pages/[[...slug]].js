import { useEffect } from 'react';
import { withRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import RenderPostType from 'components/postTypes/RenderPostType';
import NotFound from 'components/NotFound';
import Header from 'components/header/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';
import Layout from 'components/Layout';
import IctRedirect from 'components/IctRedirect';
import PageTitle from 'components/title/PageTitle';

import { useIct } from 'hooks/use-ict';
import { ictApiGetBaseData, ictApiWPGetPost } from 'lib/Api';

const Page = (props) => {
  const { site, router, page, themeOption, menu, post_type } = props;
  const { t, lang } = useTranslation('common');

  const { ictCtx, setIctCtx } = useIct();

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
  let is404 = true;
  let lang_link = {
    has_translation: true,
    post_type: 'page',
    id: 0,
  };

  if (page && page.yoast_title) {
    yoastMeta = page.yoast_meta;
    yoastTitle = page.yoast_title;
    pageSlug = page.slug;
    is404 = false;
    lang_link = page.lang_link;
  }

  // Page additional datas
  let sectionMain = [];
  const layoutSlug = (post_type == 'page' ? '' : 'monpay-single ') + pageSlug;

  if (is404) {
    sectionMain.push(<NotFound key="page-not-found" />);
  } else {
    if (
      page.acf.modal === 'enable' &&
      page.acf.modal_content &&
      page.acf.modal_content.length
    ) {
      // sectionMain.push( <PageModal key='page-modal' modalContent={page.acf.modal_content} /> );
      sectionMain.push(
        <style
          key="page-modal-style"
          dangerouslySetInnerHTML={{ __html: page.acf.custom_style }}
        ></style>
      );
    }
    if (page.title && page.title && page.slug && page.acf) {
      sectionMain.push(
        <PageTitle
          key="page-title"
          title={page.title}
          slug={page.slug}
          acf={page.acf}
          breadcrumbList={page.breadcrumb_list}
        />
      );
    }
    if (
      page.acf.page_submenu &&
      page.acf.page_submenu.menu &&
      page.acf.page_submenu.menu.length
    ) {
      // sectionMain.push(
      //     <PageSubmenu
      //         key="page-submenu"
      //         submenu={page.acf.page_submenu.menu}
      //     />
      // );
    }
    if (post_type === 'page') {
      if (page.acf && page.acf.page_redirect) {
        sectionMain.push(
          <IctRedirect key="page-redirect" link={page.acf.page_redirect} />
        );
      } else if (page.content) {
        sectionMain.push(
          <Content
            key="page-content"
            themeOption={themeOption}
            content={page.content}
          />
        );
      }
    } else {
      sectionMain.push(<RenderPostType key="post-type-content" {...props} />);
    }

    /* Page, Single ... */
    if (page.custom_style) {
      sectionMain.push(
        <style
          key="page-style"
          dangerouslySetInnerHTML={{ __html: page.custom_style }}
        ></style>
      );
    }
  }

  return (
    <Layout title={yoastTitle} slug={layoutSlug} yoastMeta={yoastMeta}>
      <Header
        themeOption={themeOption}
        menuTopBar={themeOption.header_topbar_menu}
        menu={menu}
      />
      {sectionMain}
      <Footer themeOption={themeOption} site={site} />
    </Layout>
  );
};

export default withRouter(Page);

export async function getStaticProps({ params, locale, defaultLocale }) {
  const slug = params && params.slug ? params.slug : [];

  let parent_1 = '';
  let parent_2 = '';
  let value = '';
  let post_type = 'page';
  let isPaged = false;
  let paged = 1;
  let isFilter = false;
  let filter = [];
  let path = '';
  let site = 'main';
  slug.map((item, i) => {
    /////////////////////////
    if (item === 'filter') {
      isFilter = true;
      isPaged = false;
    } else if (item === 'paged') {
      isPaged = true;
      isFilter = false;
    } else if (isPaged) {
      if (!isNaN(item)) {
        paged = parseInt(item, 10);
      }
    } else if (isFilter) {
      filter.push(item);
    } else {
      if (parent_2) {
        parent_1 = parent_2;
      }
      if (value) {
        parent_2 = value;
      }
      value = item;

      path += (path ? '/' : '') + item;
    }
  });

  if (!value) {
    value = 'home';
  }

  if (!isNaN(value) && parent_2) {
    post_type = parent_2 == 'news' ? 'post' : parent_2;
  }

  let props = {
    site,
    post_type,
    parent_1,
    parent_2,
    menu: {},
    path,
  };

  const apiGetBaseDataResult = await ictApiGetBaseData({
    lang: locale,
    site,
  });

  props.menu.main =
    apiGetBaseDataResult && apiGetBaseDataResult.menuMain
      ? apiGetBaseDataResult.menuMain
      : {};
  props.themeOption =
    apiGetBaseDataResult && apiGetBaseDataResult.themeOption
      ? apiGetBaseDataResult.themeOption
      : {};

  let api = post_type + 's/';
  let apiParams = { lang: locale };

  if (post_type === 'page') {
    apiParams.slug = value;
  } else {
    api += value;
  }

  // Paged
  props.paged = paged;
  if (paged > 1) {
    apiParams.paged = paged;
  }

  // Filter
  props.filters = {};
  for (let i = 0; i < filter.length; i += 2) {
    if (filter[i] && filter[i + 1]) {
      apiParams['filter_' + filter[i]] = filter[i + 1];
      props.filters['filter_' + filter[i]] = filter[i + 1];
    }
  }

  props.page = await ictApiWPGetPost({
    api,
    params: apiParams,
    single: true,
  });

  return {
    props,
    revalidate: 60 * 10, // In seconds
  };
}

export async function getStaticPaths(ctx) {
  // const { locales, locale } = ctx;
  // let paths = [{ params: { slug: [] } }];
  let paths = [
    { params: { slug: [] }, locale: 'mn' },
    { params: { slug: [] }, locale: 'en' },
  ];

  // let paths = [];
  // if (process.env.NODE_ENV === 'production') {
  //     const pages = await ictApiWPGetPost({
  //         api: 'pages/',
  //         params: { per_page: 100 },
  //     });
  //     let temp = new Set();
  //     pages &&
  //         pages.length &&
  //         pages.map((page) => {
  //             let link = ictTrimSlashes(ictRmMultiSlashes(page.link));
  //             let splitted = link.split('/');
  //             for (let i = 2; i < splitted.length; i++) {
  //                 let tempPath = null;
  //                 if (splitted.length === 3 && splitted[2] !== 'login') {
  //                     // temp.add(splitted[i]);
  //                     tempPath = splitted[i];
  //                 } else if (splitted.length === 4) {
  //                     tempPath = splitted[2] + '/' + splitted[3];
  //                 }
  //                 if (tempPath) {
  //                     paths.push({
  //                         params: { slug: [tempPath] },
  //                         locale: 'mn',
  //                     });
  //                     paths.push({
  //                         params: { slug: [tempPath] },
  //                         locale: 'en',
  //                     });
  //                 }
  //             }
  //             // paths.push({ params: { slug: [] }, locale: 'mn' });
  //             // paths.push({ params: { slug: [] }, locale: 'en' });
  //             // temp.push(link.split('/'))
  //         });
  //     // const menus = [...temp];
  //     paths.push({ params: { slug: [] }, locale: 'mn' });
  //     paths.push({ params: { slug: [] }, locale: 'en' });
  // } else {
  //     // paths = [
  //     //     { params: { slug: [] }, locale: 'mn' },
  //     //     { params: { slug: [] }, locale: 'en' },
  //     // ];
  // }

  return {
    paths: paths,
    fallback: 'blocking',
  };
}
