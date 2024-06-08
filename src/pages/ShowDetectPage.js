import React from "react";
import adminLayout from "../hoc/adminLayout";
import { db } from "../firebase-config";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Modal, Button } from "react-bootstrap";
import "./ShowDetectPage.css"; // Import the CSS file

// Haversine function to calculate the distance
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        0.5 - Math.cos(dLat) / 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

class ShowDetectPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            detects: [],
            filteredDetects: [],
            currentPage: 1,
            detectsPerPage: 10,
            showModal: false,
            selectedDetect: null,
            filterLat: "",
            filterLon: "",
            filterRadius: 100
        };
    }

    componentDidMount() {
        const detectsRef = collection(db, "Detection");
        onSnapshot(detectsRef, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ detects: data, filteredDetects: data });
        });
    }

    handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "Detects", id));
            this.setState(prevState => ({
                detects: prevState.detects.filter(detect => detect.id !== id),
                filteredDetects: prevState.filteredDetects.filter(detect => detect.id !== id)
            }));
            console.log("Document successfully deleted!");
        } catch (error) {
            console.error("Error removing document: ", error);
        }
    };

    handleNextPage = () => {
        this.setState((prevState) => ({
            currentPage: prevState.currentPage + 1
        }));
    };

    handlePreviousPage = () => {
        this.setState((prevState) => ({
            currentPage: prevState.currentPage - 1
        }));
    };

    handleShowModal = (detect) => {
        this.setState({ showModal: true, selectedDetect: detect });
    };

    handleCloseModal = () => {
        this.setState({ showModal: false, selectedDetect: null });
    };

    handleFilterChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    applyFilter = () => {
        const { detects, filterLat, filterLon, filterRadius } = this.state;
        const filteredDetects = detects.filter(detect => {
            const distance = haversine(filterLat, filterLon, detect.latitude, detect.longitude);
            return distance <= filterRadius;
        });
        this.setState({ filteredDetects, currentPage: 1 });
    };
    // Function to fetch user's current location
    fetchLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Set latitude and longitude in the state filterLat
                this.setState({ filterLat: latitude.toString(), filterLon: longitude.toString() });
            },
            (error) => {
                console.error("Error fetching location: ", error);
                alert("Error fetching location. Please enter latitude and longitude manually.");
            }
        );
    };
    render() {
        const { filteredDetects, currentPage, detectsPerPage, showModal, selectedDetect, filterLat, filterLon, filterRadius } = this.state;
        const indexOfLastDetect = currentPage * detectsPerPage;
        const indexOfFirstDetect = indexOfLastDetect - detectsPerPage;
        const currentDetects = filteredDetects.slice(indexOfFirstDetect, indexOfLastDetect);

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <div className="filter-sidebar">
                            <h4>Filter by Location</h4>
                            <div className="mb-3">
                                <label htmlFor="filterLat" className="form-label">Latitude</label>
                                <input
                                    type="number"
                                    id="filterLat"
                                    name="filterLat"
                                    value={filterLat}
                                    onChange={this.handleFilterChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="filterLon" className="form-label">Longitude</label>
                                <input
                                    type="number"
                                    id="filterLon"
                                    name="filterLon"
                                    value={filterLon}
                                    onChange={this.handleFilterChange}
                                    className="form-control"
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={this.fetchLocation}
                            >
                                Use Current Location
                            </button>
                            <div className="mb-3">
                                <label htmlFor="filterRadius" className="form-label">Radius (km)</label>
                                <input
                                    type="number"
                                    id="filterRadius"
                                    name="filterRadius"
                                    value={filterRadius}
                                    onChange={this.handleFilterChange}
                                    className="form-control"
                                />
                            </div>
                            <button className="btn btn-primary w-100" onClick={this.applyFilter}>
                                Apply Filter
                            </button>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <h1>Show Detect</h1>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Crop Type</th>
                                    <th>Crop Age</th>
                                    <th>Crop ID</th>
                                    <th>Latitude</th>
                                    <th>Longitude</th>
                                    <th>Status</th>
                                    <th>Result</th>
                                    {/* <th>Suggestion</th> */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDetects.map((detect) => (
                                    <tr key={detect.id}>
                                        <td>{detect.cropType}</td>
                                        <td>{detect.cropAge}</td>
                                        <td>{detect.id}</td>
                                        <td>{detect.latitude}</td>
                                        <td>{detect.longitude}</td>
                                        <td>{detect.result}</td>
                                        <td>{detect.confidence.toFixed(2)}</td>
                                        <td>{detect.detectPersent}</td>
                                        {/* <td>{detect.suggestion}</td> */}
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => this.handleDelete(detect.id)}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => this.handleShowModal(detect)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-between">
                            <button
                                className="btn btn-primary"
                                onClick={this.handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={this.handleNextPage}
                                disabled={indexOfLastDetect >= filteredDetects.length}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
                {selectedDetect && (
                    <Modal show={showModal} onHide={this.handleCloseModal} style={{ height: '3000px' }}>
                        <Modal.Header closeButton>
                            <Modal.Title>Crop Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p><strong>Crop Type: </strong>{selectedDetect.cropType}</p>
                            <p><strong>Crop Age: </strong>{selectedDetect.cropAge}</p>
                            <p><strong>ID: </strong>{selectedDetect.id}</p>
                            <p><strong>Latitude: </strong>{selectedDetect.latitude}</p>
                            <p><strong>Longitude: </strong>{selectedDetect.longitude}</p>
                            <p><strong>Result: </strong>{selectedDetect.result}</p>
                            <p><strong>Confidence: </strong>{selectedDetect.confidence.toFixed(2)}</p>
                            <p><strong>Detection Percentage: </strong>{selectedDetect.detectPersent}</p>
                            <img src={selectedDetect.image} alt="Crop" style={{ width: '100%', height: 'auto' }} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleCloseModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}

            </div>
        );
    }
}

export default adminLayout(ShowDetectPage);
