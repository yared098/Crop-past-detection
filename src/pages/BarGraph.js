// BarGraph.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarGraph = ({ data }) => {
    const barData = {
        labels: ['Aphide', 'grasshoper', 'Maize Healthy', 'Maize Leaf Blight',"maize stike virues"],
        datasets: [
            {
                label: 'Detection Counts',
                data: data,
                backgroundColor: [
                    '#80C855',    // Aphide - Red
                    '#80C855',    // Maize strike virus - Cyan
                    '#80C855',    // Grasshopper - Yellow
                    '#80C855'   ,  // Leaf blight - Blue
                    '#80C855'     // Leaf blight - Blue
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',      // Aphide - Red
                    'rgba(75, 192, 192, 1)',      // Maize strike virus - Cyan
                    'rgba(255, 206, 86, 1)',      // Grasshopper - Yellow
                    'rgba(54, 162, 235, 1)'  ,     // Leaf blight - Blue
                    'rgba(54, 162, 235, 1)'       // Leaf blight - Blue
                ],
                borderWidth: 1
            }
        ]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return <Bar data={barData} options={options} />;
};

export default BarGraph;
