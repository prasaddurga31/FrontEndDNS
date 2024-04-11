import React from "react";
import "./style.css";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SignUp() {
  let [Type, setType] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const HandleInput = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    axios
      .post("https://zany-lime-piranha-shoe.cyclic.app/user/signup", userData)
      .then((e) => {
        console.log(e);
        if (e.data.existed == true) alert("Account Already Exists");
        if (e.data?.createdAt) {
          window.location.pathname = "/signin";
        }
      })
      .catch((e) => {
        console.log(e);
        alert("Failed to signup");
      });
  };
  return (
    <>
      <div className="form-outer">
        <form className="form" onSubmit={HandleSubmit}>
          <h3 className="head-sign">SIGN UP</h3>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Full Name
            </label>
            <input
              type="text"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="name"
              onChange={HandleInput}
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">
              Email address
            </label>
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="email"
              onChange={HandleInput}
            />
          </div>
          <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">
              Password
            </label>
            <input
              type={Type ? "text" : "password"}
              class="form-control"
              id="exampleInputPassword1"
              name="password"
              onChange={HandleInput}
            />
          </div>
          <div class="mb-3 form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="exampleCheck1"
              onChange={() => setType(!Type)}
            />
            <label class="form-check-label" for="exampleCheck1">
              Show Password
            </label>
          </div>
          <button type="submit" class="btn btn-primary">
            SignUp
          </button>
          <hr />
          <p className="text-center">
            Account Exists? <Link to="/signin">Signin </Link>
          </p>
        </form>
      </div>
    </>
  );
}
