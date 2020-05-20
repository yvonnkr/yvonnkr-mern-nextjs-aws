import React, { useState } from "react";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
// import ReactQuill from "react-quill"; //this doesn't work

import { API } from "../../../config";
import withAdmin from "./../../withAdmin";
import {
  showSuccessMessage,
  showErrorMessage,
} from "./../../../helpers/alerts";
import { HeadSEO } from "./../../../components/HeadSEO";

const CreateCategory = ({ user, token }) => {
  const [state, setState] = useState({
    name: "",
    success: "",
    error: "",
    buttonText: "Create",
    image: "",
  });

  const [content, setContent] = useState("");

  //prettier-ignore
  const [imageUploadButtonName, setImageUploadButtonName] = useState("Upload image");

  const { name, success, error, image, buttonText } = state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value, error: "", success: "" });
  };

  const handleContent = (e) => {
    setContent(e);
    setState({ ...state, success: "", error: "" });
  };

  const handleImage = (e) => {
    let fileInput = false;
    if (e.target.files[0]) {
      fileInput = true;
    }

    setImageUploadButtonName(e.target.files[0].name);

    // setState({ ...state, image: e.target.files[0], success: "", error: "" });

    //resize image
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          // console.log(uri);
          setState({ ...state, image: uri, success: "", error: "" });
        },
        "base64"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Creating" });

    //#region using formData
    /* 
    const formData = process.browser && new FormData();
    formData.append("name", name);
    formData.append("content", content);
    formData.append("image", image);
    */
    //#endregion

    //ajax
    try {
      const { data } = await axios.post(
        `${API}/category`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setImageUploadButtonName("Upload image");

      setState({
        ...state,
        name: "",
        buttonText: "Created",
        success: `${data.name} is created`,
        image: "",
        error: "",
      });

      setContent("");
      setImageUploadButtonName("Upload image");

      // console.log(data);
    } catch (error) {
      const errMsg = error.response?.data.error || "Sever Error";
      setState({
        ...state,
        buttonText: "Create",
        error: errMsg,
      });
    }
  };

  const createCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      {/* basic input */}
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          className="form-control"
          type="text"
          name="name"
          value={name}
          required
          onChange={handleChange}
        />
      </div>

      {/* rich text editor --react-quill */}
      <div className="form-group">
        <label className="text-muted">Content</label>
        <ReactQuill
          value={content}
          onChange={handleContent}
          placeholder="Write something... "
          // theme="bubble"
          theme="snow"
          className="pb-5 mb-3"
          style={{ border: "1px solid #666" }}
        />
      </div>

      {/* image upload */}
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadButtonName}
          <input
            onChange={handleImage}
            type="file"
            accept="image/*"
            className="form-control"
            hidden
          />
        </label>
      </div>

      <div>
        <button className="btn my-button-inverted">{buttonText}</button>
      </div>
    </form>
  );

  return (
    <>
      {HeadSEO("Create Category")}
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h1 className="my-text">Create Category</h1>
          <br />
          {success && showSuccessMessage(success)}
          {error && showErrorMessage(error)}
          {createCategoryForm()}
        </div>
      </div>
    </>
  );
};

export default withAdmin(CreateCategory);
