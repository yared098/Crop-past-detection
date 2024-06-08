import React from "react";
import { db } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import adminLayout from "../hoc/adminLayout";

class AddReportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            cropType: "",
            location: "",
            suggestion: "",
            time: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { title, cropType, location, suggestion, time } = this.state;
        try {
            const docRef = await addDoc(collection(db, "reports"), {
                title,
                cropType,
                location,
                suggestion,
                time: new Date(time)
            });
            console.log("Document written with ID: ", docRef.id);
            alert("Report added successfully");

            // Reset form
            this.setState({
                title: "",
                cropType: "",
                location: "",
                suggestion: "",
                time: ""
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error adding report");
        }
    }

    render() {
        const { title, cropType, location, suggestion, time } = this.state;
        return (
            <div className="container mt-5">
                <h2>Add New Report</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">Report Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            name="title"
                            value={title}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cropType" className="form-label">Crop Type</label>
                        <select
                            className="form-select"
                            id="cropType"
                            name="cropType"
                            value={cropType}
                            onChange={this.handleChange}
                            required
                        >
                            <option value="">Select Crop Type</option>
                            <option value="Wheat">Wheat</option>
                            <option value="Corn">Corn</option>
                            <option value="Rice">Rice</option>
                            <option value="Soybeans">Soybeans</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="location" className="form-label">Location</label>
                        <input
                            type="text"
                            className="form-control"
                            id="location"
                            name="location"
                            value={location}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="suggestion" className="form-label">Suggestion</label>
                        <textarea
                            className="form-control"
                            id="suggestion"
                            name="suggestion"
                            rows="3"
                            value={suggestion}
                            onChange={this.handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="time" className="form-label">Time</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            id="time"
                            name="time"
                            value={time}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Report</button>
                </form>
            </div>
        );
    }
}

export default adminLayout(AddReportPage);
