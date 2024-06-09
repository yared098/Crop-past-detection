import React from "react";
import { db, storage, auth } from "../firebase-config"; // Import Firebase Auth
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth"; // Import Auth state listener
import adminLayout from "../hoc/adminLayout";

class AddNewsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            image: null,
            disc: "",
            latitude: "",
            longitude: "",
            techId: "", // Initializing techId
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    componentDidMount() {
        // Set up an authentication state listener to get the current user's ID
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.setState({ techId: user.uid });
            } else {
                // Handle unauthenticated state
                console.log("User is not authenticated");
            }
        });
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleImageChange(event) {
        this.setState({ image: event.target.files[0] });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const { title, image, disc, latitude, longitude, techId } = this.state;

        let imageUrl = "";

        if (image) {
            const storageRef = ref(storage, `images/${Date.now()}_${image.name}`);
            await uploadBytes(storageRef, image);
            imageUrl = await getDownloadURL(storageRef);
        }

        try {
            const docRef = await addDoc(collection(db, "News"), {
                newsId: Date.now().toString(),
                title,
                disc,
                image: imageUrl,
                location: [
                    parseFloat(latitude),
                    parseFloat(longitude),
                ],
                date: new Date(),
                techId, // Using the techId from state
            });
            console.log("Document written with ID: ", docRef.id);
            alert("News added successfully");

            // Reset form
            this.setState({
                title: "",
                image: null,
                disc: "",
                latitude: "",
                longitude: "",
                techId: "", // Resetting techId
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error adding news");
        }
    }

    // Function to fetch user's current location
    fetchLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.setState({ latitude: latitude.toString(), longitude: longitude.toString() });
            },
            (error) => {
                console.error("Error fetching location: ", error);
                alert("Error fetching location. Please enter latitude and longitude manually.");
            }
        );
    };

    render() {
        const { title, disc, latitude, longitude, techId } = this.state;
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
                        <label htmlFor="image" className="form-label">Image</label>
                        <input
                            type="file"
                            className="form-control"
                            id="image"
                            name="image"
                            onChange={this.handleImageChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="disc" className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            id="disc"
                            name="disc"
                            rows="3"
                            value={disc}
                            onChange={this.handleChange}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="latitude" className="form-label">Latitude</label>
                        <div className="input-group">
                            <input
                                type="number"
                                className="form-control"
                                id="latitude"
                                name="latitude"
                                value={latitude}
                                onChange={this.handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={this.fetchLocation}
                            >
                                Use Current Location
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="longitude" className="form-label">Longitude</label>
                        <input
                            type="number"
                            className="form-control"
                            id="longitude"
                            name="longitude"
                            value={longitude}
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
