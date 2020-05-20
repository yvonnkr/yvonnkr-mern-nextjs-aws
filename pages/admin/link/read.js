import React, { useState } from "react";
import axios from "axios";
import renderHTML from "react-render-html";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import Link from "next/link";
import Router from "next/router";

import { API } from "../../../config";
import { getCookie } from "./../../../helpers/auth";
import { HeadSEO } from "./../../../components/HeadSEO";

const AllLinks = (props) => {
  const { links, totalLinks, linksLimit, linksSkip, token } = props;

  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linksSkip);
  const [size, setSize] = useState(totalLinks);

  const loadMore = async () => {
    let toSkip = skip + limit;

    try {
      const { data } = await axios.get(
        `${API}/links?limit=${limit}&skip=${toSkip}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllLinks([...allLinks, ...data]);
      setSize(data.length);
      setSkip(toSkip);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (linkId) => {
    const isOk = window.confirm("Are you sure you want to delete this link?");
    if (isOk) {
      handleLinkDelete(linkId);
    }
  };

  const handleLinkDelete = async (linkId) => {
    try {
      const { data } = await axios.delete(`${API}/link/admin/${linkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(data);
      //   loadLinks();
      process.browser && window.location.reload();
    } catch (error) {
      const errMsg = error.response?.data.error || "server error";
      console.log(errMsg);
    }
  };

  //used windows reload instead --on delete
  const loadLinks = async () => {
    try {
      const { data } = await axios.get(`${API}/links`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllLinks([...data]);
      setSize(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const listOfLinks = () =>
    allLinks.map((link, index) => (
      <div className="row alert alert-primary p-2" key={index}>
        <div className="col-md-8">
          <a href={link.url} target="_blank" style={{ textDecoration: "none" }}>
            <h5 className="pt-2">{link.title}</h5>
            <h6 className="p-2 text-danger" style={{ fontSize: "12px" }}>
              {link.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(link.createdAt).fromNow()} by {link.postedBy.name}{" "}
          </span>
          <span className="badge text-secondary pull-right">
            {link.clicks} clicks
          </span>

          {/* TODO: */}
          <div>
            <span className="badge  pull-right">
              {/*  href="/user/link/[id]" */}
              <Link href="/admin/link/[id]" as={`/admin/link/${link._id}`}>
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
        <div className="col-md-12">
          <span className="badge text-dark">
            {link.type} / {link.medium}
          </span>

          {link.categories.map((category) => (
            <span className="badge text-success" key={category._id}>
              {category.name}
            </span>
          ))}
        </div>
      </div>
    ));

  return (
    <>
      {HeadSEO("All Links")}
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={size > 0 && size >= limit}
        loader={<img src="/images/loader1.gif" key={0} alt="loader" />}
      >
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4 font-weight-bold my-text">All Links</h1>
          </div>
        </div>
        <br />

        <div className="row">
          <div className="col-md-12">{listOfLinks()}</div>
        </div>
      </InfiniteScroll>
    </>
  );
};

AllLinks.getInitialProps = async ({ req }) => {
  const token = getCookie("token", req);
  let limit = 10;
  let skip = 0;
  try {
    const { data } = await axios.get(
      `${API}/links?limit=${limit}&skip=${skip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      links: data,
      totalLinks: data.length,
      linksLimit: limit,
      linksSkip: skip,
      token,
    };
  } catch (error) {
    return {
      links: null,
      totalLinks: null,
    };
  }
};

export default AllLinks;
