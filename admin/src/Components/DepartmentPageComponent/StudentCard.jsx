
const StudentCard = ({ student }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Header with student name and ID */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white truncate">{student.studentName}</h3>
        <p className="text-blue-100 text-sm">Reg No: {student.registerNo}</p>
      </div>
      
      {/* Student details */}
      <div className="p-6 space-y-3">
        <div className="flex items-center">
          <span className="text-gray-500 w-24 font-medium">Email:</span>
          <span className="text-gray-800 ">{student.email || 'N/A'}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-500 w-24 font-medium">Year:</span>
          <span className="text-gray-800 capitalize">{student.studentYear || 'year1'}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-500 w-24 font-medium">Attendance:</span>
          <span className="text-gray-800">
            {student.attendancePercentage ? `${parseInt(student.attendancePercentage) }%` : 'N/A'}
          </span>
        </div>

        <div className="flex items-center">
          <span className="text-gray-500 w-24 font-medium">Gender:</span>
          <span className="text-gray-800 capitalize">{student.gender || 'N/A'}</span>
        </div>
      </div>
      
      {/* Footer with department */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">ECE Department</span>
          {student.attendance && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              student.attendance >= 75 ? 'bg-green-100 text-green-800' : 
              student.attendance >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {student.attendance >= 75 ? 'Good' : student.attendance >= 50 ? 'Average' : 'Low'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCard