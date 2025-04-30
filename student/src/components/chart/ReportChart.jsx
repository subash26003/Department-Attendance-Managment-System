// BarChartComponent.jsx
import React, { useContext, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { StudentDataContext } from '../../context/StudentDataContext';
import SubjectsList from '../SubjectsList';
import Failure from '../Failure';

// Register chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChartComponent = () => {
  const {studentData} = useContext(StudentDataContext)

  if(!studentData.attendanceData){
    return <Failure />
  }

  const subjects = useMemo(() => {
    return studentData.attendanceData?.map(item => item.subjectCode) 
  },[studentData])

  const percentages = useMemo(() => {
    return studentData.attendanceData?.map(item => item.percentage)
  },[studentData])


  
  const data = {
    labels:subjects,
    datasets: [
      {
        label: 'Attendance (%)',
        data: percentages,
        backgroundColor:  percentages.map(item => item > 75 ? "#4F46E5" : "#EF4444"),
        borderRadius: 2,
      },
    ],
  };
  // 
  //
  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return <>
  <Bar className='w-[480px] lg:w-[1200px] lg:h-[580px] ' data={data} options={options} />
  <SubjectsList subjects={studentData.attendanceData} />
  </>
};

export default BarChartComponent;
