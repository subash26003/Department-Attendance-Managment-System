import React, { useEffect, useMemo, useState } from "react";
import AttendanceReportGenerator from "../ReportGenerators/AttendanceReportGenerator";
import { useNavigate } from "react-router-dom";

const StudentList = ({ students, subjectName, advisorList }) => {
  const [gender, setGender] = useState("");
  const navigate = useNavigate();
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      if (gender.length > 0) {
        return student.gender == gender;
      }
      return true;
    });
  }, [gender, students]);

  const handleReportButton = (studentData) => {
    console.log(studentData);
    navigate("/studentreport", { state: { studentData } });
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800">
          Student List - <span>{filteredStudents.length}</span>
        </h2>
        <select
          onChange={(e) => setGender(e.target.value)}
          className="border px-2 py-2 rounded"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Desktop Table (shown on md screens and up) */}
      <div className="hidden md:block overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Register No
              </th>
              <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-0 md:ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.studentName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-500">
                  {student.registerNo}
                </td>
                <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-500">
                  {student.gender}
                </td>
                <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-500">
                  {student.mobileNo}
                </td>
                <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-500">
                  {student.studentYear || student.year}
                </td>
                <td
                  className={`px-4 py-4 md:px-6 whitespace-nowrap text-sm font-medium ${
                    parseInt(student.attendancePercentage) <= 75
                      ? "bg-red-400"
                      : "text-gray-500"
                  }`}
                >
                  {parseInt(student.attendancePercentage)}%
                </td>
                {advisorList && (
                  <td>
                    <button
                      onClick={() => handleReportButton(student)}
                      className="hover:cursor-pointer px-2 py-2 text-sm rounded bg-blue-500 text-white"
                    >
                      View Report
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {filteredStudents.map((student) => (
          <div
            key={student._id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">
                  {student.studentName}
                </h3>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  parseInt(student.attendancePercentage) <= 75
                    ? "bg-green-100 text-red-400"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {parseInt(student.attendancePercentage)}%
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Register No</p>
                <p>{student.registerNo}</p>
              </div>
              <div>
                <p className="text-gray-500">Gender</p>
                <p>{student.gender}</p>
              </div>
              <div>
                <p className="text-gray-500">Mobile</p>
                <p>{student.mobileNo}</p>
              </div>
              <div>
                <p className="text-gray-500">Year</p>
                <p>{student.studentYear}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => handleReportButton(student)}
                className="hover:cursor-pointer px-2 py-2 text-sm rounded bg-blue-500 text-white mt-2"
              >
                View Report
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-5">
        <AttendanceReportGenerator
          studentList={filteredStudents}
          subjectName={subjectName}
        />
      </div>
    </div>
  );
};

export default StudentList;
