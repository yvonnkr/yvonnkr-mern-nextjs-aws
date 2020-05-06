import React from "react";
import withAdmin from "../withAdmin";

const Admin = ({ user, token }) => {
  return (
    <div>
      <h1>Hello Admin </h1>
      <pre>{JSON.stringify({ user, token }, null, 4)}</pre>
    </div>
  );
};

export default withAdmin(Admin);
