import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

import withAdmin from "./../../withAdmin";
import { API } from "../../../config";
import {
  showSuccessMessage,
  showErrorMessage,
} from "./../../../helpers/alerts";
import { HeadSEO } from "./../../../components/HeadSEO";

const ReadCategory = ({ token }) => {
  const [state, setState] = useState({
    error: "",
    success: "",
    categories: [],
  });

  const { error, success, categories } = state;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories`);
      setState({ ...state, categories: data });
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (e, slug) => {
    e.preventDefault();
    let isOk = window.confirm("Are you sure you want to delete this category?");
    if (isOk) {
      handleDelete(slug);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const { data } = await axios.delete(`${API}/category/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setState({ ...state, error: "", success: data.message });
      loadCategories();
    } catch (error) {
      const errMsg = error.response?.data.error || "server error";
      setState({ ...state, error: errMsg, success: "" });
    }
  };

  const listCategories = () =>
    categories.length > 0 &&
    categories.map((category) => (
      <Link
        href="/links/[slug]"
        as={`/links/${category.slug}`}
        key={category._id}
      >
        <a
          style={{ border: "1px solid #563d7c", textDecoration: "none" }}
          className="bg-light p-3 col-md-6"
        >
          <div>
            <div className="row">
              <div className="col-md-3">
                <img
                  src={category.image && category.image.url}
                  alt={category.name}
                  style={{ width: "100px", height: "auto" }}
                  className="pr-3"
                />
              </div>
              <div className="col-md-6  my-text">
                <h3 style={{ textTransform: "capitalize" }}>{category.name}</h3>
              </div>
              <div className="col-md-3">
                <Link
                  href="/admin/category/[slug]"
                  as={`/admin/category/${category.slug}`}
                >
                  <button className="btn my-button-inverted btn-sm btn-block mb-1">
                    Update
                  </button>
                </Link>

                <button
                  className="btn btn-outline-danger btn-sm btn-block mb-1"
                  onClick={(e) => confirmDelete(e, category.slug)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </a>
      </Link>
    ));

  return (
    <>
      {HeadSEO("All Categories")}
      <div className="row">
        <div className="col-md-12">
          <h1 className="my-text" style={{ textAlign: "center" }}>
            List of categories
          </h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
        </div>
      </div>

      <div className="row">{listCategories()}</div>
    </>
  );
};

export default withAdmin(ReadCategory);
