import React, { useState } from "react";
import Link from "next/link";
import moment from "moment";
import axios from "axios";
import Router from "next/router";

import withUser from "../withUser";
import { API } from "../../config";
import { HeadSEO } from "./../../components/HeadSEO";

const User = ({ user, token }) => {
  const { profile, userLinks } = user;

  const confirmDelete = (linkId) => {
    const isOk = window.confirm("Are you sure you want to delete this link?");
    if (isOk) {
      handleLinkDelete(linkId);
    }
  };

  const handleLinkDelete = async (linkId) => {
    try {
      const { data } = await axios.delete(`${API}/link/${linkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(data);
      Router.replace("/user");
    } catch (error) {
      const errMsg = error.response?.data.error || "server error";
      console.log(errMsg);
    }
  };

  const listOfLinks = () =>
    userLinks.length > 0 &&
    userLinks.map((link) => (
      <div key={link._id} className="row alert alert-primary p-2">
        <div className="col-md-8 pt-2">
          <a href={link.url} target="_blank" style={{ textDecoration: "none" }}>
            <h5 className="p-2">{link.title}</h5>
            <h6 className="p-2 text-danger" style={{ fontSize: "12px" }}>
              {link.url}
            </h6>
          </a>
        </div>

        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(link.createdAt).fromNow()} by {link.postedBy.name}
          </span>
        </div>

        <div className="col-md-12">
          <span className="badge text-dark">
            {link.type} / {link.medium}
          </span>

          {link.categories.map((category) => (
            <span key={category._id} className="badge text-success">
              {category.name}
            </span>
          ))}

          <span className="badge text-secondary">{link.clicks} clicks</span>

          <span className="badge  pull-right">
            <Link href="/user/link/[id]" as={`/user/link/${link._id}`}>
              <a className="text-warning" style={{ textDecoration: "none" }}>
                Update
              </a>
            </Link>
          </span>

          <span
            className="badge text-danger pull-right"
            style={{ cursor: "pointer" }}
            onClick={() => confirmDelete(link._id)}
          >
            Delete
          </span>
        </div>
      </div>
    ));

  return (
    <>
      {HeadSEO("Dashboard")}
      <h1 className="my-text">
        {profile.name}'s dashboard /
        <span className="text-info">{profile.role}</span>
      </h1>
      <hr />
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/user/link/create">
                <a className="nav-link my-text ">Submit a Link</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/user/profile/update">
                <a className="nav-link my-text ">Update Profile</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8">{listOfLinks()}</div>
      </div>
    </>
  );
};

//#region Before withUser HOC

// User.getInitialProps = async (context) => {
//   const token = getCookie("token", context.req);

//   let user = null;

//   //ajax req
//   if (token) {
//     try {
//       const { data } = await axios.get(`${API}/user`, {
//         headers: {
//           // authorization: `Bearer ${tokenValue}`,
//           authorization: `Bearer ${token}`,
//         },
//       });

//       user = data;
//     } catch (error) {
//       const errMsg = error.response.data.error || "Server Error";
//       if (errMsg) {
//         user = null;
//       }
//     }
//   }

//   if (user === null) {
//     // redirect
//     context.res.writeHead(302, {
//       Location: "/",
//     });
//     context.res.end();
//   } else {
//     return {
//       // ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
//       user,
//       token,
//     };
//   }

// };

//#endregion

export default withUser(User);
