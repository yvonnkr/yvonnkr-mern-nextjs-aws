import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Router from "next/router";

import { API } from "../config";
import { authenticate, isAuth } from "./../helpers/auth";
import { showSuccessMessage, showErrorMessage } from "../helpers/alerts";

const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
    error: "",
    success: "",
    buttonText: "Login",
  });

  const { email, password, error, success, buttonText } = state;

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
      error: "",
      success: "",
      buttonText: "Login",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, buttonText: "Logging in" }));

    try {
      const response = await axios.post(`${API}/login`, { email, password });

      authenticate(response, () =>
        isAuth() && isAuth().role === "admin"
          ? Router.push("/admin")
          : Router.push("/user")
      );
    } catch (error) {
      let errMsg = error.response.data.error || "Server error!";
      setState({
        ...state,
        error: errMsg,
        success: "",
        buttonText: "Login",
      });
    }
  };

  const loginForm = () => {
    return (
      <form className="my-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            className="form-control"
            type="email"
            name="email"
            value={email}
            placeholder="Type your email"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            type="password"
            name="password"
            value={password}
            placeholder="Type your password"
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <button className="btn inverted">{buttonText}</button>
        </div>
      </form>
    );
  };

  return (
    <div className="col-md-6 offset-md-3">
      <h1>Login</h1>
      <br />
      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      {loginForm()}
      <Link href="/auth/password/forgot">
        <a className="text-danger float-right">Forgot Password</a>
      </Link>
    </div>
  );
};

export default Login;
