import { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Resizer from "react-image-file-resizer";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

import { showSuccessMessage, showErrorMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import withAdmin from "../../withAdmin";
import { HeadSEO } from "./../../../components/HeadSEO";

const UpdateCategory = ({ oldCategory, token }) => {
  const [state, setState] = useState({
    name: oldCategory.name,
    error: "",
    success: "",
    buttonText: "Update",
    imagePreview: oldCategory.image.url,
    image: "",
  });

  const [content, setContent] = useState(oldCategory.content);
  const [imageUploadButtonName, setImageUploadButtonName] = useState(
    "Update image"
  );

  const { name, success, error, image, buttonText, imagePreview } = state;

  const handleChange = (name) => (e) => {
    setState({ ...state, [name]: e.target.value, error: "", success: "" });
  };

  const handleContent = (e) => {
    setContent(e);
    setState({ ...state, success: "", error: "" });
  };

  const handleImage = (event) => {
    let fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
    }
    setImageUploadButtonName(event.target.files[0].name);

    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          setState({ ...state, image: uri, success: "", error: "" });
        },
        "base64"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, buttonText: "Updating" });

    try {
      const response = await axios.put(
        `${API}/category/${oldCategory.slug}`,
        { name, content, image },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setState({
        ...state,
        imagePreview: response.data.image.url,
        success: `${response.data.name} is updated`,
      });

      setContent(response.data.content);
    } catch (error) {
      const errMsg = error.response?.data.error || "server error";
      setState({
        ...state,
        buttonText: "Create",
        error: errMsg,
      });
    }
  };

  const updateCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange("name")}
          value={name}
          type="text"
          className="form-control"
          required
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Content</label>
        <ReactQuill
          value={content}
          onChange={handleContent}
          placeholder="Write something..."
          theme="snow"
          className="pb-5 mb-3"
          style={{ border: "1px solid #666" }}
        />
      </div>
      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {imageUploadButtonName}{" "}
          <span>
            <img src={imagePreview} alt="image" height="20" />
          </span>
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
      {HeadSEO("Update Category")}
      <div>
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <h1 className="my-text">Update category</h1>
            <br />
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {updateCategoryForm()}
          </div>
        </div>
      </div>
    </>
  );
};

UpdateCategory.getInitialProps = async ({ req, query, token }) => {
  try {
    const { data } = await axios.get(`${API}/category/${query.slug}`);

    return { oldCategory: data.category, token };
  } catch (error) {
    return { oldCategory: [], token };
  }
};

export default withAdmin(UpdateCategory);
