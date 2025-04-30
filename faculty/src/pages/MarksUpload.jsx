import React, { useState, useEffect, useContext, useMemo } from "react";
import { API_STATUS, DataContext } from "../context/DataProvider";
import { toast } from "react-toastify";
import { FiUpload, FiLoader } from "react-icons/fi";
import api from "../api/api";

const MarksUpload = () => {
  const { facultyData, token } = useContext(DataContext);
  const subjects = useMemo(() => {
    return facultyData?.facultyDetails?.subjects || [];
  }, [facultyData]);

  const [students, setStudents] = useState([]);
  const [apiStatus, setApiStatus] = useState({ status: API_STATUS.IDLE });
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("internal1");
  const [marksData, setMarksData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSubjectCode = (subjectId) => {
    const subject = subjects.find(sub => sub._id === subjectId);
    return subject?.code || '';
  };

  useEffect(() => {
    if (!selectedSubject) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      try {
        setApiStatus({ status: API_STATUS.LOADING });
        const subjectCode = getSubjectCode(selectedSubject);
        
        const response = await api.get(`/studentListWithMarks/${subjectCode}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const {data} = response;
        
        if (data.success) {
          setStudents(data.studentList);
          setApiStatus({ status: API_STATUS.SUCCESS });
        } else {
          toast.error(data.message);
          setApiStatus({ 
            status: API_STATUS.FAILURE, 
            errMsg: data.message 
          });
        }
      } catch (error) {
        toast.error(error.message);
        setApiStatus({ 
          status: API_STATUS.FAILURE, 
          errMsg: error.message 
        });
      }
    };

    fetchStudents();
  }, [selectedSubject, token]);

  useEffect(() => {
    if (selectedSubject && students.length > 0) {
      const initialMarks = students.map((student) => ({
        studentId: student.studentId,
        studentName: student.studentName,
        registerNo: student.registerNo,
        mark: student.marks[selectedExam] || "",
      }));
      setMarksData(initialMarks);
    }
  }, [selectedSubject, students, selectedExam]);

  const handleMarkChange = (studentId, value) => {
    setMarksData((prev) =>
      prev.map((item) =>
        item.studentId === studentId ? { ...item, mark: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedSubject) {
      toast.error("Please select a subject");
      return;
    }

    const invalidMarks = marksData.some(item => 
      item.mark === "" || isNaN(item.mark) || item.mark < 0 || item.mark > 100
    );
    
    if (invalidMarks) {
      toast.error("Please enter valid marks (0-100) for all students");
      return;
    }

    setIsLoading(true);

    try {
      const payload = marksData.map((item) => ({
        subjectId: selectedSubject,
        studentId: item.studentId,
        [selectedExam]: Number(item.mark),
      }));
      console.log(payload);
      
      const response = await api.post("/uploadmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const {data} = response;
      
      if (data.success) {
        toast.success("Marks uploaded successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error uploading marks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (apiStatus.status === API_STATUS.LOADING && !selectedSubject) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-blue-500 text-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Student Marks</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select Subject</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={isLoading}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.code} - {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select Exam Type</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            disabled={isLoading}
          >
            <option value="internal1">Internal 1</option>
            <option value="internal2">Internal 2</option>
          </select>
        </div>
      </div>

      {apiStatus.status === API_STATUS.LOADING && selectedSubject && (
        <div className="flex justify-center items-center h-32">
          <FiLoader className="animate-spin text-blue-500 text-2xl" />
          <span className="ml-2 text-gray-600">Loading students...</span>
        </div>
      )}

      {apiStatus.status === API_STATUS.SUCCESS && selectedSubject && (
        <div className="overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-700">Enter Marks for Students</h4>
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  Upload Marks
                </>
              )}
            </button>
          </div>

          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Register No
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mark
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {marksData.map((student) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.registerNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        min="0"
                        max="100"
                        value={student.mark}
                        onChange={(e) =>
                          handleMarkChange(student.studentId, e.target.value)
                        }
                        disabled={isLoading}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {apiStatus.status === API_STATUS.FAILURE && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading students: {apiStatus.errMsg}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksUpload;