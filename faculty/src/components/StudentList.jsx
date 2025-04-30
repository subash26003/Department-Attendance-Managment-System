import React from 'react';

const StudentList = ({ data }) => {
    const {count , studentList} = data
    
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Student List
        </h2>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
          Absent: {count}/{studentList.length}
        </span>
      </div>

      <div className="space-y-3">
        {studentList.map((student) => (
          <div 
            key={student.registerNo} 
            className={`border-b pb-3 last:border-b-0 ${
              student.status === 'absent' ? 'bg-red-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`font-medium ${
                  student.status === 'absent' ? 'text-red-800' : 'text-gray-800'
                }`}>
                  {student.name}
                  {student.status === 'absent' && (
                    <span className="ml-2 text-red-600">(Absent)</span>
                  )}
                </p>
                <p className="text-sm text-gray-600">ID: {student.registerNo}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Year: {student.studentYear.replace('year', 'Year ')}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  Gender: {student.gender}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default StudentList;