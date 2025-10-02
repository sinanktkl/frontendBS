import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock } from "react-icons/fa";
import { AddBrongoApi } from "../Services/allApi";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import './Home.css'


function Home() {
  const [role, setRole] = useState(null);

  const [addBrongo, setAddBrongo] = useState({
    patientId: "",
    patientName: "",
    scopeName: "",
    date: "",
    time: "",
    location: "",
    sample: "Not Taken",
    sampleResult: "Not Taken",
    RT_Staff: "",
    doctorName: "",
  });

  const handleAddBrongoDetails = async () => {
    const {
      patientId,
      patientName,
      scopeName,
      date,
      time,
      location,
      sample,
      sampleResult,
      RT_Staff,
      doctorName,
    } = addBrongo;

    // Validate fields
    if (
      !patientId ||
      !patientName ||
      !scopeName ||
      !date ||
      !time ||
      !location ||
      !sample ||
      (sample === "Sample Taken" && !sampleResult) ||
      !RT_Staff ||
      !doctorName
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill the missing fields",
      });
      return;
    }

    try {
      const result = await AddBrongoApi(addBrongo);
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Added Successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        setAddBrongo({
          patientId: "",
          patientName: "",
          scopeName: "",
          date: "",
          time: "",
          location: "",
          sample: "Not Taken",
          sampleResult: "Not Taken",
          RT_Staff: "",
          doctorName: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Data Not Added",
          text: "Something went wrong",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    }
  };

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userRole = decoded.role || null;
        setRole(userRole);

        if (userRole === "user") {
          setAddBrongo((prev) => ({
            ...prev,
            sampleResult:
              prev.sample === "Sample Taken" ? "Taken" : prev.sampleResult,
          }));
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, [token]);

  return (
    <>
      <div className="lng">
        <Container className="mt-5 ">
          <h1 className="mb-5 text-center  fw-bolder" style={{ color: "#be5635" }}>
            Bronchoscope Sample Collection
          </h1>

          <Card className="p-4 shadow-lg mb-4">
            <h5 style={{ color: "#be5635" }} className="mb-4 text-center fw-bolder fs-2">
              Add Scope
            </h5>
            <Form>
              <Row className="g-4">
                {/* Left Column */}
                <Col xs={12} md={6}>
                  {/* Patient ID */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Patient ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Patient ID"
                      value={addBrongo.patientId}
                      onChange={(e) =>
                        setAddBrongo({
                          ...addBrongo,
                          patientId: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </Form.Group>

                  {/* Patient Name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Patient Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Patient Name"
                      value={addBrongo.patientName}
                      onChange={(e) =>
                        setAddBrongo({
                          ...addBrongo,
                          patientName: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </Form.Group>

                  {/* Scope Name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Scope Name</Form.Label>
                    <Form.Control
                      style={{ textTransform: "capitalize" }}
                      type="text"
                      placeholder="Enter Scope Name"
                      value={addBrongo.scopeName}
                      onChange={(e) =>
                        setAddBrongo({
                          ...addBrongo,
                          scopeName: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </Form.Group>

                  {/* Date & Time */}
                  <Form.Group className="mb-3">
                    <div className="d-flex gap-3">
                      <div className="flex-fill">
                        <Form.Label className="fw-bold">Date</Form.Label>
                        <div className="d-flex align-items-center border rounded p-2">
                          <FaCalendarAlt className="me-2 " style={{ color: "#be5635" }} />
                          <DatePicker
                            selected={addBrongo.date}
                            onChange={(d) =>
                              setAddBrongo({ ...addBrongo, date: d })
                            }
                            onFocus={() => {
                              if (!addBrongo.date) {
                                setAddBrongo({ ...addBrongo, date: new Date() });
                              }
                            }}
                            placeholderText="Select Date"
                            dateFormat="dd-MM-yyyy"
                            className="form-control border-0"
                          />
                        </div>
                      </div>

                      <div className="flex-fill">
                        <Form.Label className="fw-bold">Time</Form.Label>
                        <div className="d-flex align-items-center border rounded p-2">
                          <FaClock className="me-2 " style={{ color: "#be5635" }} />
                          <DatePicker
                            selected={addBrongo.time}
                            onChange={(t) =>
                              setAddBrongo({ ...addBrongo, time: t })
                            }
                            onFocus={() => {
                              if (!addBrongo.time) {
                                setAddBrongo({ ...addBrongo, time: new Date() });
                              }
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            placeholderText="Select Time"
                            className="form-control border-0"
                          />
                        </div>
                      </div>
                    </div>
                  </Form.Group>

                  {/* Location */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Location</Form.Label>
                    <Form.Select
                      className="fw-bold text-dark custom-select"
                      value={addBrongo.location}
                      onChange={(e) =>
                        setAddBrongo({
                          ...addBrongo,
                          location: e.target.value.toUpperCase(),
                        })
                      }
                    >
                      <option value="" disabled className="fw-bold">
                        Select Location
                      </option>
                      <option value="MICU1" className="fw-bold">MICU1</option>
                      <option value="MICU2" className="fw-bold">MICU2</option>
                      <option value="MICU3" className="fw-bold">MICU3</option>
                      <option value="MICU4" className="fw-bold">MICU4</option>
                      <option value="MHDU" className="fw-bold">MHDU</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Right Column */}
                <Col xs={12} md={6}>
                  {/* Sample */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Sample</Form.Label>
                    <Form.Select
                      className="fw-bold text-dark"
                      value={addBrongo.sample}
                      onChange={(e) => {
                        const selectedSample = e.target.value;
                        setAddBrongo((prev) => ({
                          ...prev,
                          sample: selectedSample,
                          sampleResult:
                            role === "user" && selectedSample === "Sample Taken"
                              ? "Taken"
                              : selectedSample === "Not Taken"
                                ? "Not Taken"
                                : "",
                        }));
                      }}
                    >
                      <option value="Not Taken" className="fw-bold">Not Taken</option>
                      <option value="Sample Taken" className="fw-bold">Sample Taken</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Sample Result */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Sample Result</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="Enter result if sample taken"
                      value={addBrongo.sampleResult}
                      onChange={(e) =>
                        setAddBrongo({
                          ...addBrongo,
                          sampleResult: e.target.value.toUpperCase(),
                        })
                      }
                      disabled={
                        role === "user" || addBrongo.sample !== "Sample Taken"
                      }
                      style={{ minHeight: "125px", resize: "none", overflow: "hidden" }}
                      onInput={(e) => {
                        e.target.style.height = "38px";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                    />
                  </Form.Group>

                  {/* RT Staff */}
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">RT Staff</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Staff Name"
                      value={addBrongo.RT_Staff}
                      onChange={(e) =>
                        setAddBrongo({
                          ...addBrongo,
                          RT_Staff: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </Form.Group>

                  {/* Doctor Name */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Doctor Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Doctor Name"
                      value={addBrongo.doctorName}
                      onFocus={() => {
                        if (!addBrongo.doctorName) {
                          setAddBrongo({ ...addBrongo, doctorName: "DR. " });
                        }
                      }}
                      onChange={(e) =>
                        setAddBrongo({
                          ...addBrongo,
                          doctorName: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3 mb-2">
                <Col className="d-flex justify-content-center flex-wrap gap-3">
                  <Button
                    onClick={handleAddBrongoDetails}

                    size="md"
                    style={{ minWidth: "180px", padding: "10px 20px", backgroundColor: "#be5635", borderColor: "#be5635" }}
                    className="fw-bolder"
                  >
                    Add to List
                  </Button>

                  <Link to="/view">
                    <Button
                      size="md"
                      style={{ minWidth: "180px", padding: "10px 20px", backgroundColor: "#197368", borderColor: "#197368" }}
                      className="fw-bolder"
                    >
                      View List
                    </Button>
                  </Link>
                </Col>
              </Row>
            </Form>
          </Card>
        </Container>
      </div>
    </>
  );
}

export default Home;
