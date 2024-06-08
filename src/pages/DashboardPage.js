import React from 'react';
import adminLayout from '../hoc/adminLayout';
import { db } from '../firebase-config'; // Import Firebase configuration
import BarGraph from './BarGraph'; // Import the BarGraph component
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, registerables } from 'chart.js';
import { collection, getDocs, onSnapshot } from 'firebase/firestore'; // Import collection and onSnapshot

// Register the required chart elements
Chart.register(...registerables, ArcElement);

// Define the ShowNews1 component
class ShowNews1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newsItems: []
        };
    }

    componentDidMount() {
        this.fetchNews();
    }

    fetchNews = async () => {
        try {
            const newsRef = collection(db, "News");
            onSnapshot(newsRef, (querySnapshot) => {
                const data = [];
                querySnapshot.forEach((doc) => {
                    data.push({ id: doc.id, ...doc.data() });
                });
                this.setState({ newsItems: data });
            });
        } catch (error) {
            console.error("Error fetching news: ", error);
        }
    };

    render() {
        const { newsItems } = this.state;

        return (
            <div style={{ height: 'calc(100vh - 40px)', overflowY: 'auto', padding: '20px' }}>
                <h2>Next Side</h2>
                {newsItems.map((item, index) => (
                    <div key={item.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                        <h3>{item.title}</h3>
                        <p>{item.cropType}</p>
                        <p style={{ fontSize: '0.8rem', color: '#777' }}>Time: {item.date}</p>
                    </div>
                ))}
            </div>
        );
    }
}

class DashboardPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            farmers: 0,
            area: 2000, // Static value
            technicians: 0,
            status: 90, // Static value
            barGraphData: [10, 20, 30, 40] // Example data, replace it with your actual data
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const farmersCollectionRef = collection(db, 'farmers');
            const farmersSnapshot = await getDocs(farmersCollectionRef);
            const farmersCount = farmersSnapshot.size;

            const techniciansCollectionRef = collection(db, 'officers');
            const techniciansSnapshot = await getDocs(techniciansCollectionRef);
            const techniciansCount = techniciansSnapshot.size;
            //get crop type maize
            

            this.setState({
                farmers: farmersCount,
                technicians: techniciansCount
            });
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    render() {
        const { farmers, area, technicians, status, barGraphData } = this.state;
        const pieData = {
            labels: ['Maize', 'Aphide', 'Red', 'White'],
            datasets: [
                {
                    data: [70, 20, 5, 5],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#ffffff'],
                    hoverBackgroundColor: ['#28a745', '#ffc107', '#dc3545', '#ffffff']
                }
            ]
        };

        return (
            <div style={{ display: 'flex', backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
                <div style={{ flex: '1' }}>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <div className="card bg-primary text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Farmers</h5>
                                    <p className="card-text">{farmers}</p>
                                </div>
                                <div className="card-footer">
                                    <a href="#" className="text-white">View Details</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card bg-warning text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Area</h5>
                                    <p className="card-text">{area} Sq Area</p>
                                </div>
                                <div className="card-footer">
                                    <a href="#" className="text-white">View Details</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card bg-success text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Technicians</h5>
                                    <p className="card-text">{technicians}</p>
                                </div>
                                <div className="card-footer">
                                    <a href="#" className="text-white">View Details</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card bg-danger text-white">
                                <div className="card-body">
                                    <h5 className="card-title">Status</h5>
                                    <p className="card-text">{status}%</p>
                                </div>
                                <div className="card-footer">
                                    <a href="#" className="text-white">View Details</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Add the BarGraph component */}
                    <BarGraph data={barGraphData} />
                </div>
                {/* Add the Pie chart in the middle */}
                <div style={{ width: '300px', margin: '0 20px', backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '200px', height: '200px' }}>
                        <Pie data={pieData} />
                    </div>
                </div>
                {/* Add the ShowNews1 component on the right side */}
                <div style={{ width: '300px', backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                    <ShowNews1 />
                </div>
            </div>
        );
    }
}

export default adminLayout(DashboardPage);
