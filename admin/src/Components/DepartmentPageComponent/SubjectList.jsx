import React, { useMemo , useState} from 'react'
import { useSelector } from 'react-redux'
import { CLASS_LIST } from '../../app/appConstants'
import { useNavigate } from 'react-router'

const SubjectList = () => {
    const {subjectList , facultyList} = useSelector(state => state.department)
    const navigate = useNavigate()
  
    const subjects = useMemo(() => {
        let tempList = subjectList.map(item => {
            let faculty = facultyList.filter(f => f._id == item.facultyId)[0]
            let obj = {...item , facultyName : faculty?.name || ""}
            return obj
        })

        return tempList
    },[subjectList , facultyList])
    
    const [currentPage, setCurrentPage] = useState(1);
    const [filterYear, setFilterYear] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const itemsPerPage = 8;
  
   
    const filteredSubjects = subjects.filter(subject => {
      return (
        (filterYear === 'all' || subject.year === filterYear) &&
        (filterType === 'all' || subject.type === filterType)
      );
    });
  
    const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSubjects = filteredSubjects.slice(indexOfFirstItem, indexOfLastItem);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
    const uniqueTypes = [...new Set(subjects.map(subject => subject.type))];
  
    return (
      <div className="container mx-auto md:px-4 md:py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Subject List</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Year</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterYear}
              onChange={(e) => {
                setFilterYear(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Years</option>
              {CLASS_LIST.map(year => (
                <option key={year} value={year}>
                  {year.charAt(0).toUpperCase() + year.slice(1).replace('year', ' Year ')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <div className="bg-white shadow-md rounded-lg overflow-auto">
          <table className="min-w-full divide-y divide-gray-200 overflow-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (min)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Periods</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSubjects.length > 0 ? (
                currentSubjects.map((subject) => (
                  <tr onClick={() => navigate("/editsubject" , {state : {subjectData : subject}})} key={subject._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {subject.year.replace('year', 'Year ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.facultyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subject.type === 'theory' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {subject.type.charAt(0).toUpperCase() + subject.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.totalPeriods}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No subjects found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
  
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, filteredSubjects.length)}
              </span>{' '}
              of <span className="font-medium">{filteredSubjects.length}</span> subjects
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-50 hover:bg-blue-100'}`}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-blue-50 hover:bg-blue-100'}`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-50 hover:bg-blue-100'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
}

export default SubjectList