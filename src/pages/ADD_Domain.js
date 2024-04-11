import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import "./style.css";
import axios from "axios";

export default function ADD_Domain() {
  useEffect(() => {
    if (localStorage?.getItem("token") == undefined)
      window.location.pathname = "/signin";
  }, []);
  const [DomainInfo, setDomainInfo] = useState({
    DomainName: "",
    Type: "",
  });
  const HandleInput = (e) => {
    setDomainInfo({
      ...DomainInfo,
      [e.target.name]: e.target.value,
    });
    console.log(DomainInfo);
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    DomainInfo.DomainName.toLowerCase();

    axios
      .post("https://zany-lime-piranha-shoe.cyclic.app/DNS/dns", {
        ...DomainInfo,
        token: localStorage.getItem("token") || "",
      })
      .then((e) => {
        console.log(e.data);
        if (e.data?.Stat == true) {
          window.location.pathname = "/";
        } else if (e.data?.Stat == false) {
          alert("Failed to ADD or Already Domain Exists");
        }
        console.log(e);
      })
      .catch((e) => {
        console.log(e);
        alert("Failed to ADD");
      });
  };
  return (
    <>
      {localStorage?.getItem("token") == undefined ? (
        <div></div>
      ) : (
        <>
          <Navbar />
          <section className="Domain-form-outer">
            <h2 className="head">DNS ADDER</h2>
            <p className="DNS-para">
              Route 53 works by translating domain names into IP addresses so
              that computers can communicate with each other. For example, when
              a user enters a domain name into a browser, the ISP routes the
              request to a DNS resolver, which converts the domain name into an
              IP address. The DNS resolver then forwards the request to a DNS
              root name server, which is then directed to the Top Level Domain
              (TLD) server and ultimately, to Route 53. Route 53 then configures
              itself to route internet traffic to the servers hosting the domain
              name.
            </p>
            <br />
            <hr />
            <form className="Domain-form-inner" onSubmit={HandleSubmit}>
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">
                  Domain Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  name="DomainName"
                  onChange={HandleInput}
                />
              </div>
              <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">
                  Domain Type
                </label>
                <select
                  class="form-select"
                  aria-label="Default select example"
                  name="Type"
                  onChange={HandleInput}
                >
                  <option selected>Select Type</option>
                  <option value="A (Address)">A (Address)</option>
                  <option value="AAAA (IPv6 Address)">
                    AAAA (IPv6 Address){" "}
                  </option>
                  <option value="CNAME (Canonical Name)">
                    CNAME (Canonical Name)
                  </option>
                  <option value="MX (Mail Exchange)">MX (Mail Exchange)</option>
                  <option value="NS (Name Server)">NS (Name Server)</option>
                  <option value="PTR (Pointer)">PTR (Pointer)</option>
                  <option value="SOA (Start of Authority)">
                    SOA (Start of Authority)
                  </option>
                  <option value="SRV (Service)">SRV (Service)</option>
                  <option value="TXT (Text)">TXT (Text)</option>
                  <option value="DNSSEC">DNSSEC</option>
                </select>
              </div>

              <button type="submit" class="btn btn-primary">
                ADD DOMAIN
              </button>
            </form>
          </section>
          <Footer />
        </>
      )}
    </>
  );
}
