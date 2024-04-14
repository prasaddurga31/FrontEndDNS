import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import axios from "axios";
import Loader from "./Loader";

export default function ADD_Domain() {
  const [loading, setLoading] = useState(false);
  const [domainInfo, setDomainInfo] = useState({ domainName: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.pathname = "/signin";
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setDomainInfo({
      ...domainInfo,
      [name]: value.toLowerCase().trim(), // Convert domain name to lowercase and remove leading/trailing spaces
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://zany-lime-piranha-shoe.cyclic.app/DNS/dns?token=${token}`,
        {
          ...domainInfo,
          token: localStorage.getItem("token") || "",
          userId: localStorage.getItem("email"),
        }
      );

      const { data } = response;
      if (data?.Stat) {
        window.location.pathname = "/";
      } else {
        alert("Failed to ADD or Domain Already Exists");
      }
    } catch (error) {
      console.error("Error adding domain:", error);
      alert("Failed to ADD");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section className="container mt-5" style={{ minHeight: "70vh" }}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">
                  Create Your Hosted Zone
                </h2>
                <p className="card-text">
                  Welcome to our DNS Management Console! Our platform empowers
                  users to take control of their domains with ease. The current
                  page offers you the ability to create hosted zones for your
                  domains. Hosted zones are essential for directing internet
                  traffic to your servers and services.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="domainName" className="form-label">
                      Domain Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="domainName"
                      name="domainName"
                      value={domainInfo.domainName}
                      onChange={handleInput}
                      required
                      placeholder="example.com"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Create Zone"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
