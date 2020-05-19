import { useState, useEffect } from "react";
import axios from "axios";

import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import withUser from "./../../withUser";
import { updateUserInLocalstorage } from "../../../helpers/auth";

const UpdateProfile = ({ user, token }) => {
  const [state, setState] = useState({
    name: user.profile.name,
    email: user.profile.email,
    password: "",
    error: "",
    success: "",
    buttonText: "Update",
    categories: user.profile.categories,
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
      buttonText: "Update",
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
    setState({ ...state, buttonText: "Updating" });

    //send to server
    try {
      //ajax
      const { data } = await axios.put(
        `${API}/user`,
        {
          name,
          password,
          categories,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //update user in local-storage
      updateUserInLocalstorage(data, () => {
        //setState
        setState({
          ...state,
          buttonText: "Submitted",
          success: "Profile updated Successfuly",
          error: "",
        });
      });
    } catch (error) {
      let errMsg = error.response?.data.error || "Server error!";

      setState({
        ...state,
        error: errMsg,
        success: "",
        buttonText: "Update",
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
            checked={categories.includes(c._id)}
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const updateForm = () => {
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
            disabled
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Enter password - optional"
            name="password"
            value={password}
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
    <div className="col-md-6 offset-md-3">
      <h1>Update Profile</h1>
      <br />
      {success && showSuccessMessage(success)}
      {error && showErrorMessage(error)}
      {updateForm()}
      {/* <pre>{JSON.stringify(state, null, 4)}</pre> */}
    </div>
  );
};

export default withUser(UpdateProfile);
