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
      const response = await axios.post(
        "https://zany-lime-piranha-shoe.cyclic.app/DNS/dns/json",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully:", response.data);
      // Refetch the data after successful upload
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
      // Refetch the data after successful delete
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

  return (
    <>
      <>
        {localStorage?.getItem("token") == undefined ? (
          <div></div>
        ) : (
          <>
            <Navbar />
            <section className="p-3 table-content">
              {loading ? (
                <Loader />
              ) : (
                <div class="table-responsive">
                  <div className="">
                    {" "}
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      style={{ float: "right" }}
                    >
                      New Record
                    </button>
                  </div>

                  <table class="table caption-top table-hover table-responsive">
                    <caption className="text-left">
                      <strong className="title">
                        List of Records({Records.length})
                      </strong>
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Domain Name</th>
                        <th scope="col">Type</th>
                        <th scope="col">TTL</th>
                        <th scope="col">ResourceRecords</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Records.map((domain, index) => (
                        <tr key={index}>
                          <td scope="row">{index + 1}</td>
                          <td className="domain-name-holder">{domain.Name}</td>
                          <td>{domain.Type}</td>
                          <td>{domain.TTL}</td>
                          <td>
                            {domain.ResourceRecords.map((e, index) => (
                              <span key={index}>
                                {e.Value} <b>|</b>{" "}
                              </span>
                            ))}
                          </td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDelete(domain)}
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
                  Upload
                </label>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={closeModal} // Close modal when clicked
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
