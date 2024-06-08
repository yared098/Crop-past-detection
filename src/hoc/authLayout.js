import React from "react";
import logo1 from './../assets/images/logo1.png'; // Adjust the path as needed

const authLayout = (ChildComponent) => {
    class AuthLayout extends React.Component {
        constructor(props) {
            super(props);

            this.state = {};
        }

        render() {
            return (
                <>
                    <section className="vh-100" style={{ backgroundColor: '#80C855' }}>
                        <div className="container-fluid h-100 d-flex justify-content-center align-items-center">
                            <div className="row w-100">
                                <div className="col-md-9 col-lg-6 col-xl-2 mx-auto text-center">
                                    <img alt="hey" src={logo1} className="img-fluid mb-4" />
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-4 mx-auto">
                                    <div className="card p-4">
                                        <ChildComponent {...this.props} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            );
        }
    }

    return AuthLayout;
}

export default authLayout;
