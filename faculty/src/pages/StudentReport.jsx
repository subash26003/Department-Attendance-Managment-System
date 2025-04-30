import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import NotFound from "../components/stateLessComponents/NotFound";
import { API_STATUS } from "../context/DataProvider";
import Cookies from "js-cookie";
import api from "../api/api";
import Loader from "../components/stateLessComponents/Loader";
import Failure from "../components/stateLessComponents/Failure";
import AcademicReportCard from "../components/AcademicReportCard";

const StudentReport = () => {
  const studentData = useLocation().state?.studentData || null;
  const [studentReport, setStudentReport] = useState();
  const [apiResponse, setApiResponse] = useState({
    status: API_STATUS.LOADING,
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
          studentId: studentId,
        },
      };
      const response = await api.get("/studentreport", options);

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

  useEffect(() => {
    if(studentData){
        fetchStudentReport(studentData._id)
    }
  },[studentData])

  if (!studentData) {
    return <NotFound />;
  }

 
  const renderView = () => {
    switch(apiResponse.status){
        case API_STATUS.LOADING:
            return <Loader />
        case API_STATUS.FAILURE:
            return <Failure message={apiResponse.errMsg} />
        case API_STATUS.SUCCESS:
            return <AcademicReportCard studentDetails={studentData} reportData={studentReport} />
    }
  }
  

  return <div>
    {renderView()}
  </div>;
};

export default StudentReport;
