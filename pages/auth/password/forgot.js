import { useState } from "react";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";

const ForgotPassword = () => {
  const [state, setState] = useState({
    email: "",
    buttonText: "Forgot Password",
    success: "",
    error: "",
  });
  const { email, buttonText, success, error } = state;

  const handleChange = (e) => {
    setState({ ...state, email: e.target.value, success: "", error: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${API}/forgot-password`, { email });
      setState({
        ...state,
        email: "",
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

  const passwordForgotForm = () => (
    <form className="my-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control"
          onChange={handleChange}
          value={email}
          placeholder="Type your email"
          required
        />
      </div>
      <div>
        <button className="btn inverted">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <h1>Forgot Password</h1>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        {passwordForgotForm()}
      </div>
    </div>
  );
};

export default ForgotPassword;
