import axios from "axios";
import Link from "next/link";

import { API } from "../config";

const Home = ({ categories }) => {
  const listCategories = () =>
    categories &&
    categories.map((category, index) => (
      <Link href="/links/[slug]" as={`/links/${category.slug}`} key={index}>
        <a
          style={{ border: "1px solid #563d7c", textDecoration: "none" }}
          className="bg-light p-3 col-md-4"
        >
          <div>
            <div className="row">
              <div className="col-md-5">
                <img
                  src={category.image && category.image.url}
                  alt={category.name}
                  style={{ width: "100px", height: "auto" }}
                  className="pr-3"
                />
              </div>
              <div className="col-md-7  my-text">
                <h3 style={{ textTransform: "capitalize" }}>{category.name}</h3>
              </div>
            </div>
          </div>
        </a>
      </Link>
    ));

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h1 className="my-text" style={{ textAlign: "center" }}>
            Browse Tutorials | Courses
          </h1>
          <br />
        </div>
      </div>

      <div className="row">
        {!categories && <p>server error...</p>}
        {categories && listCategories()}
      </div>
    </>
  );
};

Home.getInitialProps = async () => {
  try {
    const { data } = await axios.get(`${API}/categories`);
    return { categories: data };
  } catch (error) {
    return { categories: null };
  }
};

export default Home;
