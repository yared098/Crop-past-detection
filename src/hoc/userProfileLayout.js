import React from "react";
import adminLayout from "../hoc/adminLayout"
import "./../assets/css/profile.css"
import { NavLink } from "react-router-dom";

const userProfileLayout = (ChildComponent) => {
    class UserProfilePageHoc extends React.Component {
        constructor(props) {
            super(props);

            this.state = {}
        }

        render() {
            return <>
                <div className="container">
                    <div className="row profile">
                        
                        <div className="col-md-9">
                            <div className="profile-content">
                                <ChildComponent {...this.props} />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        }
    }

    return adminLayout(UserProfilePageHoc);
}


export default userProfileLayout;