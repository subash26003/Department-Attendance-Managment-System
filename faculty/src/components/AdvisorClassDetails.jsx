import React, { useContext } from 'react'
import { DataContext } from '../context/DataProvider'
import withApiStatus from './HigherOrderComponent/withApiStatus'
import StudentList from './SubjectPageComponents/StudentList'

const AdvisorClassDetails = () => {
    const {facultyData} = useContext(DataContext)
   
    console.log(facultyData.studentList);
    
  return (
    <div className='md:mx-5  bg-white shadow rounded-2xl mt-5'>
      <StudentList students={facultyData.studentList} subjectName={"Overall"} advisorList={true}/>
    </div>
  )
}

export default withApiStatus(AdvisorClassDetails , `Student List`)