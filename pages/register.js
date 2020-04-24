import { useState } from "react";
import Layout from "../components/Layout";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    //send to server
    console.table({ name, email, password });
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
    <React.Fragment>
      <Layout>
        <div className="col-md-6 offset-md-3">
          <h1>Register</h1>
          <br />
          {registerForm()}
          {JSON.stringify(state)}
          {process.env.my_secrete && <p>env present</p>}
        </div>
      </Layout>
    </React.Fragment>
  );
};

export default Register;
