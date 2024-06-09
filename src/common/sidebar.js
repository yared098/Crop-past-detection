import React from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase-config'; // Import Firebase configuration
import { collection, onSnapshot } from 'firebase/firestore'; // Import Firestore functions
import logo1 from './../assets/images/logo1.png'; // Adjust the path as needed
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            officers: []
        };
    }

    componentDidMount() {
        // Firebase Authentication listener
        this.unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                // User is signed in
                this.setState({ user });
            } else {
                // User is signed out
                this.setState({ user: null });
            }
        });

        // Fetch officers data from Firestore
        const officersRef = collection(db, 'officers');
        this.unsubscribeOfficers = onSnapshot(officersRef, snapshot => {
            const officersData = [];
            snapshot.forEach(doc => {
                officersData.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ officers: officersData });
        });
    }

    componentWillUnmount() {
        // Unsubscribe from Firebase Authentication listener and Firestore snapshot
        this.unsubscribeAuth();
        this.unsubscribeOfficers();
    }

    render() {
        const { user, officers } = this.state;
        const sidebarStyle = {
            backgroundColor: '#80C855', // Green background color
            height: '100%',
            width: '200px',
            position: 'fixed',
            top: 0,
            left: 0,
            overflowX: 'hidden',
            paddingTop: '20px',
            transition: '0.5s',
            zIndex: 1000,
            borderRight: '1px solid #ddd'
        };

        return (
            <div className="border-end sidenav" id="sidebar-wrapper" style={sidebarStyle}>
                <div className="sidebar-heading border-bottom">
                    <Link to="/">
                        <img
                            alt="Safe crop"
                            src={logo1}
                            width="100"
                            height="100"
                        />
                    </Link>
                    <h>Safe crop</h>
                </div>
                <PerfectScrollbar className="sidebar-items">
                    <ul className="list-unstyled ps-0">
                        {/* Sidebar items */}
                        <li className="mb-1">
                            <Link tag="a" className="" to="/">
                                <i className="fas fa-tachometer-alt"></i> Dashboard
                            </Link>
                        </li>
                        <li className="mb-1">
                            <Link tag="a" className="" to="/show-farmers">
                                <i className="fas fa-users"></i> Show Farmers
                            </Link>
                        </li>
                        <li className="mb-1">
                            <Link tag="a" className="" to="/show-detectes">
                                <i className="fas fa-search"></i> Show Detects
                            </Link>
                        </li>
                        <li className="mb-1">
                            <Link tag="a" className="" to="/show-reports">
                                <i className="fas fa-file-alt"></i> Show Reports
                            </Link>
                        </li>
                        <li className="mb-1">
                            <Link tag="a" className="" to="/show-news">
                                <i className="fas fa-newspaper"></i> Show News
                            </Link>
                        </li>
                        <li className="border-top my-3"></li>
                        <li className="mb-1">
                            <Link tag="a" className="" to="/add-new">
                                <i className="fas fa-plus"></i> Add News
                            </Link>
                        </li>
                        <li className="mb-1">
                            <Link tag="a" className="" to="/add-report">
                                <i className="fas fa-plus-circle"></i> Add Report
                            </Link>
                        </li>
                    </ul>
                </PerfectScrollbar>
                <div className="dropdown fixed-bottom-dropdown" style={{ backgroundColor: '#80C855' }}>
                    <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src={logo1} alt="" width="32" height="32" className="rounded-circle me-2" />
                        {user && (
                            <>
                                <li className="mb-1">{user.displayName}</li>
                                {officers.map(officer => (
                                    <li key={officer.id} className="mb-1">
                                        <span>{officer.name}</span>
                                    </li>
                                ))}
                            </>
                        )}
                    </a>
                    <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
                        <li><Link className="dropdown-item" to="/profile"><i className="fas fa-user-circle"></i> Profile</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item" to="/login"><i className="fas fa-sign-out-alt"></i> Sign out</Link></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;
