import React, { useEffect, useState } from 'react';
import LineChartComponent from './chart_display';
//imports LineChartComponent which is where the code for the graphs is written
import {useContextData} from "../Context/contextData"

//parameterised get request from backend to get all data of the user specified by the email and stores it in the data variable
const Stats = () => {
    const [data, setData] = useState([]);
  const { Em } = useContextData();

  useEffect(() => {
    const getData = async () => {
      try {
        const url = new URL('http://127.0.0.1:5000/get_stats');
        url.searchParams.append('email', Em);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const settingsData = await response.json();
        setData(settingsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    if (Em) {
      getData();
    }
  }, [Em]); 
    
  return (
    <div>
      <h1>Mean Log IBI Over Time</h1>
      
      {/* calls the graph components and passes data in it */}
      <LineChartComponent data={data} />
    </div>
  );
};

export default Stats;