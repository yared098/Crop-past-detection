import React from "react";
import { db } from "../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import adminLayout from "../hoc/adminLayout";

class AddNewsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            image: "",
            description: "",
            latitude: "",
            longitude: "",
            techId: "", // Adding techId to the state
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
        const { title, image, description, latitude, longitude, techId } = this.state;
        try {
            const docRef = await addDoc(collection(db, "News"), {
                newsId: Date.now().toString(), // Using timestamp as a unique ID
                title,
                description,
                image,
                location: [
                     parseFloat(latitude),
                     parseFloat(longitude),
                ],
                date: new Date(),
                techId, // Including techId in the document
            });
            console.log("Document written with ID: ", docRef.id);
            alert("News added successfully");

            // Reset form
            this.setState({
                title: "",
                image: "",
                description: "",
                latitude: "",
                longitude: "",
                techId: "", // Resetting techId
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error adding news");
        }
    }

    render() {
        const { title, image, description, latitude, longitude, techId } = this.state;
        return (
            <div className="container mt-5">
                <h2>Add News</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">News Title</label>
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
                        <label htmlFor="image" className="form-label">Image URL</label>
                        <input
                            type="text"
                            className="form-control"
                            id="image"
                            name="image"
                            value={image}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            rows="3"
                            value={description}
                            onChange={this.handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="latitude" className="form-label">Latitude</label>
                        <input
                            type="text"
                            className="form-control"
                            id="latitude"
                            name="latitude"
                            value={latitude}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="longitude" className="form-label">Longitude</label>
                        <input
                            type="text"
                            className="form-control"
                            id="longitude"
                            name="longitude"
                            value={longitude}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="techId" className="form-label">Technician ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="techId"
                            name="techId"
                            value={techId}
                            onChange={this.handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Add News</button>
                </form>
            </div>
        );
    }
}

export default adminLayout(AddNewsPage);
