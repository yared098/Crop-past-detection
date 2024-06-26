import React from 'react';
import adminLayout from '../hoc/adminLayout';
import { db } from '../firebase-config';
import BarGraph from './BarGraph';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, registerables } from 'chart.js';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';

Chart.register(...registerables, ArcElement);

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
      const newsRef = collection(db, 'News');
      onSnapshot(newsRef, (querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          const newsData = doc.data();
          if (newsData.date && newsData.date.seconds) {
            newsData.date = new Date(newsData.date.seconds * 1000).toLocaleString();
          }
          data.push({ id: doc.id, ...newsData });
        });
        this.setState({ newsItems: data });
      });
    } catch (error) {
      console.error('Error fetching news: ', error);
    }
  };

  render() {
    const { newsItems } = this.state;

    return (
      <div style={{ height: 'calc(100vh - 40px)', overflowY: 'auto', padding: '20px' }}>
        <h2>Recent news</h2>
        {newsItems.map((item, index) => (
          <div key={item.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
            <h3>{item.disc}</h3>
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
      area: 0,
      technicians: 0,
      status: 90,
      barGraphData: [0, 0, 0, 0],
      dbbHealthycount: 0,
      dbbBlightcount: 0
    };
  }

  componentDidMount() {
    this.fetchData();
    this.calculateTotalArea()
  }

  fetchData = async () => {
    try {
      const farmersCollectionRef = collection(db, 'farmers');
      const farmersSnapshot = await getDocs(farmersCollectionRef);
      const farmersCount = farmersSnapshot.size;

      const techniciansCollectionRef = collection(db, 'officers');
      const techniciansSnapshot = await getDocs(techniciansCollectionRef);
      const techniciansCount = techniciansSnapshot.size;

      const dbHealthyQuery = query(collection(db, 'Detection'), where('result', '==', 'Maize Healthy'));
      const dbHealthySnapshot = await getDocs(dbHealthyQuery);
      const dbbHealthycount = dbHealthySnapshot.size;

      const dbBlightQuery = query(collection(db, 'Detection'), where('result', '==', 'Maize Leaf Blight'));
      const dbBlightSnapshot = await getDocs(dbBlightQuery);
      const dbbBlightcount = dbBlightSnapshot.size;

      this.setState({
        farmers: farmersCount,
        technicians: techniciansCount,
        barGraphData: [0, 0, dbbHealthycount, dbbBlightcount, 10],
        dbbHealthycount,
        dbbBlightcount
      });
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  calculateTotalArea = async () => {
    console.log("calculet total area")
    try {
      const farmersCollectionRef = collection(db, 'farmers');
      const farmersSnapshot = await getDocs(farmersCollectionRef);

      let totalArea = 0;
      farmersSnapshot.forEach((doc) => {
        const farmerData = doc.data();
        const childArea = parseInt(farmerData.area) || 0;
        
        totalArea += childArea;
      });
      console.log(totalArea);
      console.log("calculet total area")
      this.setState({
        area: totalArea
      });
    } catch (error) {
      console.error('Error calculating total area: ', error);
    }
  };


    render() {
        const { farmers, area, technicians, status, barGraphData, dbbHealthycount, dbbBlightcount } = this.state;
        const pieData = {
            labels: ['Maize', 'Aphide', 'corn', 'White'],
            datasets: [
                {
                    data: [dbbHealthycount, dbbBlightcount, 5, 5],
                    backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#ffffff'],
                    hoverBackgroundColor: ['#28a745', '#ffc107', '#dc3545', '#ffffff']
                }
            ]
        };

        return (
            <div style={{ display: 'flex', backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '20px' }}>
                <div style={{ flex: '1' }}>
                    <div className="row" >
                        <div className="col-md-3 mb-3" >
                            <div className="card bg-primary text-white" >
                                <div className="card-body"  >
                                    <h5 className="card-title">Farmers</h5>
                                    <p className="card-text">{farmers}</p>
                                </div>
                                <div className="card-footer">
                                    {/* <a href="#" className="text-white">View Details</a> */}
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
                                    {/* <a href="#" className="text-white">View Details</a> */}
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
                                    {/* <a href="#" className="text-white">View Details</a> */}
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
                                    {/* <a href="#" className="text-white">View Details</a> */}
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
