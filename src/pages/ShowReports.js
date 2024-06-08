import React from "react";
import adminLayout from "../hoc/adminLayout";
import { db } from "../firebase-config"; // Update this with the correct path
import { collection, addDoc } from "firebase/firestore"; // Import addDoc for adding documents
import { onSnapshot } from "firebase/firestore";
import { format } from 'date-fns'; // Import date-fns for date formatting
import DatePicker from "react-datepicker"; // Import DatePicker for time picker
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles

class ShowReports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reports: [],
            showForm: false,
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
        const reportsRef = collection(db, "reports");
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
        try {
            await addDoc(collection(db, "reports"), this.state.newReport);
            this.setState({ 
                newReport: { cropType: '', location: '', suggestion: '', time: new Date(), title: '' },
                showForm: false 
            });
        } catch (error) {
            console.error("Error adding report: ", error);
        }
    }

    render() {
        const { reports, showForm, newReport } = this.state;
    
        return (
            <div className="container">
                <div className="row">
                    {reports.map(report => (
                        <div className="col-md-4 mb-4" key={report.id}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{report.cropType}</h5>
                                    <p className="card-text">{report.description}</p>
                                    <p className="card-text"><strong>Suggestion:</strong> {report.suggestion}</p>
                                    <p className="card-text"><strong>Location:</strong> {report.location}</p>
                                    {report.time && (
                                        <p className="card-text">
                                            <strong>Time:</strong> {format(new Date(report.time.seconds * 1000), 'MMMM dd, yyyy HH:mm')}
                                        </p>
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
            </div>
        );
    }
    
}

export default adminLayout(ShowReports);
