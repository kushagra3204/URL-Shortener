import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS,CategoryScale, LineElement,BarElement, PointElement, LinearScale, Title, Tooltip } from 'chart.js';
ChartJS.register(CategoryScale,LineElement, PointElement,BarElement, LinearScale, Title, Tooltip);

const BarLineChart = ({labels,data,percentage,width}) => {
  return (
    <div style={{width: width}}>
        <Bar
            data={{
                labels: labels,
                datasets: [
                {
                    label: 'Percentage',
                    type: 'line',
                    fill: false,
                    borderColor: '#E46651',
                    backgroundColor: '#E46651',
                    borderWidth: 2,
                    yAxisID: 'percentage',
                    data: percentage, // Replace with actual percentage data
                },
                {
                    label: 'Number of Users',
                    type: 'bar',
                    // backgroundColor: ['#41B883', '#E46651', ],
                    backgroundColor: '#41B883',
                    borderColor: '#41B883',
                    borderWidth: 1,
                    yAxisID: 'users',
                    data: data, // Replace with actual user data
                },
                
                ],
            }} 
            options={{
                scales: {
                yAxes: [
                    {
                    id: 'users',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Users',
                    },
                    },
                    {
                    id: 'percentage',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        beginAtZero: true,
                        max: 100,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Percentage',
                    },
                    },
                ],
                },
            }}
        />
    </div>
  );
};

export default BarLineChart;