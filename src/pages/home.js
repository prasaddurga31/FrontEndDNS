import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { CiSearch } from "react-icons/ci";
import empty from "../Images/Empty_Page.jpg";
import "./style.css";
import axios from "axios";

export default function Home() {
  const [userDomains, setUserDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://zany-lime-piranha-shoe.cyclic.app/DNS/dns/${localStorage.getItem(
          "token"
        )}`
      );
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
    domain.DomainName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(
        `https://zany-lime-piranha-shoe.cyclic.app/DNS/dns/${localStorage.getItem(
          "token"
        )}/${id}`
      );
      if (response.data.delStat) {
        fetchData();
      }
    } catch (error) {
      setError("Failed to delete domain. Please try again later.");
    } finally {
      setLoading(false);
    }
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
          <section className="p-3 table-content">
            {loading ? (
              <div className="text-center ">
                <h4>Loading...</h4>
              </div>
            ) : error ? (
              <div>{error}</div>
            ) : filteredDomains.length === 0 ? (
              <img src={empty} className="empty-img" alt="No domains found" />
            ) : (
              <div class="table-responsive">
                <table class="table caption-top table-hover table-responsive">
                  <caption className="text-center">
                    <h4> List of Domains</h4>
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Domain Name</th>
                      <th scope="col">Domain Type</th>
                      <th scope="col">Manage Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDomains.map((domain, index) => (
                      <tr key={domain._id}>
                        <td scope="row">{index + 1}</td>
                        <td className="domain-name-holder">
                          {domain.DomainName}
                        </td>
                        <td>{domain.Type}</td>
                        <td>
                          <button className="btn btn-secondary m-2">
                            Edit
                          </button>
                          <button
                            className="btn btn-danger m-2"
                            onClick={() => handleDelete(domain._id)}
                          >
                            Delete
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
