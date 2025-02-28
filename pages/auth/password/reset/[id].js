import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import {
  showSuccessMessage,
  showErrorMessage,
} from "../../../../helpers/alerts";
import { API } from "../../../../config";
import jwt from "jsonwebtoken";
import { HeadSEO } from "./../../../../components/HeadSEO";

const ResetPassword = () => {
  const [state, setState] = useState({
    name: "",
    token: "",
    newPassword: "",
    buttonText: "Reset Password",
    success: "",
    error: "",
  });
  const { name, token, newPassword, buttonText, success, error } = state;

  const router = useRouter();

  useEffect(() => {
    const decoded = jwt.decode(router.query.id);

    if (decoded)
      setState({ ...state, name: decoded.name, token: router.query.id });
  }, [router]);

  const handleChange = (e) => {
    setState({ ...state, newPassword: e.target.value, success: "", error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Sending" });

    try {
      const response = await axios.put(`${API}/reset-password`, {
        resetPasswordLink: token,
        newPassword,
      });

      setState({
        ...state,
        newPassword: "",
        buttonText: "Done",
        success: response.data.message,
      });
    } catch (error) {
      let errMsg = error.response?.data.error || "Server error!";
      setState({
        ...state,
        buttonText: "Forgot Password",
        error: errMsg,
      });
    }
  };

  const passwordResetForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          className="form-control"
          onChange={handleChange}
          value={newPassword}
          placeholder="Type new password"
          required
        />
      </div>
      <div>
        <button className="btn btn-outline-warning">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <>
      {HeadSEO("Reset Password")}
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1>Hi {name}, Ready to Reset Password?</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {passwordResetForm()}
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
