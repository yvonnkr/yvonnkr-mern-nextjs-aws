import axios from "axios";
import { API } from "../config";
import { getCookie } from "../helpers/auth";

//HOC --a function that takes in a Component returns a new Component

const withAdmin = (Page) => {
  //the new component
  const WithAdminUser = (props) => {
    return <Page {...props} />;
  };

  //static menthod getInitialProps
  WithAdminUser.getInitialProps = async (context) => {
    const token = getCookie("token", context.req);
    let user = null;

    //ajax
    if (token) {
      try {
        const response = await axios.get(`${API}/admin`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        });
        user = response.data;
      } catch (error) {
        if (error.response.status === 401) {
          user = null;
        }
      }
    }

    //redirect or return props {}
    if (user === null) {
      // redirect
      context.res.writeHead(302, {
        Location: "/",
      });
      context.res.end();
    } else {
      // return props;
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        user,
        token,
      };
    }
  };

  //return the new component
  return WithAdminUser;
};

export default withAdmin;
