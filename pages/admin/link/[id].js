import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";

import { API } from "../../../config";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { isAuth } from "./../../../helpers/auth";
import withAdmin from "./../../withAdmin";
import { HeadSEO } from "./../../../components/HeadSEO";

const AdminUpdateLink = ({ selectedLink, token }) => {
  const [state, setState] = useState({
    title: selectedLink.title,
    url: selectedLink.url,
    categories: selectedLink.categories,
    loadedCategories: [],
    success: "",
    error: "",
    type: selectedLink.type,
    medium: selectedLink.medium,
  });

  //prettier-ignore
  const {title,url,categories,loadedCategories,success,error,type,medium} = state;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await axios.get(`${API}/categories`);

        setState({
          ...state,
          loadedCategories: data,
        });
      } catch (error) {
        const errMsg = error.response?.data.error || "Server error";
        setState({ ...state, error: errMsg, success: "" });
      }
    };

    loadCategories();
  }, [success]);

  const handleTitleChange = (e) => {
    setState({ ...state, title: e.target.value, success: "", error: "" });
  };

  const handleUrlChange = (e) => {
    setState({ ...state, url: e.target.value, success: "", error: "" });
  };

  const handleToggle = (categoryId) => {
    //return first index or -1
    const catIndex = categories.indexOf(categoryId);

    const catArray = [...categories];
    if (catIndex === -1) {
      catArray.push(categoryId);
    } else {
      catArray.splice(catIndex, 1);
    }

    setState({ ...state, categories: [...catArray], success: "", error: "" });
  };

  const handleTypeClick = (e) => {
    setState({ ...state, type: e.target.value, success: "", error: "" });
  };

  const handleMediumClick = (e) => {
    setState({ ...state, medium: e.target.value, success: "", error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        `${API}/link/admin/${selectedLink._id}`,
        {
          title,
          url,
          categories,
          type,
          medium,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setState({
        ...state,
        success: "Link Updated!",
        error: "",
      });
    } catch (error) {
      const errMsg = error.response?.data.error || "Server error";
      setState({ ...state, error: errMsg, success: "" });
    }
  };

  const showCategories = () => {
    return (
      loadedCategories &&
      loadedCategories.map((c) => (
        <li className="list-unstyled" key={c._id}>
          <input
            type="checkbox"
            onChange={() => handleToggle(c._id)}
            className="mr-2"
            checked={categories.includes(c._id)}
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTypes = () => (
    <>
      <div className="form-check  ">
        <label className="form-check-label">
          <input
            type="radio"
            onChange={handleTypeClick}
            checked={type === "free"}
            value="free"
            className="form-check-input"
            name="type"
          />
          Free
        </label>
      </div>
      <div className="form-check  ">
        <label className="form-check-label">
          <input
            type="radio"
            onChange={handleTypeClick}
            checked={type === "paid"}
            value="paid"
            className="form-check-input"
            name="type"
          />
          Paid
        </label>
      </div>
    </>
  );

  const showMedium = () => (
    <>
      <div className="form-check  ">
        <label className="form-check-label">
          <input
            type="radio"
            onChange={handleMediumClick}
            checked={medium === "video"}
            value="video"
            className="form-check-input"
            name="medium"
          />
          Video
        </label>
      </div>
      <div className="form-check  ">
        <label className="form-check-label">
          <input
            type="radio"
            onChange={handleMediumClick}
            checked={medium === "book"}
            value="book"
            className="form-check-input"
            name="medium"
          />
          Book
        </label>
      </div>
    </>
  );

  const submitLinkForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          className="form-control"
          type="text"
          value={title}
          required
          onChange={handleTitleChange}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">URL</label>
        <input
          className="form-control"
          type="url"
          value={url}
          required
          onChange={handleUrlChange}
        />
      </div>

      <div>
        <button
          type="submit"
          className="btn btn-outline-warning"
          disabled={token ? false : true}
        >
          {isAuth() || token ? "Update" : "Login to update"}
        </button>
        <button
          className="btn my-button-inverted ml-3"
          onClick={() => Router.push("/admin/link/read")}
        >
          Back To Manage all links
        </button>
      </div>
    </form>
  );

  return (
    <>
      {HeadSEO("Update Link")}
      <div className="row">
        <div className="col-md-12 my-text" style={{ textAlign: "center" }}>
          <h1>Update Link | URL</h1>
          <br />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label className="text-muted ml-4">Category</label>
            <ul className="my-scroll">{showCategories()}</ul>
          </div>

          <div className="form-group">
            <label className="text-muted ml-4">Type</label>
            <ul>{showTypes()}</ul>
          </div>

          <div className="form-group">
            <label className="text-muted ml-4">Medium</label>
            <ul>{showMedium()}</ul>
          </div>
        </div>

        <div className="col-md-8">
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {submitLinkForm()}
        </div>
      </div>
    </>
  );
};

AdminUpdateLink.getInitialProps = async ({ query }) => {
  try {
    const { data } = await axios.get(`${API}/link/${query.id}`);
    return { selectedLink: data };
  } catch (error) {
    return { selectedLink: null };
  }
};

export default withAdmin(AdminUpdateLink);
