import React from "react";
// import { db, auth } from "../../firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth, storage } from "../../firebase-config";
// import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import userProfileLayout from "../../hoc/userProfileLayout";

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: {
                name: "",
                email: "",
                imageurl: "",
                location: "",
                latitude: "",
                longitude: ""
            },
            forgotPasswordEmail: "",
            isEditing: false,
            userId: ""
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const userId = user.uid;
                this.setState({ userId });
                this.fetchProfile(userId);
            } else {
                // Handle the case where there is no logged-in user
                console.log("No user is signed in.");
            }
        });
    }

    fetchProfile = async (userId) => {
        const profileRef = doc(db, "officers", userId);
        const profileDoc = await getDoc(profileRef);

        if (profileDoc.exists()) {
            this.setState({ profile: profileDoc.data() });
        } else {
            console.log("No such document!");
        }
    };

    handleForgotPassword = (e) => {
        e.preventDefault();
        const { forgotPasswordEmail } = this.state;
        auth.sendPasswordResetEmail(forgotPasswordEmail)
            .then(() => {
                alert("Password reset email sent!");
            })
            .catch((error) => {
                console.error("Error sending password reset email: ", error);
                alert("An error occurred. Please try again later.");
            });
    };

    handleSignOut = () => {
        auth.signOut()
            .then(() => {
                console.log("User signed out successfully.");
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
                alert("An error occurred. Please try again later.");
            });
    };

    toggleEditMode = () => {
        this.setState({ isEditing: !this.state.isEditing });
    };

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            profile: {
                ...this.state.profile,
                [name]: value,
            },
        });
    };

    handleSave = async () => {
        const { profile, userId } = this.state;
        const profileRef = doc(db, "officers", userId);
        try {
            await updateDoc(profileRef, profile);
            this.setState({ isEditing: false });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile: ", error);
            alert("An error occurred while updating the profile. Please try again later.");
        }
    };

    fetchLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.setState({
                    profile: {
                        ...this.state.profile,
                        latitude: latitude.toString(),
                        longitude: longitude.toString()
                    }
                });
            },
            (error) => {
                console.error("Error fetching location: ", error);
                alert("Error fetching location. Please enter latitude and longitude manually.");
            }
        );
    };

    handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const { userId } = this.state;

        try {
            // Create a storage reference with the filename
            const storageRef = ref(storage, `profile_images/${userId}/${file.name}`);

            // Upload file to Firebase Storage
            await uploadBytes(storageRef, file);

            // Get the download URL of the uploaded image
            const imageUrl = await getDownloadURL(storageRef);

            this.setState({
                profile: {
                    ...this.state.profile,
                    imageurl: imageUrl,
                },
            });

            alert("Image uploaded successfully!");
        } catch (error) {
            console.error("Error uploading image: ", error);
            alert("An error occurred while uploading the image. Please try again later.");
        }
    };

    render() {
        const { profile, forgotPasswordEmail, isEditing } = this.state;

        if (!profile) {
            return <div>Loading...</div>;
        }

        return (
            <div className="container">
            <div className="row justify-content-center mt-5">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body text-center">
                    <div className="profile-image">
                      {profile.imageurl ? (
                        <img src={profile.imageurl} alt="Profile" className="rounded-circle" />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <h5 className="card-title mt-3">Personal Info</h5>
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={profile.name || ''}
                                            readOnly={!isEditing}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={profile.email || ''}
                                            readOnly={!isEditing}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="imageurl" className="form-label">Image URL</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="imageurl"
                                            name="imageurl"
                                            value={profile.imageurl || ''}
                                            readOnly={!isEditing}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="latitude" className="form-label">Latitude</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="latitude"
                                                name="latitude"
                                                value={profile.latitude || ''}
                                                readOnly={!isEditing}
                                                onChange={this.handleChange}
                                            />
                                            {isEditing && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={this.fetchLocation}
                                                >
                                                    Use Current Location
                                                </button>
                                            )}
                                        </div>
                                    </div>


                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            onChange={this.handleImageUpload}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="longitude" className="form-label">Longitude</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="longitude"
                                                name="longitude"
                                                value={profile.longitude || ''}
                                                readOnly={!isEditing}
                                                onChange={this.handleChange}
                                            />
                                            {isEditing && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={this.fetchLocation}
                                                >
                                                    Use Current Location
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-3">

                                    </div>

                                    {isEditing ? (
                                        <button type="button" className="btn btn-success" onClick={this.handleSave}>
                                            Save
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary" onClick={this.toggleEditMode}>
                                            Update Info
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Forgot Password</h5>
                                <form onSubmit={this.handleForgotPassword}>
                                    <div className="mb-3">
                                        <label htmlFor="forgotPasswordEmail" className="form-label">Email address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="forgotPasswordEmail"
                                            value={forgotPasswordEmail}
                                            onChange={(e) => this.setState({ forgotPasswordEmail: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Send Password Reset Email</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <button onClick={this.handleSignOut} className="btn btn-danger">Sign Out</button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const Footer = () => (
    <footer className="mt-5">
        <div className="row justify-content-center">
            <div className="col-md-6 text-center">
                <p>© safe crop 2024 Your Company. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);

export default userProfileLayout(ProfilePage);
