import axios from "axios";
import Link from "next/link";
import moment from "moment";

import { API } from "../config";
import { useState, useEffect } from "react";

const Home = ({ categories }) => {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    loadPopular();
  }, []);

  const loadPopular = async () => {
    try {
      const { data } = await axios.get(`${API}/links/popular`);
      setPopular(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClicks = async (linkId) => {
    try {
      const { data } = await axios.put(`${API}/click-count`, { linkId });
      loadPopular();
    } catch (error) {
      console.log(error);
    }
  };

  const listCategories = () =>
    categories &&
    categories.map((category) => (
      <Link
        href="/links/[slug]"
        as={`/links/${category.slug}`}
        key={category._id}
      >
        <a
          style={{ border: "1px solid #563d7c", textDecoration: "none" }}
          className="bg-light p-3 col-md-4"
        >
          <div>
            <div className="row">
              <div className="col-md-5">
                <img
                  src={category.image && category.image.url}
                  alt={category.name}
                  style={{ width: "100px", height: "auto" }}
                  className="pr-3"
                />
              </div>
              <div className="col-md-7  my-text">
                <h3 style={{ textTransform: "capitalize" }}>{category.name}</h3>
              </div>
            </div>
          </div>
        </a>
      </Link>
    ));

  const listOfTrendingLinks = () =>
    popular.length > 0 &&
    popular.map((link) => (
      <div key={link._id} className="row alert alert-secondary p-2">
        <div className="col-md-8">
          <a
            href={link.url}
            target="_blank"
            style={{ textDecoration: "none" }}
            onClick={() => handleClicks(link._id)}
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
    <>
      <div className="row">
        <div className="col-md-12">
          <h1 className="my-text" style={{ textAlign: "center" }}>
            Browse Tutorials | Courses
          </h1>
          <br />
        </div>
      </div>

      <div className="row">
        {!categories && <p>server error...</p>}
        {categories && listCategories()}
      </div>

      <div className="row pt-5">
        <h1 className="my-text pb-3">Trending</h1>
        <div className="col-md-12 overflow-hidden ">
          {listOfTrendingLinks()}
        </div>
      </div>
    </>
  );
};

Home.getInitialProps = async () => {
  try {
    const { data } = await axios.get(`${API}/categories`);
    return { categories: data };
  } catch (error) {
    return { categories: null };
  }
};

export default Home;
