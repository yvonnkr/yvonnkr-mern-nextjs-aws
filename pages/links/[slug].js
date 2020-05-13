import React, { useState } from "react";
import axios from "axios";
import renderHTML from "react-render-html";
import moment from "moment";
import { API } from "../../config";

const Links = (props) => {
  const { query, category, links, totalLinks, linksLimit, linksSkip } = props;

  const [allLinks, setAllLinks] = useState(links);

  const listOfLinks = () =>
    allLinks.map((link) => (
      <div className="row alert alert-primary p-2" key={link._id}>
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
      <div className="row">
        <div className="col-md-8">
          <h1 className="display-4 font-weight-bold my-text">
            {category.name} - URL | Links
          </h1>
          <div className="lead alert alert-secondary pt-4">
            {renderHTML(category.content)}
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
      <div className="row">
        <div className="col-md-8">{listOfLinks()}</div>
        <div className="col-md-4">
          <h2 className="lead">Most popular in {category.name}</h2>
          <p>Show popular links</p>
        </div>
      </div>
      <br />
      <button>load more</button>
    </>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let limit = 2;
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
