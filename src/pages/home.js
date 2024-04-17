import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { CiSearch } from "react-icons/ci";
import empty from "../Images/Empty_Page.jpg";
import "./style.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "./Loader";

export default function Home() {
  const [userDomains, setUserDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countZones, setCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      const response = await axios.get(
        `https://zany-lime-piranha-shoe.cyclic.app/DNS/dns?token=${token}&userId=${email}`
      );
      console.log(response.data);
      setUserDomains(response.data);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDomains = userDomains.filter((domain) =>
    domain.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (domain) => {
    let Id = domain.Id;
    let user = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `https://zany-lime-piranha-shoe.cyclic.app/DNS/dns?token=${token}&user=${user}&hostedZoneId=${Id}&`
      );

      await fetchData();
    } catch (error) {
      setError("Failed to delete domain. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const RouteToRecords = (id) => {
    id = id.split("/")[2];
    window.location.pathname = `/view-record/:${id}`;
  };

  useEffect(() => {
    if (localStorage?.getItem("token") == undefined)
      window.location.pathname = "/signin";
  }, []);

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {localStorage?.getItem("token") == undefined ? (
        <div></div>
      ) : (
        <>
          <Navbar />
          <section className="Search-holder bg-dark p-3">
            <div className="inner-Holder">
              <CiSearch className="search-icon" />
              <input
                className="search-field"
                placeholder="Enter Domain Name"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </section>
          <section className="Hoisted-zone-info">
            <div className="container-fluid p-3 bg-dark text-light">
              <div className="row">
                <div className="col-md-6">
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    Hoisted Zones: {userDomains.length}
                  </p>
                </div>
                <div className="col-md-6 text-md-end">
                  <Link to="/new-domain" className="nav-link">
                    <button className="btn btn-success">
                      Create Hoisted Zone
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="p-3 table-content">
            {loading ? (
              <Loader />
            ) : error ? (
              <div>{error}</div>
            ) : filteredDomains.length === 0 ? (
              <div className="empty-img-outer">
                <img src={empty} className="empty-img" alt="No domains found" />
                <p>No Hoisted Zones to display</p>
                <Link to="/new-domain" className="nav-link">
                  <button className="btn btn-dark">Create Hoisted Zone</button>
                </Link>
              </div>
            ) : (
              <div class="table-responsive">
                <table class="table caption-top table-hover table-responsive">
                  <caption className="text-left">
                    <strong className="title"> List of Hoisted Zones</strong>
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Domain Name</th>
                      <th scope="col">Domain Type</th>
                      <th scope="col">Records</th>
                      <th scope="col">Hoisted Zone ID</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDomains.map((domain, index) => (
                      <tr key={domain._id}>
                        <td scope="row">{index + 1}</td>
                        <td
                          className="domain-name-holder"
                          onClick={() => RouteToRecords(domain.Id)}
                        >
                          {" "}
                          <Link to="">{domain.Name}</Link>
                        </td>
                        <td>public</td>
                        <td>{domain.ResourceRecordSetCount}</td>
                        <td>{domain.Id}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(domain)}
                          >
                            Delete Zone
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <Footer />
        </>
      )}
    </>
  );
}
