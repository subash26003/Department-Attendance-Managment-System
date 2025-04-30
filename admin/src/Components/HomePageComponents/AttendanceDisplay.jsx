import React, { useState } from 'react';

const AttendanceTable = ({ attendanceData }) => {
  
  const [expandedRow, setExpandedRow] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  const filteredData = selectedPeriod 
    ? attendanceData.filter(item => item.period === selectedPeriod)
    : attendanceData;

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Year 1 Attendance Records</h2>
      
      {filteredData.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 text-lg">No attendance records found</p>
          <p className="text-sm text-gray-400 mt-1">
            {selectedPeriod ? `for Period ${selectedPeriod}` : ''}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((record, index) => (
                <React.Fragment key={`${record._id}-${index}`}>
                  <tr 
                    className={`hover:bg-gray-50 cursor-pointer ${expandedRow === index ? 'bg-blue-50' : ''}`}
                    onClick={() => toggleRow(index)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.day}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{record.subjectName}</div>
                      <div className="text-gray-500">{record.subjectCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.absentList?.length > 0 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {record.absentList?.length || 0} absent
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(index);
                        }}
                      >
                        {expandedRow === index ? 'Hide' : 'Show'} students
                      </button>
                    </td>
                  </tr>
                  {expandedRow === index && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="px-6 py-4">
                        <div className="bg-white border rounded-lg p-4 shadow-sm">
                          <h4 className="font-medium text-gray-700 mb-3">Absent Students</h4>
                          {record.absentList?.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {record.absentList.map((student, idx) => (
                                <div key={idx} className="border rounded-md p-3 hover:bg-gray-50">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">{student.name}</p>
                                      <p className="text-sm text-gray-500">{student.registerNo}</p>
                                    </div>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      Absent
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">No absent students for this session</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


export default AttendanceTable;