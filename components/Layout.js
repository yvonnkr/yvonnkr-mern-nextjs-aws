import Head from "next/head";
import Link from "next/link";
import { isAuth, logout } from "./../helpers/auth";

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
    <ul className="nav nav-tabs my-navbar">
      <li className="nav-item">
        <Link href="/">
          <a className="nav-link ">Home</a>
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/user/link/create">
          <a className="nav-link ">Submit a link</a>
        </Link>
      </li>

      {!isAuth() && (
        <React.Fragment>
          <li className="nav-item">
            <Link href="/login">
              <a className="nav-link ">Login</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/register">
              <a className="nav-link ">Register</a>
            </Link>
          </li>
        </React.Fragment>
      )}

      {isAuth() && isAuth().role === "admin" && (
        <li className="nav-item ml-auto">
          <Link href="/admin">
            <a className="nav-link ">
              {isAuth().name}-<span>Admin</span>
            </a>
          </Link>
        </li>
      )}

      {isAuth() && isAuth().role === "subscriber" && (
        <li className="nav-item ml-auto">
          <Link href="/user">
            <a className="nav-link ">{isAuth().name}</a>
          </Link>
        </li>
      )}

      {isAuth() && (
        <li className="nav-item ">
          <a onClick={logout} className="nav-link ">
            Logout
          </a>
        </li>
      )}
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
