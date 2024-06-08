import React from "react";
import "../../assets/css/login.css";
import { Link } from 'react-router-dom';
import authLayout from "../../hoc/authLayout";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase-config"; // Adjust the path as necessary

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            message: null,
            error: null,
        };
    }

    handleChange = (event) => {
        this.setState({ email: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const { email } = this.state;

        try {
            await sendPasswordResetEmail(auth, email);
            this.setState({ message: "Password reset email sent!", error: null });
        } catch (error) {
            this.setState({ error: error.message, message: null });
        }
    }

    render() {
        const { email, message, error } = this.state;

        return (
            <>
                <div className="reset-password-section text-center">
                    <h3><i className="fa fa-lock fa-4x"></i></h3>
                    <h2 className="text-center">Forgot Password?</h2>
                    <p>You can reset your password here.</p>
                    <div className="panel-body">
                        {message && <div className="alert alert-success" role="alert">{message}</div>}
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}

                        <form id="register-form" role="form" autoComplete="off" className="form" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <span className="input-group-addon">
                                    <i className="glyphicon glyphicon-envelope color-blue"></i>
                                </span>
                                <input
                                    id="email"
                                    name="email"
                                    placeholder="Email address"
                                    className="form-control form-control-lg"
                                    type="email"
                                    value={email}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group mt-2">
                                <button type="submit" className="btn btn-primary btn-lg">Reset Password</button>
                                <p className="small fw-bold mt-2 pt-1 mb-0">
                                    Remember your password? <Link to="/login" className="link-danger">Login</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        );
    }
}

export default authLayout(ResetPassword);
