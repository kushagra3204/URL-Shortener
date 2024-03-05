import React from 'react';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const BarChart = ({labeldata,data,width,xaxistitle,yaxistitle}) => {
  return (
    <div style={{width: width}}>
        <Bar
            data={{
                labels: labeldata,
                datasets: [
                    {
                        backgroundColor: [
                            '#41B883', '#E46651', '#00D8FF', '#DD1B16',
                            '#7FDBFF', '#2ECC40', '#FFDC00', '#FF851B',
                            '#001f3f', '#0074D9', '#39CCCC', '#FF4136',
                            '#3D9970', '#85144b', '#F012BE', '#B10DC9'
                        ],
                        data: data,
                    },
                ],
            }}
            options={{
                scales: {
                x: { 
                    title: {
                        display: true,
                        text: xaxistitle,
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        beginAtZero: true,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: yaxistitle,
                    },
                    beginAtZero: true,
                },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            }}
        />
    </div>
  );
};

export default BarChart;