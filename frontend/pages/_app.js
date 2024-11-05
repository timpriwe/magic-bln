import nProgress from 'nprogress';
import Page from '../components/Page';
import Router from 'next/router';

import '../styles/reset.css';
import 'nprogress/nprogress.css';
import '../styles/nprogress.css';


Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());

export default function MyApp({ Component, pageProps }) {
  return (
    <Page>
      <Component {...pageProps} />
    </Page>
  );
}
