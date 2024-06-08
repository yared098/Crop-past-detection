import React from 'react';
import adminLayout from '../hoc/adminLayout';
import { db } from '../firebase-config'; // Import Firebase configuration
import BarGraph from './BarGraph'; // Import the BarGraph component

// Define the ShowNews component
class ShowNews1 extends React.Component {
    render() {
        // Static data for news items
        const newsItems = [
            "News 1",
            "News 2",
            "News 3",
            "News 4",
            "News 5",
            "News 6",
            "News 7",
            "News 8",
            "News 9",
            "News 10"
        ];

        return (
            <div>
                <h2>Next Side</h2>
                <ul>
                    {newsItems.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
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
            // Add a new state for bar graph data
            barGraphData: [10, 20, 30, 40] // Example data, replace it with your actual data
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const farmersSnapshot = await db.collection('farmers').get();
            const farmersCount = farmersSnapshot.size;

            const techniciansSnapshot = await db.collection('officers').get();
            const techniciansCount = techniciansSnapshot.size;

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
        return (
            <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
                <div className="row">
                    {/* Existing code for card display */}
                </div>
                {/* Display the BarGraph component */}
                <BarGraph data={barGraphData} />
                {/* Display the ShowNews component */}
                <ShowNews1 />
            </div>
        );
    }
}

export default adminLayout(ShowNews1);
