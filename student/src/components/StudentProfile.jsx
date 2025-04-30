import React, { useContext } from 'react';
import { StudentDataContext } from '../context/StudentDataContext';
import { withApiStatus } from './HOComponent/withApiStatus';

const StudentDataProfile = () => {
    const {studentData} = useContext(StudentDataContext)
    const {student} = studentData
  return (
    <div className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-700 px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                <div className="h-24 w-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
                  {student.name.charAt(0)}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">{student.name}</h1>
                <p className="text-indigo-200 mt-1">{student.registerNo}</p>
                <p className="text-indigo-200 mt-1">{student.studentYear.replace('year', 'Year ')} StudentData</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-8 sm:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile Number</p>
                <p className="text-gray-800">{student.mobileNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-gray-800 capitalize">{student.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">StudentData ID</p>
                <p className="text-gray-800 font-mono">{student._id}</p>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Academic Information</h2>
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="text-gray-800">{student.studentYear.replace('year', 'Year ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Number</p>
                <p className="text-gray-800">{student.registerNo}</p>
              </div>
              
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default withApiStatus(StudentDataProfile);