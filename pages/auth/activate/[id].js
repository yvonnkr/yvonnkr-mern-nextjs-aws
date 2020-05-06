import React, { useState, useEffect } from "react";
import Router, { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import axios from "axios";

import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";

const ActivationAccount = () => {
  const [state, setState] = useState({
    name: "",
    token: "",
    buttonText: "Activate Account",
    success: "",
    error: "",
  });

  const { name, token, buttonText, success, error } = state;

  const router = useRouter({});

  useEffect(() => {
    let token = router.query.id;
    if (token) {
      const decodedToken = jwt.decode(token);
      const { name } = decodedToken;
      setState({ ...state, name, token });
    }
  }, [router]);

  const clickSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Activating" });

    try {
      const response = await axios.post(`${API}/register/activate`, { token });

      setState({
        ...state,
        name: "",
        token: "",
        buttonText: "Activated",
        success: response.data.message,
      });

      if (response) {
        Router.push("/login");
      }
    } catch (error) {
      let errMsg = error.response.data.error || "Server error!";

      setState({
        ...state,
        buttonText: "Activate Account",
        error: errMsg,
      });
    }
  };

  return (
    <div className="row">
      <div className="col-md-6 offset-md-3">
        <h3>Hello {name}, Ready to activate your account?</h3>
        <br />
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        <button
          className="btn btn-block my-button-inverted"
          onClick={clickSubmit}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ActivationAccount;

//#region using withRouter
/* 
import React from "react";
import { withRouter } from "next/router";

const ActivationAccount = ({ router }) => {
  return (
    <div>
      <h1>Activation Page</h1>
      <pre>{JSON.stringify(router, null, 4)}</pre>
    </div>
  );
};

export default withRouter(ActivationAccount);
*/
//#endregion
