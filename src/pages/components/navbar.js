import React from "react";
import { FaRegUserCircle } from "react-icons/fa";
import "../style.css";
import { Link } from "react-router-dom";

export default function navbar() {
  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo03"
            aria-controls="navbarTogglerDemo03"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <a class="navbar-brand " href="#">
            <strong>
              {" "}
              <em> DNS GURU</em>
            </strong>
          </a>
          <div
            class="collapse navbar-collapse text-center"
            id="navbarTogglerDemo03"
          >
            <ul class="navbar-nav me-auto  mb-2 mb-lg-0">
              <li class="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li class="nav-item">
                <Link to="/new-domain" className="nav-link">
                  Create Hoisted Zone
                </Link>
              </li>
            </ul>
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-dark rounded p-1"
                data-bs-toggle="dropdown"
                data-bs-display="static"
                aria-expanded="false"
              >
                <FaRegUserCircle className="nav-user-icon" />
              </button>
              <ul class="dropdown-menu dropdown-menu-start dropdown-menu-lg-end">
                <li>
                  <button class="dropdown-item" type="button">
                    <b>USER:</b> {localStorage.getItem("name")}
                  </button>
                </li>
                <li>
                  <hr className="dropdown-break" />
                </li>
                <li>
                  <button
                    class="dropdown-item"
                    type="button"
                    onClick={() => {
                      localStorage.clear();
                      window.location.pathname = "/signin";
                    }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
