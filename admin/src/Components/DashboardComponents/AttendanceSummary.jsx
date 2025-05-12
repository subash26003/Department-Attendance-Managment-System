const AttendanceSummary = ({ data = []}) => {
  const totalRecords = data.length;

  
  const above75 = data.filter(
    (student) => Number.parseInt(student.attendancePercentage) >= 75 
  ).length;
  const below75 = data.filter(
    (student) => Number.parseInt(student.attendancePercentage) < 75
  ).length;
  
  const average =
    data.reduce(
      (a, student) => a + Number.parseInt(student.attendancePercentage),
      0
    ) / totalRecords;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Student Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Total Students</h3>
          <p className="text-2xl font-bold">{totalRecords}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Above 75%</h3>
          <p className="text-2xl font-bold">{above75}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Below 75%</h3>
          <p className="text-2xl font-bold">{below75}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">Average</h3>
          <p className="text-2xl font-bold">{parseInt(average)}%</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
