import { useState } from "react";
import { useNavigate } from "react-router";

const FacultyList = ({ facultyList }) => {
  const navigate = useNavigate()
   
  return (
    <div className="border border-gray-200 rounded-2xl p-2">
      

      <ul>
        {facultyList.map((faculty, idx) => (
          <div
            onClick={() => navigate("/editfaculty" , {state : {facultyData : faculty}})}
            key={idx}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`px-6 py-4 flex justify-between items-center ${
                faculty.classAdvisor ? "bg-blue-600" : "bg-blue-500"
              }`}
            >
              <h3 className="text-xl font-bold text-white">{faculty.name}</h3>
              {faculty.classAdvisor && (
                <span className="bg-yellow-400 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {faculty.classAdvisor} Advisor
                </span>
              )}
            </div>
            <div className="p-6 space-y-3">
              <div className="flex">
                <span className="text-gray-600 font-medium w-24">Email:</span>
                <span className="text-gray-800">{faculty.email}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 font-medium w-24">Gender:</span>
                <span className="text-gray-800 capitalize">
                  {faculty.gender}
                </span>
              </div>
              <div className="flex">
                <span className="text-gray-600 font-medium w-24">Role:</span>
                <span className="text-gray-800">
                  {faculty.designation || "Faculty"}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3">
              <span className="text-sm text-gray-600">ECE Department</span>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default FacultyList;
