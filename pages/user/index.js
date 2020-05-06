import React from "react";
import withUser from "../withUser";

const User = ({ user, token }) => {
  return (
    <div>
      <h1>Hello User</h1>
      <pre>{JSON.stringify({ user, token }, null, 4)}</pre>
    </div>
  );
};

//#region Before withUser HOC

// User.getInitialProps = async (context) => {
//   const token = getCookie("token", context.req);

//   let user = null;

//   //ajax req
//   if (token) {
//     try {
//       const { data } = await axios.get(`${API}/user`, {
//         headers: {
//           // authorization: `Bearer ${tokenValue}`,
//           authorization: `Bearer ${token}`,
//         },
//       });

//       user = data;
//     } catch (error) {
//       const errMsg = error.response.data.error || "Server Error";
//       if (errMsg) {
//         user = null;
//       }
//     }
//   }

//   if (user === null) {
//     // redirect
//     context.res.writeHead(302, {
//       Location: "/",
//     });
//     context.res.end();
//   } else {
//     return {
//       // ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
//       user,
//       token,
//     };
//   }

// };

//#endregion

export default withUser(User);
