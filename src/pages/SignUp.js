import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./style.css";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    axios
      .post("https://zany-lime-piranha-shoe.cyclic.app/user/signup", userData)
      .then((response) => {
        if (response.data.existed) {
          alert("Account already exists");
        } else if (response.data.createdAt) {
          window.location.pathname = "/signin";
        }
      })
      .catch((error) => {
        console.error("Failed to signup:", error);
        alert("Failed to signup");
      })
      .finally(() => {
        setLoading(false); // Stop loading
      });
  };

  return (
    <div className="form-outer">
      <form className="form" onSubmit={handleSubmit}>
        <h3 className="head-sign">SIGN UP</h3>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            id="password"
            name="password"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="showPassword"
            onChange={() => setShowPassword(!showPassword)}
          />
          <label className="form-check-label" htmlFor="showPassword">
            Show Password
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <hr />
        <p className="text-center">
          Already have an account? <Link to="/signin">signin</Link>
        </p>
      </form>
    </div>
  );
}
