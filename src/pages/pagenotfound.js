import React from "react";
import "./style.css";
import img from "../Images/notfound.jpg";
import { Link } from "react-router-dom";

export default function pagenotfound() {
  return (
    <>
      <div className="outer-pgnot">
        <img src={img} alt="PageNotFound" className="pagenotfound" />
        <Link to="/">
          {" "}
          <button className="btn btn-md btn-primary">Home</button>
        </Link>
      </div>
    </>
  );
}
