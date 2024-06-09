import React from "react";
import { db } from "../../firebase-config";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import userProfileLayout from "../../hoc/userProfileLayout";
import { auth } from "../../firebase-config";

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: {},
            forgotPasswordEmail: "",
            isEditing: false,
        };
    }

    componentDidMount() {
        const profileRef = collection(db, "officers");

        onSnapshot(profileRef, (snapshot) => {
            snapshot.forEach((doc) => {
                const data = doc.data();
                this.setState({ profile: data });
            });
        });
    }

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
        const { profile } = this.state;
        const profileRef = doc(db, "officers", profile.uid); // Assumes 'uid' is the document ID
        try {
            await updateDoc(profileRef, profile);
            this.setState({ isEditing: false });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile: ", error);
            alert("An error occurred while updating the profile. Please try again later.");
        }
    };

    render() {
        const { profile, forgotPasswordEmail, isEditing } = this.state;

        return (
            <div className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Personal Info</h5>
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
                                        <label htmlFor="location" className="form-label">Location</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="location"
                                            name="location"
                                            value={profile.location || ''}
                                            readOnly={!isEditing}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="officerId" className="form-label">Officer ID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="officerId"
                                            name="officerId"
                                            value={profile.officerId || ''}
                                            readOnly={!isEditing}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="uid" className="form-label">UID</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="uid"
                                            name="uid"
                                            value={profile.uid || ''}
                                            readOnly
                                        />
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
                <p>© 2024 Your Company. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);

export default userProfileLayout(ProfilePage);
