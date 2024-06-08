import React from 'react';

class BarGraph extends React.Component {
    render() {
        const { data } = this.props;
        const maxBarHeight = 200; // Adjust as needed

        return (
            <div>
                <h2>Bar Graph</h2>
                <div style={{ display: 'flex' }}>
                    {data.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                margin: '0 10px',
                                height: maxBarHeight - (item * 2), // Subtract the bar height from max height
                                backgroundColor: 'blue',
                                width: '30px'
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        );
    }
}

export default BarGraph;
