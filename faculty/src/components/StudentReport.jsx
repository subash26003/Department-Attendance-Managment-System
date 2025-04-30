import React from 'react'
import  Cookies from 'js-cookie'
import { API_STATUS } from '../context/DataProvider';
import api from '../api/api';


const StudentReport = () => {

    
    const [studentReport, setStudentReport] = useState();

    const [apiResponse, setApiResponse] = useState({
      status: API_STATUS.LOADING,
      errMsg: "",
    });

    const fetchStudentReport = async (studentId) => {
        try {
          setApiResponse({ status: API_STATUS.LOADING });
          const token = Cookies.get("jwt_token");
    
          const options = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              studentId:studentId,
            },
          };
          const response = await api.get("/report", options);
    
          if (response.data.success) {
            setStudentReport(response.data.studentReport);
            setApiResponse({ status: API_STATUS.SUCCESS });
          } else {
            setApiResponse({
              status: API_STATUS.FAILURE,
              errMsg: response.data.message,
            });
          }
        } catch (error) {
          setApiResponse({ status: API_STATUS.FAILURE, errMsg: error.message });
          console.log(error);
        }
      };
  return (
    <div>StudentReport</div>
  )
}

export default StudentReport