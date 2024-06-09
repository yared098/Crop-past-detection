import React from "react";
import "../../assets/css/login.css";
import { Link } from 'react-router-dom';
import authLayout from "../../hoc/authLayout";
import { auth, db } from '../../firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import withNavigation from './withNavigation'; // Ensure this is the correct path

class RegistrationPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            location: "",
            role: "Admin",
            error: null,
            name:"user",
            message: null,
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password, confirmPassword, phone, location, role } = this.state;

        if (password !== confirmPassword) {
            this.setState({ error: "Passwords do not match!", message: null });
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "officers", user.uid), {
                email,
                phone,
                location,
                role,
                createdAt: serverTimestamp(),
            });

            this.setState({ message: "User registered successfully!", error: null });
            this.props.navigate('/'); // Redirect to the dashboard
            
        } catch (error) {
            this.setState({ error: error.message, message: null });
        }
    }

    render() {
        const { email, password, confirmPassword, phone, location, role, error, message } = this.state;

        return (
            <>
                <form className="login-form" onSubmit={this.handleSubmit}>
                    <div className="d-flex align-items-center my-4">
                        <h1 className="text-center fw-normal mb-0 me-3">Register</h1>
                    </div>

                    {message && <div className="alert alert-success" role="alert">{message}</div>}
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}

                    {/* Email input */}
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="email">Email address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control form-control-lg"
                            placeholder="Enter a valid email address"
                            value={email}
                            onChange={this.handleChange}
                            required
                        />
                    </div>

                    {/* Password input */}
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control form-control-lg"
                            placeholder="Enter password"
                            value={password}
                            onChange={this.handleChange}
                            required
                        />
                    </div>

                    {/* Confirm Password input */}
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control form-control-lg"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={this.handleChange}
                            required
                        />
                    </div>

                    {/* Phone input */}
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="phone">Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="form-control form-control-lg"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={this.handleChange}
                            required
                        />
                    </div>

                    {/* Location input */}
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            className="form-control form-control-lg"
                            placeholder="Enter your location"
                            value={location}
                            onChange={this.handleChange}
                            required
                        />
                    </div>

                    {/* Role dropdown */}
                    <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            className="form-control form-control-lg"
                            value={role}
                            onChange={this.handleChange}
                            required
                        >
                            <option value="Admin">Admin</option>
                            <option value="Technician">Technician</option>
                        </select>
                    </div>

                    <div className="text-center text-lg-start mt-4 pt-2">
                        <button type="submit" className="btn btn-primary btn-lg">Register</button>
                        <p className="small fw-bold mt-2 pt-1 mb-0">
                            Already have an account? <Link to="/login" className="link-danger">Login</Link>
                        </p>
                    </div>
                </form>
            </>
        );
    }
}

export default authLayout(withNavigation(RegistrationPage));
