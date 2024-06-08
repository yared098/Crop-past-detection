import React from "react";
import "../../assets/css/login.css";
import { Link } from 'react-router-dom';
import authLayout from "../../hoc/authLayout";
import { auth } from '../../firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";
import withNavigation from './withNavigation'; // Adjust the import path as necessary

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            error: null,
            message: null,
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { email, password } = this.state;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            this.setState({ message: "Login successful!", error: null });

            // Use the navigate prop for navigation
            this.props.navigate('/');
            
        } catch (error) {
            this.setState({ error: error.message, message: null });
        }
    }

    render() {
        const { email, password, error, message } = this.state;

        return (
            <>
                <form className="login-form" onSubmit={this.handleSubmit}>
                    <div className="d-flex align-items-center my-4">
                        <h1 className="text-center fw-normal mb-0 me-3">Sign In</h1>
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
                            autoComplete="email"
                        />
                    </div>

                    {/* Password input */}
                    <div className="form-outline mb-3">
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
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        {/* Checkbox */}
                        <div className="form-check mb-0">
                            <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                            <label className="form-check-label" htmlFor="form2Example3">
                                Remember me
                            </label>
                        </div>
                        <Link to="/reset-password" className="text-body">Forgot password?</Link>
                    </div>

                    <div className="text-center text-lg-start mt-4 pt-2">
                        <button type="submit" className="btn btn-primary btn-lg">Login</button>
                        <p className="small fw-bold mt-2 pt-1 mb-0">
                            Don't have an account? <Link to="/register" className="link-danger">Register</Link>
                        </p>
                    </div>
                </form>
            </>
        );
    }
}

export default authLayout(withNavigation(LoginPage));
