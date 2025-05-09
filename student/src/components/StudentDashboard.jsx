import React, { useContext, useMemo } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { StudentDataContext } from "../context/StudentDataContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StudentDashboard = () => {
  const { studentData } = useContext(StudentDataContext);

  const { student, studentReport } = studentData;
  const avgMark = useMemo(() => {
    return studentReport.map((item) => {
      let i1 = item?.marks?.internal1;
      let i2 = item?.marks?.internal2;

      if (!i2) {
        return i1;
      }
      return (i1 + i2) / 2;
    });
  }, [studentReport]);
  // Calculate overall attendance percentage
  const overallAttendance = studentReport.reduce(
    (acc, subject) => {
      return {
        attended: acc.attended + subject.attendance.classesAttended,
        total: acc.total + subject.attendance.totalClasses,
      };
    },
    { attended: 0, total: 0 }
  );

  const overallPercentage = Math.round(
    (overallAttendance.attended / overallAttendance.total) * 100
  );

  // Prepare data for charts
  const attendanceChartData = {
    labels: studentReport.map((item) => item.subjectCode),
    datasets: [
      {
        label: "Attendance %",
        data: studentReport.map((item) => item.attendance.percentage),
        backgroundColor: studentReport.map(
          (item) =>
            item.attendance.percentage >= 90
              ? "#10B981" // green
              : item.attendance.percentage >= 75
              ? "#F59E0B" // yellow
              : "#EF4444" // red
        ),
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const performancePieData = {
    labels: ["Excellent (≥90%)", "Good (75-89%)", "Needs Improvement (<75%)"],
    datasets: [
      {
        data: [
          studentReport.filter((item) => item.attendance.percentage >= 90)
            .length,
          studentReport.filter(
            (item) =>
              item.attendance.percentage >= 75 &&
              item.attendance.percentage < 90
          ).length,
          studentReport.filter((item) => item.attendance.percentage < 75)
            .length,
        ],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className=" md:p-6 bg-gray-50 min-h-screen">
      {/* Student Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-2 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
            {student.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Register No</p>
                <p className="font-medium">{student.registerNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{student.studentYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Overall Attendance</p>
                <p
                  className={`font-bold text-lg ${
                    overallPercentage >= 90
                      ? "text-green-600"
                      : overallPercentage >= 75
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {overallPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className=" gap-6 mb-6">
        {/* Attendance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Subject-wise Attendance
          </h2>
          <div className="h-96">
            <Bar
              data={attendanceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        `${context.parsed.y}% (${
                          studentReport[context.dataIndex].attendance
                            .classesAttended
                        }/${
                          studentReport[context.dataIndex].attendance
                            .totalClasses
                        })`,
                    },
                  },
                },
                scales: {
                  y: {
                    min: 0,
                    max: 100,
                    ticks: {
                      callback: (value) => `${value}%`,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Attendance Distribution
          </h2>
          <div className="h-64">
            <Pie
              data={performancePieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Subject Details Table */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Detailed Subject Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Internal 1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Internal 2
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentReport.map((subject) => (
                  <tr key={subject.subjectCode} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{subject.subjectName}</div>
                      <div className="text-sm text-gray-500">
                        {subject.subjectCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`font-medium ${
                            subject.attendance.percentage >= 90
                              ? "text-green-600"
                              : subject.attendance.percentage >= 75
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {subject.attendance.percentage}%
                        </span>
                        <div className="ml-3 w-24 bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              subject.attendance.percentage >= 90
                                ? "bg-green-500"
                                : subject.attendance.percentage >= 75
                                ? "bg-yellow-400"
                                : "bg-red-400"
                            }`}
                            style={{
                              width: `${subject.attendance.percentage}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {subject.attendance.classesAttended}/
                        {subject.attendance.totalClasses} classes
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subject?.marks?.internal1 >= 90
                            ? "bg-green-100 text-green-800"
                            : subject?.marks?.internal1 >= 75
                            ? "bg-yellow-100 text-yellow-800"
                            : subject?.marks?.internal1 >= 50
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subject?.marks?.internal1 || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          subject?.marks?.internal2 >= 90
                            ? "bg-green-100 text-green-800"
                            : subject?.marks?.internal2 >= 75
                            ? "bg-yellow-100 text-yellow-800"
                            : subject?.marks?.internal2 >= 50
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {subject?.marks?.internal2 || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
