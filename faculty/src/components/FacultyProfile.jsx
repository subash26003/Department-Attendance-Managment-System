import React, { useContext, useEffect, useMemo, useState } from "react";
import { DataContext } from "../context/DataProvider";
import withApiStatus from "./HigherOrderComponent/withApiStatus";
import LeaveForm from "./LeaveForm";
import Tab from "./stateLessComponents/Tab";

const FacultyProfile = () => {
  const { facultyData, apiStatus } = useContext(DataContext);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const faculty = useMemo(() => {
    return facultyData ? facultyData.facultyDetails : {};
  }, [apiStatus.status]);

  const FacultyTimetable = () => {
    return (
      <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Teaching Schedule
          </h2>
          <Tab
            tabList={Object.keys(facultyData.dayWisePeriods)}
            currentTab={selectedDay}
            setCurrentTab={setSelectedDay}
          />
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedDay}'s Classes
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facultyData.dayWisePeriods[selectedDay]?.map(
                  (entry, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.subjectName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.year.toUpperCase().replace("YEAR", "Year ")}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const ProfileCard = () => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-1 rounded-full">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                {faculty.name?.charAt(0)}
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white">{faculty.name}</h2>
          <p className="text-blue-100">{faculty.designation}</p>
          <p className="text-blue-100 mt-1">{faculty.department}</p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Contact Information
            </h3>
            <div className="space-y-2">
              <p className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {faculty.email}
              </p>
            </div>
          </div>

          {faculty.classAdvisor && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Class Advisor
              </h3>
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {faculty.classAdvisor.toUpperCase()}
              </span>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Subjects Handled
            </h3>
            <div className="flex flex-wrap gap-2">
              {faculty.subjects?.map((subject, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {subject.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProfileCard />
        </div>
        <div className="lg:col-span-2">
          <FacultyTimetable />
        </div>
      </div>
    </div>
  );
};

export default withApiStatus(FacultyProfile, "Profile");
