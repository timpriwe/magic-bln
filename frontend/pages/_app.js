/* eslint-disable react/jsx-props-no-spreading */
import nProgress from 'nprogress';
import Page from '../components/Page';
import Router from 'next/router';
import { ApolloProvider } from '@apollo/client';
import withData from '../lib/withData';

import '../styles/reset.css';
import 'nprogress/nprogress.css';
import '../styles/nprogress.css';


Router.events.on('routeChangeStart', () => nProgress.start());
Router.events.on('routeChangeComplete', () => nProgress.done());
Router.events.on('routeChangeError', () => nProgress.done());

function MyApp({ Component, pageProps, apollo }) {

  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}
MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

export default withData(MyApp);
