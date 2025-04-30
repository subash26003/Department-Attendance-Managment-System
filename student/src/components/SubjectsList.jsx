import Title from "./Title";

const SubjectsList = ({ subjects }) => {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <Title title={"Attendance by Subject"} />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-500">
                    {subject.subjectCode}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subject.subjectName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={` px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subject.attendance >= 85 ? 'bg-green-100 text-green-800' :
                      subject.attendance >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {Number.parseInt(subject.percentage)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
export default SubjectsList