import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({data}) => {
    return (
        <div style={{ width: '500px', height: '260px'}}>
            <Doughnut
                data={{
                    labels: ['No. of Users', 'Total Views'],
                    datasets: [
                        {
                            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                            data: data,
                        },
                    ],
                }}
                options={{
                    plugins: {
                        legend: {
                            labels: {
                                color: '#000',
                            },
                        },
                    },
                    aspectRatio: 1,
                    responsive: true,
                    maintainAspectRatio: false,
                }}
            />
        </div>
    );
};

export default DoughnutChart;
