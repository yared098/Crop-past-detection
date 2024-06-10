import React from "react";
import adminLayout from "../hoc/adminLayout";
import { db } from "../firebase-config"; // Update this with the correct path
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { format } from 'date-fns'; // Import date-fns for date formatting
import DatePicker from "react-datepicker"; // Import DatePicker for time picker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import jsPDF from 'jspdf'; // Import jsPDF

class ShowReports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            showForm: false,
            selectedCollection: 'reports',
            newReport: {
                cropType: '',
                location: '',
                suggestion: '',
                time: new Date(),
                title: ''
            }
        };
    }

    componentDidMount() {
        this.fetchReports();
    }

    fetchReports = () => {
        const { selectedCollection } = this.state;
        const reportsRef = collection(db, selectedCollection);
        onSnapshot(reportsRef, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ reports: data });
        });
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            newReport: {
                ...prevState.newReport,
                [name]: value
            }
        }));
    }

    handleTimeChange = (date) => {
        this.setState(prevState => ({
            newReport: {
                ...prevState.newReport,
                time: date
            }
        }));
    }

    handleFormSubmit = async (event) => {
        event.preventDefault();
        const { selectedCollection, newReport } = this.state;
        try {
            await addDoc(collection(db, selectedCollection), newReport);
            this.setState({ 
                newReport: { cropType: '', location: '', suggestion: '', time: new Date(), title: '' },
                showForm: false 
            });
            this.fetchReports(); // Fetch reports again after adding a new one
        } catch (error) {
            console.error("Error adding report: ", error);
        }
    }

    handleCollectionChange = (event) => {
        this.setState({ selectedCollection: event.target.value }, () => {
            this.fetchReports();
        });
    }

    generateCSV = () => {
        const { reports, selectedCollection } = this.state;
        let headers, csvRows;

        if (selectedCollection === 'reports') {
            headers = ['Title', 'Crop Type', 'Location', 'Suggestion', 'Time'];
            csvRows = reports.map(report => [
                report.title,
                report.cropType,
                report.location,
                report.suggestion,
                report.time ? format(new Date(report.time.seconds * 1000), 'MMMM dd, yyyy HH:mm') : ''
            ]);
        } else if (selectedCollection === 'farmers') {
            headers = ['Name', 'Phone Number', 'Location', 'Area', 'Device ID', 'Latitude', 'Longitude'];
            csvRows = reports.map(report => [
                report.name,
                report.phoneNumber,
                report.location,
                report.area,
                report.deviceId,
                report.latitude,
                report.longitude
            ]);
        } else if (selectedCollection === 'Detection') {
            headers = ['ID', 'Device ID', 'Crop Type', 'Crop Age', 'Crop Temp', 'Confidence', 'Result', 'Timestamp', 'Image Path', 'Latitude', 'Longitude'];
            csvRows = reports.map(report => [
                report.id,
                report.deviceId,
                report.cropType,
                report.cropAge,
                report.cropTemp,
                report.confidence,
                report.result,
                report.timestamp,
                report.imagePath,
                report.latitude,
                report.longitude
            ]);
        }

        // Create a blob from the CSV string
        const csvString = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

        // Create a link to download the CSV file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedCollection}_reports.csv`;
        link.click();
    }

    generatePDF = () => {
        const { reports, selectedCollection } = this.state;
        const doc = new jsPDF();
        let yOffset = 10;

        if (selectedCollection === 'reports') {
            reports.forEach((report, index) => {
                doc.text(10, yOffset, `${index + 1}. ${report.title}`);
                doc.text(10, yOffset + 10, `Crop Type: ${report.cropType}`);
                doc.text(10, yOffset + 20, `Location: ${report.location}`);
                doc.text(10, yOffset + 30, `Suggestion: ${report.suggestion}`);
                if (report.time) {
                    doc.text(10, yOffset + 40, `Time: ${format(new Date(report.time.seconds * 1000), 'MMMM dd, yyyy HH:mm')}`);
                }
                yOffset += 50;
            });
        } else if (selectedCollection === 'farmers') {
            reports.forEach((report, index) => {
                doc.text(10, yOffset, `${index + 1}. ${report.name}`);
                doc.text(10, yOffset + 10, `Phone Number: ${report.phoneNumber}`);
                doc.text(10, yOffset + 20, `Location: ${report.location}`);
                doc.text(10, yOffset + 30, `Area: ${report.area}`);
                doc.text(10, yOffset + 40, `Device ID: ${report.deviceId}`);
                doc.text(10, yOffset + 50, `Latitude: ${report.latitude}`);
                doc.text(10, yOffset + 60, `Longitude: ${report.longitude}`);
                yOffset += 70;
            });
        } else if (selectedCollection === 'Detection') {
            reports.forEach((report, index) => {
                doc.text(10, yOffset, `${index + 1}. ID: ${report.id}`);
                doc.text(10, yOffset + 10, `Device ID: ${report.deviceId}`);
                doc.text(10, yOffset + 20, `Crop Type: ${report.cropType}`);
                doc.text(10, yOffset + 30, `Crop Age: ${report.cropAge}`);
                doc.text(10, yOffset + 40, `Crop Temp: ${report.cropTemp}`);
                doc.text(10, yOffset + 50, `Confidence: ${report.confidence}`);
                doc.text(10, yOffset + 60, `Result: ${report.result}`);
                doc.text(10, yOffset + 70, `Timestamp: ${report.timestamp}`);
                doc.text(10, yOffset + 80, `Image Path: ${report.imagePath}`);
                doc.text(10, yOffset + 90, `Latitude: ${report.latitude}`);
                doc.text(10, yOffset + 100, `Longitude: ${report.longitude}`);
                yOffset += 110;
            });
        }

        doc.save(`${selectedCollection}_reports.pdf`);
    }

    render() {
        const { reports, showForm, newReport, selectedCollection } = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <select 
                            className="form-control" 
                            value={selectedCollection} 
                            onChange={this.handleCollectionChange}
                        >
                            <option value="reports">Reports</option>
                            <option value="farmers">Farmer</option>
                            <option value="Detection">Detection</option>
                        </select>
                    </div>
                    {reports.map(report => (
                        <div className="col-md-4 mb-4" key={report.id}>
                            <div className="card">
                                <div className="card-body">
                                    {selectedCollection === 'reports' && (
                                        <>
                                            <h5 className="card-title">{report.title}</h5>
                                            <p className="card-text"><strong>Crop Type:</strong> {report.cropType}</p>
                                            <p className="card-text"><strong>Location:</strong> {report.location}</p>
                                            <p className="card-text"><strong>Suggestion:</strong> {report.suggestion}</p>
                                            {report.time && (
                                                <p className="card-text">
                                                    <strong>Time:</strong> {format(new Date(report.time.seconds * 1000), 'MMMM dd, yyyy HH:mm')}
                                                </p>
                                            )}
                                        </>
                                    )}
                                    {selectedCollection === 'farmers' && (
                                        <>
                                            <h5 className="card-title">{report.name}</h5>
                                            <p className="card-text"><strong>Phone Number:</strong> {report.phoneNumber}</p>
                                            <p className="card-text"><strong>Location:</strong> {report.location}</p>
                                            <p className="card-text"><strong>Area:</strong> {report.area}</p>
                                            <p className="card-text"><strong>Device ID:</strong> {report.deviceId}</p>
                                            <p className="card-text"><strong>Latitude:</strong> {report.latitude}</p>
                                            <p className="card-text"><strong>Longitude:</strong> {report.longitude}</p>
                                        </>
                                    )}
                                    {selectedCollection === 'Detection' && (
                                        <>
                                            <h5 className="card-title">ID: {report.id}</h5>
                                            <p className="card-text"><strong>Device ID:</strong> {report.deviceId}</p>
                                            <p className="card-text"><strong>Crop Type:</strong> {report.cropType}</p>
                                            <p className="card-text"><strong>Crop Age:</strong> {report.cropAge}</p>
                                            <p className="card-text"><strong>Crop Temp:</strong> {report.cropTemp}</p>
                                            <p className="card-text"><strong>Confidence:</strong> {report.confidence}</p>
                                            <p className="card-text"><strong>Result:</strong> {report.result}</p>
                                            <p className="card-text"><strong>Timestamp:</strong> {report.timestamp}</p>
                                            <p className="card-text"><strong>Image Path:</strong> {report.imagePath}</p>
                                            <p className="card-text"><strong>Latitude:</strong> {report.latitude}</p>
                                            <p className="card-text"><strong>Longitude:</strong> {report.longitude}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        right: "20px",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        fontSize: "24px",
                        cursor: "pointer"
                    }}
                    onClick={() => this.setState({ showForm: true })}
                >
                    +
                </button>

                {showForm && (
                    <div style={{
                        position: "fixed",
                        top: "200px",
                        right: "20px",
                        width: "300px",
                        padding: "20px",
                        backgroundColor: "#fff",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000
                    }}>
                        <h4>Add Report</h4>
                        <form onSubmit={this.handleFormSubmit}>
                            <div className="form-group">
                                <label>Title</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="title" 
                                    value={newReport.title} 
                                    onChange={this.handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Crop Type</label>
                                <select 
                                    className="form-control" 
                                    name="cropType" 
                                    value={newReport.cropType} 
                                    onChange={this.handleInputChange} 
                                    required
                                >
                                    <option value="">Select Crop Type</option>
                                    <option value="corn">Corn</option>
                                    <option value="maize">Maize</option>
                                    {/* Add more crop types as needed */}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="location" 
                                    value={newReport.location} 
                                    onChange={this.handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Suggestion</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="suggestion" 
                                    value={newReport.suggestion} 
                                    onChange={this.handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Time</label>
                                <DatePicker 
                                    selected={newReport.time} 
                                    onChange={this.handleTimeChange} 
                                    showTimeSelect 
                                    dateFormat="MMMM d, yyyy h:mm aa" 
                                    className="form-control"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                            <button type="button" className="btn btn-danger" onClick={() => this.setState({ showForm: false })}>Close</button>
                        </form>
                    </div>
                )}
                <button 
                    style={{
                        position: "fixed",
                        bottom: "90px",
                        right: "20px",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                    onClick={this.generateCSV}
                >
                    Export CSV
                </button>
                <button 
                    style={{
                        position: "fixed",
                        bottom: "160px",
                        right: "20px",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                    onClick={this.generatePDF}
                >
                    Export PDF
                </button>
            </div>
        );
    }
}

export default adminLayout(ShowReports);
