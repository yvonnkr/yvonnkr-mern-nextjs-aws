import { useState, useEffect } from "react";
import axios from "axios";

import { showSuccessMessage, showErrorMessage } from "./../helpers/alerts";
import { API } from "../config";
import { isAuth } from "./../helpers/auth";
import Router from "next/router";
import { HeadSEO } from "./../components/HeadSEO";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Register",
    categories: [],
    loadedCategories: [],
  });

  const {
    name,
    email,
    password,
    error,
    success,
    buttonText,
    categories,
    loadedCategories,
  } = state;

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
      error: "",
      success: "",
      buttonText: "Register",
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Registering" });

    //send to server
    try {
      //ajax
      const { data } = await axios.post(`${API}/register`, {
        name,
        email,
        password,
        categories,
      });

      //setState
      setState({
        ...state,
        name: "",
        email: "",
        password: "",
        categories: [],
        buttonText: "Submitted",
        success: data.message,
        error: "",
      });
    } catch (error) {
      let errMsg = error.response?.data.error || "Server error!";

      setState({
        ...state,
        error: errMsg,
        success: "",
        buttonText: "Register",
      });
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

  const registerForm = () => {
    return (
      <form className="my-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Your name"
            name="name"
            value={name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            placeholder="Your email"
            name="email"
            value={email}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            name="password"
            value={password}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="text-muted ml-4">
            What topics are you interested on?
          </label>
          <ul className="my-scroll">{showCategories()}</ul>
        </div>
        <div>
          <button type="submit" className="btn inverted">
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <>
      {HeadSEO("Register")}
      <div className="col-md-6 offset-md-3">
        <h1>Register</h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {registerForm()}
      </div>
    </>
  );
};

export default Register;
