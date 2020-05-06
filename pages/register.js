import { useState, useEffect } from "react";
import axios from "axios";

import { showSuccessMessage, showErrorMessage } from "./../helpers/alerts";
import { API } from "../config";
import { isAuth } from "./../helpers/auth";
import Router from "next/router";

const Register = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Register",
  });

  const { name, email, password, error, success, buttonText } = state;

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

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
      });

      //setState
      setState({
        ...state,
        name: "",
        email: "",
        password: "",
        buttonText: "Submitted",
        success: data.message,
        error: "",
      });
    } catch (error) {
      let errMsg = error.response.data.error || "Server error!";

      setState({
        ...state,
        error: errMsg,
        success: "",
        buttonText: "Register",
      });
    }
  };

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
        <div>
          <button type="submit" className="btn inverted">
            {buttonText}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h1>Register</h1>
      <br />
      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      {registerForm()}
      {/* <pre>{JSON.stringify(state, null, 4)}</pre> */}
    </div>
  );
};

export default Register;
