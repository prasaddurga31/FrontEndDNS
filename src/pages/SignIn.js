import React from "react";
import "./style.css";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SignIn() {
  let [Type, setType] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const HandleInput = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
    console.log(userData);
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    axios
      .post("https://zany-lime-piranha-shoe.cyclic.app/user/signin", userData)
      .then((e) => {
        console.log(e);
        console.log(e.data);
        if (e.data?.loginStat == true) {
          localStorage.setItem("token", e.data.token);
          localStorage.setItem("email", e.data.email);
          localStorage.setItem("name", e.data.name);

          window.location.pathname = "/";
        } else if (e.data?.loginStat == false) {
          alert("Invalid Credentials");
        }
      })
      .catch((e) => {
        console.log(e);
        alert("Failed to SignIN");
      });
  };

  return (
    <>
      <div className="form-outer">
        <form className="form" onSubmit={HandleSubmit}>
          <h3 className="head-sign">SIGN IN</h3>
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
            SignIn
          </button>
          <hr />
          <p className="text-center">
            Don't have Account? <Link to="/signup">Signup </Link>
          </p>
        </form>
      </div>
    </>
  );
}
