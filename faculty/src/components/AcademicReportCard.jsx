import React from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import Cookies from 'js-cookie'

const AcademicReportCard = ({ reportData, studentDetails }) => {
  // Calculate overall averages
  const overallAttendance =
    reportData.reduce(
      (sum, subject) => sum + subject.attendance.percentage,
      0
    ) / reportData.length;

    const sendReportToParent = async () => {
        try {
            const studentData = {
                report : reportData , studentId : studentDetails._id
            }
            const options = {
                headers: {
                    Authorization : `Bearer ${Cookies.get("jwt_token")}` 
                },
            }
            const response = await api.post("/sendSMS" ,{studentData} , options)
            if(response.data.success){
                toast.success("SMS Sent")
            }else {
                toast.info(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error);
        }
    }
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          {/* Student Information */}
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Academic Performance Report
            </h1>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-blue-100">
                {studentDetails.studentName}
              </p>
              <p className="text-blue-100">
                Register No:{" "}
                <span className="text-white">{studentDetails.registerNo}</span>
              </p>
              <p className="text-blue-100">
                Year:{" "}
                <span className="text-white">
                  {studentDetails.studentYear.toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Contact and Performance Summary */}
          <div className="space-y-1 text-right md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-blue-100">
                  Email:{" "}
                  <span className="text-white">{studentDetails.email}</span>
                </p>
                <p className="text-blue-100">
                  Mobile:{" "}
                  <span className="text-white">{studentDetails.mobileNo}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end md:justify-start">
              <p className="text-blue-100 font-medium">
                Overall Attendance:
                <span
                  className={`ml-2 font-bold ${
                    overallAttendance >= 75 ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {overallAttendance.toFixed(2)}%
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportData.map((subject, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {subject.subjectName}
                  </h2>
                  <p className="text-gray-600">{subject.subjectCode}</p>
                </div>
              </div>

              {/* Attendance Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Attendance
                  </span>
                  <span className="text-sm font-bold">
                    {subject.attendance.classesAttended}/
                    {subject.attendance.totalClasses} classes
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      subject.attendance.percentage >= 85
                        ? "bg-green-500"
                        : subject.attendance.percentage >= 75
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${subject.attendance.percentage}%` }}
                  ></div>
                </div>
                <p className="text-right mt-1 text-sm font-semibold">
                  {subject.attendance.percentage}%
                </p>
              </div>

              {/* Marks Section */}
              {subject.marks ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500">Internal 1</p>
                      <p className="font-bold text-blue-700">
                        {subject.marks.internal1}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <p className="text-xs text-gray-500">Internal 2</p>
                      <p className="font-bold text-blue-700">
                        {subject.marks.internal2}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <p className="text-xs text-gray-600">Average</p>
                      <p className="font-bold text-blue-800">
                      {(subject.marks.internal1 && subject.marks.internal2 ) ? (subject.marks.internal1 + subject.marks.internal2) / 2 : (subject.marks.internal1 || 0)}
                      </p>
                    </div>
                  </div>

                  
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No marks recorded yet
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Performance Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Best Subject</p>
            <p className="font-bold text-green-700 text-lg">
              {
                reportData.reduce((prev, current) =>
                  (prev.marks?.average || 0) > (current.marks?.average || 0)
                    ? prev
                    : current
                ).subjectName
              }
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Highest Attendance</p>
            <p className="font-bold text-blue-700 text-lg">
              {
                reportData.reduce((prev, current) =>
                  prev.attendance.percentage > current.attendance.percentage
                    ? prev
                    : current
                ).subjectName
              }
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Needs Attention</p>
            <p className="font-bold text-red-700 text-lg">
              {
                reportData.reduce((prev, current) =>
                  (prev.marks?.average || 100) < (current.marks?.average || 100)
                    ? prev
                    : current
                ).subjectName
              }
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-2 ">
        <button onClick={sendReportToParent} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:cursor-pointer">
          Send To Parent
        </button>
      </div>
    </div>
  );
};

export default AcademicReportCard;
