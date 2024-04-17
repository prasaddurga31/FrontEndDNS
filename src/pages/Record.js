import React, { useState, useEffect } from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import "./style.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import empty from "../Images/Empty_Page.jpg";
import Loader from "./Loader";

export default function Record() {
  let { id } = useParams();
  id = "/hostedzone/" + id.substring(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [Records, setRecords] = useState([]);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    Type: "",
    value: "",
    TTL: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      console.log(formData);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://zany-lime-piranha-shoe.cyclic.app/DNS/dns/ui?token=${token}`,
        {
          ...formData,
          hostedZoneId: id,
        }
      );
      setMessage("Record created successfully.");

      alert("Record Created");
      await fetchData();
      console.log(response.data);
    } catch (error) {
      setMessage("Failed to create record.");
      console.error(error);
      alert("Failed to Created Record");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://zany-lime-piranha-shoe.cyclic.app/DNS/dns/records?token=${token}&hostedZoneId=${id}`
      );
      setRecords([...response.data]);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    setLoading(true);
    if (!file) {
      alert("Please select a file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `https://zany-lime-piranha-shoe.cyclic.app/DNS/dns/json?token=${token}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully:", response.data);
      await fetchData();
      closeModal();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (domain) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `https://zany-lime-piranha-shoe.cyclic.app/DNS/dns/record?token=${token}&recordName=${domain.Name}&recordType=${domain.Type}&hostedZoneId=${id}&`,
        { data: domain }
      );
      await fetchData();
    } catch (error) {
      setError("Failed to delete domain. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage?.getItem("token") == undefined)
      window.location.pathname = "/signin";
    fetchData();
  }, []);

  const closeModal = () => {
    const modal = document.getElementById("exampleModal");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    modal.classList.remove("show");
    modal.style.display = "none";
    modalBackdrop.classList.remove("show");
    document.body.classList.remove("modal-open");
  };

  const closeModal1 = () => {
    const modal = document.getElementById("exampleModal1");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    modal.classList.remove("show");
    modal.style.display = "none";
    modalBackdrop.classList.remove("show");
    document.body.classList.remove("modal-open");
  };

  return (
    <>
      <>
        {localStorage?.getItem("token") == undefined ? (
          <div></div>
        ) : (
          <>
            <Navbar />
            <div className="bg-dark text-light p-3 pt-1 pb-1  m-3 rounded">
              <strong className="m-3">
                List of Records ({Records.length})
              </strong>
              <button
                type="button"
                class="btn btn-success m-3"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                New Record (File)
              </button>
              <button
                type="button"
                class="btn btn-success m-3"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal1"
              >
                New Record
              </button>
            </div>
            <section className="p-3 table-content">
              {loading ? (
                <Loader />
              ) : (
                <div className="Add-Record">
                  <div className="table-responsive" id="Table-view">
                    <table class="table caption-top table-hover">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col"> Domain Name</th>
                          <th scope="col"> Type</th>
                          <th scope="col"> TTL</th>
                          <th scope="col"> ResourceRecords</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Records.map((domain, index) => (
                          <tr key={index}>
                            <td scope="row">{index + 1}</td>
                            <td className="domain-name-holder">
                              {domain.Name}
                            </td>
                            <td>{domain.Type}</td>
                            <td>{domain.TTL}</td>
                            <td style={{ width: "max-content" }}>
                              <>
                                {domain.ResourceRecords.map((e, index) => (
                                  <li
                                    key={index}
                                    style={{
                                      margin: "2px 0px 2px 0px",
                                      width: "fit-content",
                                      listStyleType: "none",
                                      listStylePosition: "outside",
                                    }}
                                  >
                                    {e.Value}{" "}
                                  </li>
                                ))}
                              </>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(domain)}
                              >
                                Delete Record
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
            <Footer />
          </>
        )}
      </>

      {/* --------------------Upload by File------------------------------------- */}
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Upload Values Holding File
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal} // Close modal when clicked
              ></button>
            </div>
            <div class="modal-body">
              <p>
                "In order to upload data, please ensure that the file you select
                is in JSON format. Only JSON files are accepted for uploading."
              </p>
              <div class="input-group mb-3">
                <input
                  type="file"
                  class="form-control"
                  id="inputGroupFile02"
                  onChange={handleFileChange}
                />
                <label class="input-group-text" for="inputGroupFile02">
                  Add Record
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-success"
                onClick={handleUpload}
              >
                {loading ? "Adding..." : "Add Record"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------Upload by UI----------------------------------- */}

      <div
        class="modal fade"
        id="exampleModal1"
        tabindex="-1"
        aria-labelledby="exampleModalLabel1"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header bg-dark text-light">
              <h5 class="modal-title" id="exampleModalLabel1">
                New Record
              </h5>
              <button
                type="button"
                class="btn-close bg-light"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal} // Close modal when clicked
              ></button>
            </div>
            <div class="modal-body">
              {" "}
              <form onSubmit={handleSubmit}>
                <div class="mb-3">
                  <label for="exampleInputEmail1" class="form-label">
                    Sub Domain
                  </label>
                  <input
                    name="name"
                    type="text"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div class="mb-3">
                  <label for="exampleInputPassword1" class="form-label">
                    TTL
                  </label>
                  <input
                    name="TTL"
                    type="number"
                    class="form-control"
                    id="exampleInputPassword1"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div class="mb-3">
                  <label for="exampleInputPassword1" class="form-label">
                    Record Type
                  </label>
                  <select
                    name="Type"
                    onChange={handleChange}
                    class="form-control"
                    id="exampleInputPassword1"
                  >
                    <option value="">Select Record Type</option>
                    <option value="A">A (Address) Record</option>
                    <option value="AAAA">AAAA (IPv6 Address) Record</option>
                    <option value="CNAME">CNAME (Canonical Name) Record</option>
                    <option value="MX">MX (Mail Exchange) Record</option>
                    <option value="NS">NS (Name Server) Record</option>
                    <option value="PTR">PTR (Pointer) Record</option>
                    <option value="SOA">SOA (Start of Authority) Record</option>
                    <option value="SRV">SRV (Service) Record</option>
                    <option value="TXT">TXT (Text) Record</option>
                    <option value="DNSSEC">DNSSEC</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="exampleInputPassword1" class="form-label">
                    Value
                  </label>
                  <textarea
                    name="value"
                    type="text"
                    class="form-control"
                    id="exampleInputPassword1"
                    rows={3}
                    required
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" class="btn btn-success">
                  {loading ? "Adding..." : "Add Record"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
