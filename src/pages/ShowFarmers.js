import React from 'react';
import adminLayout from '../hoc/adminLayout';
import { db } from '../firebase-config';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import './showfarmers.css';

class ShowFarmers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            farmers: [],
            filteredFarmers: [],
            currentPage: 1,
            farmersPerPage: 10,
            filterLat: '',
            filterLon: '',
            filterFarmerId: '',
            filterName: '',
            selectedFarmer: null
        };
    }

    componentDidMount() {
        const farmersRef = collection(db, 'farmers');
        onSnapshot(farmersRef, (querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ farmers: data, filteredFarmers: data });
        });
    }

    handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'farmers', id));
            this.setState((prevState) => ({
                farmers: prevState.farmers.filter((farmer) => farmer.id !== id),
                filteredFarmers: prevState.filteredFarmers.filter((farmer) => farmer.id !== id)
            }));
            console.log('Document successfully deleted!');
        } catch (error) {
            console.error('Error removing document: ', error);
        }
    };

    handleNextPage = () => {
        this.setState((prevState) => ({
            currentPage: prevState.currentPage + 1
        }));
    };

    handlePreviousPage = () => {
        this.setState((prevState) => ({
            currentPage: prevState.currentPage - 1
        }));
    };

    handleFilterChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    applyFilter = () => {
        const { farmers, filterLat, filterLon, filterFarmerId, filterName } = this.state;

        if (filterName && !filterLat && !filterLon) {
            const filteredFarmers = farmers.filter((farmer) =>
                farmer.name.toLowerCase().includes(filterName.toLowerCase())
            );
            this.setState({ filteredFarmers, currentPage: 1 });
        } else if (filterLat && filterLon && !filterName) {
            const filteredFarmers = farmers.filter((farmer) => {
                const distance = this.calculateDistance(
                    parseFloat(farmer.latitude),
                    parseFloat(farmer.longitude),
                    parseFloat(filterLat),
                    parseFloat(filterLon)
                );
                return distance <= 100; // Assuming distance is calculated in kilometers
            });
            this.setState({ filteredFarmers, currentPage: 1 });
        } else if (filterLat && filterLon && filterName) {
            const filteredFarmers = farmers.filter(
                (farmer) =>
                    farmer.name.toLowerCase().includes(filterName.toLowerCase()) &&
                    this.calculateDistance(
                        parseFloat(farmer.latitude),
                        parseFloat(farmer.longitude),
                        parseFloat(filterLat),
                        parseFloat(filterLon)
                    ) <= 100 // Assuming distance is calculated in kilometers
            );
            this.setState({ filteredFarmers, currentPage: 1 });
        } else {
            this.setState({ filteredFarmers: farmers, currentPage: 1 });
        }
    };

    calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    handleViewProfile = (farmer) => {
        this.setState({ selectedFarmer: farmer });
        alert(`Farmer Profile:\nName: ${farmer.name}\nID: ${farmer.id}\nPhone: ${farmer.phoneNumber}\nLocation: ${farmer.location}`);
    };

    render() {
        const { filteredFarmers, currentPage, farmersPerPage } = this.state;
        const indexOfLastFarmer = currentPage * farmersPerPage;
        const indexOfFirstFarmer = indexOfLastFarmer - farmersPerPage;
        const currentFarmers = filteredFarmers.slice(indexOfFirstFarmer, indexOfLastFarmer);

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-9">
                        <h1>Show Farmers</h1>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>ID</th>
                                    <th>Phone</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFarmers.map((farmer) => (
                                    <tr key={farmer.id}>
                                        <td>{farmer.name}</td>
                                        <td>{farmer.id}</td>
                                        <td>{farmer.phoneNumber}</td>
                                        <td>{farmer.location}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => this.handleDelete(farmer.id)}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => this.handleViewProfile(farmer)}
                                            >
                                                 Profile
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-between">
                            <button
                                className="btn btn-primary"
                                onClick={this.handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={this.handleNextPage}
                                disabled={indexOfLastFarmer >= filteredFarmers.length}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <div className="col-md-3 filter-sidebar">
                        <h4>Filter by:</h4>
                        <input
                            type="text"
                            placeholder="Latitude"
                            name="filterLat"
                            value={this.state.filterLat}
                            onChange={this.handleFilterChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Longitude"
                            name="filterLon"
                            value={this.state.filterLon}
                            onChange={this.handleFilterChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Farmer ID"
                            name="filterFarmerId"
                            value={this.state.filterFarmerId}
                            onChange={this.handleFilterChange}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            name="filterName"
                            value={this.state.filterName}
                            onChange={this.handleFilterChange}
                            className="form-control mb-2"
                        />
                        <button className="btn btn-primary" onClick={this.applyFilter}>
                            Apply Filter
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default adminLayout(ShowFarmers);

