import { useEffect, useState } from "react";
import api from "../../api/api";
import Cookies from "js-cookie";
import { API_STATUS } from "../../app/appConstants";
import Loader from "../stateLessComponents/Loader";
import FailueView from "../stateLessComponents/FailueView";
import StudentReportChart from "./StudentReportChart";

const StudentAttendanceHistory = ({ data , startDate , endDate }) => {
  const [selectedStudent, setSelectedStudent] = useState("");

  const [studentReport, setStudentReport] = useState();

  const [apiResponse, setApiResponse] = useState({
    status: API_STATUS.LOADING,
    errMsg: "",
  });

  const fetchStudentReport = async (studentId) => {
    try {
      setApiResponse({ status: API_STATUS.LOADING });
      const token = Cookies.get("admin_token");

      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          studentId:studentId,
          startDate : startDate,
          endDate : endDate
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



  const renderReport = () => {
    switch (apiResponse.status) {
      case API_STATUS.LOADING:
        return <Loader />;
      case API_STATUS.FAILURE:
        return <FailueView error={apiResponse.errMsg} />;
      case API_STATUS.SUCCESS:
        console.log(selectedStudent);
        // return <p>Hello</p>
        return <StudentReportChart  reportData={studentReport} studentDetails={selectedStudent}/>;
    }
  };

  const handleSelectStudent = async (studentId) => {
    const student = data.find(item => item._id === studentId)
    await fetchStudentReport(studentId)
    setSelectedStudent(student)
    
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Student Attendance History</h2>

      {/* Student Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Student
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedStudent}
          onChange={async (e) => {
            handleSelectStudent(e.target.value)
          }}
        >
          <option value="">Select a student</option>
          {data.map((student) => (
            <option key={student._id} value={student._id}>
              {student.studentId || student.registerNo} - {student.studentName || ""}
            </option>
          ))}
        </select>
      </div>

      {/* Student Stats */}
      {selectedStudent ? (
        <>{renderReport()}</>
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">
            Please select a student to view their attendance details.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentAttendanceHistory;
