import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
import '../App.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);
//getting all majour functions from the library to make an interactive graph

//prop data that is passed in so it can dynamically be used for any users data
const LineChartComponent = ({ data }) => {



  const chartData = {
    //x axis lagel
    labels: data.map(d => ` ${d.time * 5} min`),
    datasets: [
      {
        label: 'Mean Log IBI',
        //y axis label and data point ploted
        data: data.map(d => d.mean_log_ibi),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        width:500,
       height:300
      },
    ],
  };

  return (<div className="chart-container" >
  <Line data={chartData} />
</div>)
};

export default LineChartComponent;