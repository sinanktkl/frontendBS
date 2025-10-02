import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Card,
  Button,
  Spinner,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import {
  GetBrongoListApi,
  DeleteBrongoApi,
  UpdateBrongoApi,
} from "../Services/allApi";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaClock, FaSearch } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import './View.css' 

function View() {
  const searchInputRef = useRef(null);
  const [brongoList, setBrongoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBrongo, setEditBrongo] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const searchTimeout = useRef(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role || null);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const fetchBrongoList = async (search = "") => {
    try {
      setLoading(true);
      const result = await GetBrongoListApi(search);
      if (result.status === 200) {
        setBrongoList(result.data);
      } else {
        toast.warn("Failed to fetch brongos");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrongoList();
  }, []);

  // ✅ Delete with confirmation
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const result = await DeleteBrongoApi(id);
        if (result.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Brongo entry has been deleted.",
            timer: 1500,
            showConfirmButton: false,
          });
          fetchBrongoList(searchKey);
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: "Delete failed",
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
    }
  };

  const handleEdit = (brongo) => {
    setEditBrongo({
      ...brongo,
      date: brongo.date ? new Date(brongo.date) : null,
      time: brongo.time ? new Date(brongo.time) : null,
    });
    setShowEditModal(true);
  };

  // ✅ Update with success message
  const handleUpdate = async () => {
    try {
      const payload = {
        ...editBrongo,
        date: editBrongo.date ? editBrongo.date.toISOString() : null,
        time: editBrongo.time ? editBrongo.time.toISOString() : null,
      };
      const result = await UpdateBrongoApi(editBrongo._id, payload);
      if (result.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Brongo entry has been updated.",
          timer: 1500,
          showConfirmButton: false,
        });
        setShowEditModal(false);
        fetchBrongoList(searchKey);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Update failed",
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKey(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchBrongoList(value);
    }, 500);
  };

  return (
    <div className="lng">


    <Container fluid className="mt-5 mb-5">
      <a
        href="/home"
        className="fw-bold d-inline-flex align-items-center mb-4 ms-1"
        style={{ textDecoration: "none" , color:'#be5635' }}
      >
        <i className="fa-solid fa-arrow-left me-2"></i> Back
      </a>

      <h1 className="mainhead text-center fw-bolder mb-4">
        Bronchoscope Entries
      </h1>

      {/* <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-dark mb-0">
          Total Patients: <span className="fw-bold">{brongoList.length}</span>
        </p>

        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by ID-Name-Scope-location-staff-doctor"
            value={searchKey}
            onChange={handleSearchChange}
            style={{
              width: showSearch ? "450px" : "0px",
              opacity: showSearch ? 1 : 0,
              transition: "all 0.3s ease",
              borderRadius: "5px",
              padding: showSearch ? "0.375rem 0.75rem" : "0",
              overflow: "hidden",
            }}
          />
          <Button
            variant="info"
            onClick={() => setShowSearch(!showSearch)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaSearch />
          </Button>
        </div>
<InputGroup className="w-100 w-md-auto">
  <Form.Control
    type="text"
    placeholder="Search..."
    value={searchKey}
    onChange={handleSearchChange}
  />
  <Button variant="info">
    <FaSearch />
  </Button>
</InputGroup>

      </div> */}

<div className="top-bar">
  {/* Total Patients */}
  <p>
    Total Patients: <span>{brongoList.length}</span>
  </p>

  {/* Search Box */}
  <div className="search-box d-flex">
  <div className="animated-placeholder flex-grow-1">
    <input
      ref={searchInputRef}
      aria-label="Search"
      type="text"
      value={searchKey}
      onChange={handleSearchChange}
      onFocus={(e) => (e.target.nextSibling.style.display = "none")}
      onBlur={(e) => {
        if (!e.target.value) e.target.nextSibling.style.display = "block";
      }}
    />
    <span>Search by ID - Name - Scope - Location - Staff - Doctor</span>
  </div>
  
  <Button 
    aria-label="Search" 
    onClick={() => searchInputRef.current?.focus()}
  >
    <FaSearch />
  </Button>
</div>


</div>

      <Card className="shadow-lg p-3">
        {loading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "200px" }}
          >
            <Spinner animation="border" variant="info" />
          </div>
        ) : (
          <div className="table-responsive">
            {/* <table className="table table-striped table-bordered align-middle text-center mb-0"> */}
            <table className="table-custom align-middle text-center mb-0">
              <thead className="table-info">
                <tr>
                  <th>#</th>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Scope Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Sample</th>
                  <th>Sample Result</th>
                  <th>RT Staff Name</th>
                  <th>Doctor Name</th>
                  {role !== "user" && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {brongoList.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="text-center py-3">
                      No entries found
                    </td>
                  </tr>
                ) : (
                  brongoList.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>
                      <td>{item.patientId}</td>
                      <td>{item.patientName}</td>
                      <td>{item.scopeName}</td>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>
                        {new Date(item.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>{item.location}</td>
                      <td>{item.sample}</td>
                      <td>{item.sampleResult}</td>
                      <td>{item.RT_Staff}</td>
                      <td>{item.doctorName}</td>

                      {role !== "user" && (
                        <td style={{ height: "100%", verticalAlign: "middle" }}>
                          <div
                            className="d-flex align-items-center justify-content-center gap-2 action-buttons"
                            style={{ height: "100%" }}
                          >
                            <Button
                              size="sm"
                              variant="info"
                              onClick={() => handleEdit(item)}
                              className="d-flex align-items-center justify-content-center"
                              style={{ height: "32px", width: "32px" }}
                            >
                              <i className="fa-solid fa-pen-to-square"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(item._id)}
                              className="d-flex align-items-center justify-content-center"
                              style={{ height: "32px", minWidth: "60px" }}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        // size="lg"
         fullscreen="sm-down"
      >
        <Modal.Header closeButton>
          <Modal.Title  style={{color:"#be5635"}} className=" fw-bolder">
            Edit Scope
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="p-3 shadow-sm">
            <Form>
              <Row className="g-4">
                {/* Left Column */}
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Patient ID</Form.Label>
                    <Form.Control
                      type="text"
                      value={editBrongo.patientId || ""}
                      onChange={(e) =>
                        setEditBrongo({
                          ...editBrongo,
                          patientId: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Patient Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editBrongo.patientName || ""}
                      onChange={(e) =>
                        setEditBrongo({
                          ...editBrongo,
                          patientName: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Scope Name</Form.Label>
                    <Form.Control
                      type="text"
                      style={{ textTransform: "capitalize" }}
                      value={editBrongo.scopeName || ""}
                      onChange={(e) =>
                        setEditBrongo({
                          ...editBrongo,
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
                          <FaCalendarAlt className="me-2 "  style={{color:"#be5635"}} />
                          <DatePicker
                            selected={editBrongo.date}
                            onChange={(d) =>
                              setEditBrongo({ ...editBrongo, date: d })
                            }
                            placeholderText="Select Date"
                            dateFormat="dd-MM-yyyy"
                            className="form-control border-0"
                          />
                        </div>
                      </div>

                      <div className="flex-fill">
                        <Form.Label className="fw-bold">Time</Form.Label>
                        <div className="d-flex align-items-center border rounded p-2">
                          <FaClock className="me-2 " style={{color:"#be5635"}} />
                          <DatePicker
                            selected={editBrongo.time}
                            onChange={(t) =>
                              setEditBrongo({ ...editBrongo, time: t })
                            }
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

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Location</Form.Label>
                    <Form.Select
                      value={editBrongo.location || ""}
                      onChange={(e) =>
                        setEditBrongo({
                          ...editBrongo,
                          location: e.target.value.toUpperCase(),
                        })
                      }
                    >
                      <option value="" disabled>
                        Select Location
                      </option>
                      <option value="MICU1">MICU1</option>
                      <option value="MICU2">MICU2</option>
                      <option value="MICU3">MICU3</option>
                      <option value="MICU4">MICU4</option>
                      <option value="MHDU">MHDU</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {/* Right Column */}
                <Col xs={12} md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Sample</Form.Label>
                    <Form.Select
                      value={editBrongo.sample || ""}
                      onChange={(e) => {
                        const sample = e.target.value;
                        setEditBrongo({
                          ...editBrongo,
                          sample,
                          sampleResult:
                            sample === "Not Taken" ? "Not Taken" : "",
                        });
                      }}
                    >
                      <option value="Not Taken">Not Taken</option>
                      <option value="Sample Taken">Sample Taken</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Sample Result</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={editBrongo.sampleResult || ""}
                      disabled={editBrongo.sample !== "Sample Taken"}
                      onChange={(e) =>
                        setEditBrongo({
                          ...editBrongo,
                          sampleResult: e.target.value.toUpperCase()
                        })
                      }
                      style={{
                        minHeight: "125px",
                        resize: "none",
                        overflow: "hidden",
                      }}
                      onInput={(e) => {
                        e.target.style.height = "38px";
                        e.target.style.height = e.target.scrollHeight + "px";
                      }}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">RT Staff</Form.Label>
                    <Form.Control
                      type="text"
                      value={editBrongo.RT_Staff || ""}
                      onChange={(e) =>
                        setEditBrongo({
                          ...editBrongo,
                          RT_Staff: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Doctor Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editBrongo.doctorName || ""}
                      onChange={(e) =>
                        setEditBrongo({
                          ...editBrongo,
                          doctorName: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button style={{backgroundColor:"#be5635", borderColor:"#be5635"}} onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
}

export default View;
