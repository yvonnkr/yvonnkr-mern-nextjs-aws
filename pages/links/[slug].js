import React, { useState, useEffect } from "react";
import axios from "axios";
import renderHTML from "react-render-html";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";
import { API } from "../../config";

const Links = (props) => {
  const { query, category, links, totalLinks, linksLimit, linksSkip } = props;

  const [allLinks, setAllLinks] = useState(links);
  const [limit, setLimit] = useState(linksLimit);
  const [skip, setSkip] = useState(linksSkip);
  const [size, setSize] = useState(totalLinks);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    try {
      const { data } = await axios.get(`${API}/links/popular/${query.slug}`);
      setPopular(data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMore = async () => {
    let toSkip = skip + limit;

    try {
      const { data } = await axios.get(
        `${API}/category/${query.slug}?limit=${limit}&skip=${toSkip}`
      );

      setAllLinks([...allLinks, ...data.links]);
      setSize(data.links.length);
      setSkip(toSkip);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickCount = async (linkId) => {
    try {
      await axios.put(`${API}/click-count`, { linkId });
      loadUpdatedLinks();
      loadPopular();
    } catch (error) {
      console.log(error);
    }
  };

  const loadUpdatedLinks = async () => {
    try {
      const { data } = await axios.get(`${API}/category/${query.slug}`);

      setAllLinks(data.links);
    } catch (error) {
      console.log(error);
    }
  };

  const listOfLinks = () =>
    allLinks.map((link, index) => (
      <div className="row alert alert-primary p-2" key={index}>
        <div className="col-md-8" onClick={() => handleClickCount(link._id)}>
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

  const showPopularLinks = () =>
    popular.length > 0 &&
    popular.map((link) => (
      <div key={link._id} className="row alert alert-secondary p-2 ">
        <div className="col-md-8">
          <a
            href={link.url}
            target="_blank"
            style={{ textDecoration: "none" }}
            onClick={() => handleClickCount(link._id)}
          >
            <h5 className="pt-2 my-text">{link.title}</h5>
            <h6 className="pt-2 text-danger" style={{ fontSize: "12px" }}>
              {link.url}
            </h6>
          </a>
        </div>
        <div className="col-md-4 pt-2">
          <span className="pull-right">
            {moment(link.createdAt).fromNow()} by {link.postedBy.name}
          </span>
          <br />
          <span className="badge text-danger pull-right">
            {link.clicks} clicks
          </span>
        </div>

        <div className="col-md-12 pt-2">
          <span className="badge text-dark">
            {link.type} {link.medium}
          </span>

          {link.categories.map((category) => (
            <span key={category._id} className="badge text-primary">
              {category.name}
            </span>
          ))}
        </div>
      </div>
    ));

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      hasMore={size > 0 && size >= limit}
      loader={<img src="/images/loader1.gif" key={0} alt="loader" />}
    >
      <div className="row">
        <div className="col-md-8">
          <h1 className="display-4 font-weight-bold my-text">
            {category.name} - URL | Links
          </h1>
          <div className="lead alert alert-secondary pt-4">
            <div style={{ wordWrap: "break-word" }}>
              {renderHTML(category.content)}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <img
            src={category.image.url}
            alt={category.name}
            style={{ width: "auto", maxHeight: "200px" }}
          />
        </div>
      </div>
      <br />

      <div className="row">
        <div className="col-md-8">{listOfLinks()}</div>
        <div className="col-md-4">
          <h2 className="lead">Most popular in {category.name}</h2>
          <div className="p-3">{showPopularLinks()}</div>
        </div>
      </div>
    </InfiniteScroll>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let limit = 10;
  let skip = 0;
  try {
    const { data } = await axios.get(
      `${API}/category/${query.slug}?limit=${limit}&skip=${skip}`
    );

    return {
      query,
      category: data.category,
      links: data.links,
      totalLinks: data.links.length,
      linksLimit: limit,
      linksSkip: skip,
    };
  } catch (error) {
    return {
      query,
      category: null,
      links: null,
      totalLinks: null,
    };
  }
};

export default Links;
