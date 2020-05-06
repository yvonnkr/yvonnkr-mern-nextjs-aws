import axios from "axios";
import { API } from "../config";
import { getCookie } from "../helpers/auth";

//HOC --a function that takes in a Component returns a new Component

const withUser = (Page) => {
  //the new component
  const WithAuthUser = (props) => {
    return <Page {...props} />;
  };

  //static menthod getInitialProps
  WithAuthUser.getInitialProps = async (context) => {
    const token = getCookie("token", context.req);
    let user = null;

    //ajax
    if (token) {
      try {
        const response = await axios.get(`${API}/user`, {
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
      // return props
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        user,
        token,
      };
    }
  };

  //return the new component
  return WithAuthUser;
};

export default withUser;
