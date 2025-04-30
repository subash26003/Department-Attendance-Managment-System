import React, { useContext, useEffect, useMemo, useState } from "react";
import withApiStatus from "../components/HigherOrderComponent/withApiStatus";
import { API_STATUS, DataContext } from "../context/DataProvider";
import Tab from "../components/stateLessComponents/Tab";
import { toast } from "react-toastify";
import api from "../api/api";
import Loader from "../components/stateLessComponents/Loader";
import Failure from "../components/stateLessComponents/Failure";
import StudentList from "../components/SubjectPageComponents/StudentList";

const Subjects = () => {

  const { facultyData , token} = useContext(DataContext);

  const [studentList , setStudentList] = useState([])

  const [apiStatus , setApiStatus] = useState({status : API_STATUS.LOADING , errMsg : ""})

  const subjectsList = useMemo(() => {
    return facultyData.facultyDetails.subjects;
  }, [facultyData]);



  const subjectNames = useMemo(() => {
    return subjectsList.map((item) => item.name);
  }, [subjectsList]);

  const [selectedSubject, setSelectedSubject] = useState(subjectNames[0]);

  const getSubjectsAttendanceData = async (code) => {
    try {
        const options = {
          headers : {
            Authorization : `Bearer ${token}`
          }
        }
        const response = await api.get(`/liststudent/${code}`, options)
        const data = response.data
        console.log(data);
        
        if(data.success){
            setStudentList(data.studentList)
            setApiStatus({status : API_STATUS.SUCCESS})
        }else{
            toast.error(response.message)
            setApiStatus({status : API_STATUS.FAILURE , errMsg : data.message})
        }
        
    } catch (error) {
        toast.error(error.message)
        setApiStatus({status : API_STATUS.FAILURE , errMsg : error.message})
        console.log(error.message);
        
    }
  }

  useEffect(() => {
    let code = ""
    for(let i = 0 ; i < subjectsList.length ; i++){
        if(subjectsList[i].name == selectedSubject){
            code = subjectsList[i].code
            break;
        }
    }
    setApiStatus({status : API_STATUS.LOADING})
    getSubjectsAttendanceData(code)
  },[selectedSubject])

  const renderView = (apiStatus) => {
    switch(apiStatus.status){
        case API_STATUS.LOADING:
            return <Loader />
        case API_STATUS.FAILURE:
            return <Failure message={apiStatus.errMsg} />
        case API_STATUS.SUCCESS:
            return <StudentList students={studentList} subjectName={selectedSubject}/>
    }
  }

  return (
    <div>
      <Tab
        tabList={subjectNames}
        currentTab={selectedSubject}
        setCurrentTab={setSelectedSubject}
      />
        {renderView(apiStatus)}
    </div>
  );
};

export default withApiStatus(Subjects, "Handled Subjects");
