import React from "react";
import Link from "next/link";

import withAdmin from "../withAdmin";

const Admin = ({ user, token }) => {
  return (
    <div>
      <h1 className="my-text">Admin Dashboard</h1>
      <br />
      <div className="row">
        <div className="col-md-4">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link href="/user">
                <a className="nav-link my-text ">View Profile</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/category/create">
                <a className="nav-link my-text ">Create Category</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/category/read">
                <a className="nav-link my-text ">Manage All Categories</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/admin/link/read">
                <a className="nav-link my-text ">Manage All Links</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-8"></div>
      </div>
    </div>
  );
};

export default withAdmin(Admin);
