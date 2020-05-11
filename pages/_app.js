import Router from "next/router";
import App from "next/app";
import Nprogress from "nprogress";

import "nprogress/nprogress.css";
import "../public/styles/index.scss";
// import "react-quill/dist/quill.bubble.css";
import "react-quill/dist/quill.snow.css";

import Layout from "./../components/Layout";

Router.onRouteChangeStart = (url) => Nprogress.start();
Router.onRouteChangeComplete = (url) => Nprogress.done();
Router.onRouteChangeError = (url) => Nprogress.done();

const MyApp = ({ Component, pageProps }) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default MyApp;
