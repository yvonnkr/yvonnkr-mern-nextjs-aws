import React, { useState, useEffect } from "react";
import axios from "axios";

import { API } from "../../../config";
import {
  showSuccessMessage,
  showErrorMessage,
} from "./../../../helpers/alerts";
import { getCookie, isAuth } from "./../../../helpers/auth";

const CreateLink = ({ token }) => {
  const [state, setState] = useState({
    title: "",
    url: "",
    categories: [],
    loadedCategories: [],
    success: "",
    error: "",
    type: "",
    medium: "",
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
          //   error: "", TODO:
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
      const { data } = await axios.post(
        `${API}/link`,
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
        success: "Link submitted!",
        error: "",
        title: "",
        url: "",
        categories: [],
        loadedCategories: [],
        type: "",
        medium: "",
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
          className="btn my-button-inverted"
          disabled={token ? false : true}
        >
          {isAuth() || token ? "Post" : "Login to post"}
        </button>
      </div>
    </form>
  );

  return (
    <>
      <div className="row">
        <div className="col-md-12 my-text" style={{ textAlign: "center" }}>
          <h1>Submit Link | URL</h1>
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

CreateLink.getInitialProps = async (ctx) => {
  const token = getCookie("token", ctx.req);
  return { token };
};

export default CreateLink;

//#region Steps to create/Submit a link in the frontend
/*
    # Imports
    # state
    # load categories when component mounts with useEffect
    # link create form
    # handle change title
    # handle change url
    # handle change type
    # handle change medium
    # handle submit > post request to server(backend)
    # show categories > checkbox
    # show types > radio buttons
    # show medium > radio buttons
    # handle toggle > selecting categories
    # return > show create forms,categories,checkbox,radio butons,success/error messages etc
    # get token of the logged in user --required to create a link

*/
//#endregion
