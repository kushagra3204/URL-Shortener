import React, { useState, useEffect } from "react";
import DoughnutChart from "./GraphComponents/Doughnut";
import BarLineChart from "./GraphComponents/BarLineChart";
import BarChart from "./GraphComponents/BarChart";
import { fetchData } from "../api";
import { useParams } from 'react-router-dom';

const Analytics = () => {
    const { shortLink } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [locationLabel, setLocationLabel] = useState([]);
    const [locationCountListData, setLocationCountListData] = useState([]);
    const [locationPercentageData, setLocationPercentageData] = useState([]);
    const [DayCountData, setDayCountData] = useState([0,0,0,0,0,0,0]);
    const [LinkAccessed, setLinkAccessed] = useState([0,0]);
    const [HoursAccessed, setHoursAccessed] = useState(new Array(24).fill(0));

    var dayLabel = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hourLabel = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`);

    const updateArrayAtIndex = (index, newValue, array, setArray) => {
        setArray(prevArray => {
            const newArray = [...prevArray];
            newArray[index] = newValue;
            return newArray;
        });
    };

    useEffect(() => {
        const fetchDataAndSetState = async () => {
            try {
                const data = await fetchData('/api/shorturl/analytics', {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    'shorturl': shortLink
                })
                });

                data.Day.forEach(day => {
                    if(day.day!=null)
                    {
                        const dayName = day.day.trim();
                        const index = dayLabel.indexOf(dayName);
                        if (index !== -1) {
                            updateArrayAtIndex(index, parseInt(day.count_per_hour), DayCountData, setDayCountData);
                        }
                    }
                });

                data.Hours.forEach(hour => {
                    const index = parseInt(hour.hourinterval);
                    if (!isNaN(index) && index >= 0 && index < 24) {
                        updateArrayAtIndex(index, parseInt(hour.countperhour), HoursAccessed, setHoursAccessed);
                    }
                });
                
                setLocationLabel(data.Location.map(item => item.location));
                setLocationCountListData(data.Location.map(item => item.count));
                setLocationPercentageData(data.Location.map(item => item.percentage));
                setLinkAccessed([data.NumTimeAccessed.map(item => item.distinctusers),data.NumTimeAccessed.map(item => item.totaltimeaccessed)]);
                setLoading(false);
            } catch (error) {
                // setError(error);
                setLoading(false);
            }
        };
        fetchDataAndSetState();
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div style={{display: 'flex',flexDirection: 'column',alignItems: 'center'}}>
                <div style={{display: 'flex',justifyContent: 'space-around',padding: '50px 0',width: "100vw"}}>
                    <DoughnutChart data={LinkAccessed} />
                    <BarChart labeldata={dayLabel} data={DayCountData} width={"550px"} xaxistitle={'Days'} yaxistitle={'Views'} />
                </div>
                <BarLineChart labels={locationLabel} data={locationCountListData} percentage={locationPercentageData} width={"550px"} />
                <BarChart labeldata={hourLabel} data={HoursAccessed} width={"1000px"} xaxistitle={'Hours'} yaxistitle={'Views'} />
            </div>
        </div>
    );
};

export default Analytics;