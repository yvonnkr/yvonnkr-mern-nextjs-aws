import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import Nprogress from "nprogress";

Router.onRouteChangeStart = (url) => Nprogress.start();
Router.onRouteChangeComplete = (url) => Nprogress.done();
Router.onRouteChangeError = (url) => Nprogress.done();

const Layout = ({ children }) => {
  const head = () => (
    <Head>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous"
      />
    </Head>
  );

  const navbar = () => (
    <ul className="nav nav-tabs my-navbar ">
      <li className="nav-item " className="nav-item">
        <Link href="/">
          <a className="nav-link">Home</a>
        </Link>
      </li>
      <li className="nav-item" className="nav-item">
        <Link href="/login">
          <a className="nav-link">Login</a>
        </Link>
      </li>
      <li className="nav-item" className="nav-item">
        <Link href="/register">
          <a className="nav-link">Register</a>
        </Link>
      </li>
    </ul>
  );

  return (
    <React.Fragment>
      {head()}
      {navbar()}
      <div className="container pt-5 pb-5">{children}</div>
    </React.Fragment>
  );
};

export default Layout;
