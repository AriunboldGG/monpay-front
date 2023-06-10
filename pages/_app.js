import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import '../styles/responsive.css';
import Router from 'next/router';
import { SSRProvider } from '@react-aria/ssr';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { IctProvider } from 'context/ict-context';
Router.onRouteChangeStart = (url) => {
  NProgress.start();
};
Router.onRouteChangeComplete = (url) => {
  NProgress.done();
};
Router.onRouteChangeError = (url) => {
  NProgress.done();
};

function MyApp({ Component, pageProps }) {
  return (
    <IctProvider>
      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
    </IctProvider>
  );
}

export default MyApp;
