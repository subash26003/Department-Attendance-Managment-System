import api from "../../api/api";
import Tab from "../stateLessComponents/Tab";
import { API_STATUS, CLASS_LIST } from "../../app/appConstants";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../stateLessComponents/Loader";
import FailueView from "../stateLessComponents/FailueView";
import AttendanceReportGenerator from "../ReportGenerator/AttendanceReportGenerator";
import { useNavigate } from "react-router";

const StudentList = () => {
  const [currentTab, setCurrentTab] = useState(CLASS_LIST[0]);

  const [studentList, setStudentList] = useState([]);

  const [gender, setGender] = useState("");

  const navigate = useNavigate()

  const filteredStudents = useMemo(() => {
    return studentList.filter((student) => {
      if (gender.length > 0) {
        return student.gender == gender;
      }
      return true;
    });
  }, [gender, studentList]);

  const [responseData, setResponseData] = useState({
    status: API_STATUS.LOADING,
    errorMsg: "",
  });

  const getStudentList = async () => {
    setResponseData({ status: API_STATUS.LOADING });
    try {
      const selectedYear = currentTab;
      const response = await api.get(`/studenList/${selectedYear}`);
      const data = response.data;

      // console.log(data.studentList);

      if (data.success) {
        setStudentList(data.studentList);
        setResponseData({ status: API_STATUS.SUCCESS });
      } else {
        toast.info(data.message);
        setResponseData({ status: API_STATUS.FAILURE, errorMsg: data.message });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      setResponseData({ status: API_STATUS.FAILURE, errorMsg: error.message });
    }
  };

  useEffect(() => {
    getStudentList();
  }, [currentTab]);

  const handleInfo = (student) => {
    navigate("/editstudent" , {state : {studentData : student}})
  }

  const rederSuccessView = () => {
    // console.log(studentList);
    const count = filteredStudents.length;
    return (
      <div className="space-y-6 p-2">
        <div className="flex justify-between items-center px-2">
          <div className="">
            <h2 className="text-2xl font-bold text-gray-800">Students</h2>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Total: {count || filteredStudents.length}
          </span>
        </div>

        <select
          onChange={(e) => setGender(e.target.value)}
          className="border px-2 py-2 rounded"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <div className="hidden md:block overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Register No
                </th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-4 py-3 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr
                  onClick={() => handleInfo(student)}
                  key={student._id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-0 md:ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.studentName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-500">
                    {student.registerNo}
                  </td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-500">
                    {student.gender}
                  </td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-500">
                    {student.mobileNo}
                  </td>
                  <td className="px-4 py-4 md:px-6 whitespace-nowrap text-sm text-gray-500">
                    {student.studentYear || student.year}
                  </td>
                  <td
                    className={`px-4 py-4 md:px-6 whitespace-nowrap text-sm font-medium ${
                      parseInt(student.attendancePercentage) <= 75
                        ? "bg-red-400"
                        : "text-gray-500"
                    }`}
                  >
                    {parseInt(student.attendancePercentage)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {student.studentName}
                  </h3>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    parseInt(student.attendancePercentage) <= 75
                      ? "bg-green-100 text-red-400"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {parseInt(student.attendancePercentage)}%
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Register No</p>
                  <p>{student.registerNo}</p>
                </div>
                <div>
                  <p className="text-gray-500">Gender</p>
                  <p>{student.gender}</p>
                </div>
                <div>
                  <p className="text-gray-500">Mobile</p>
                  <p>{student.mobileNo}</p>
                </div>
                <div>
                  <p className="text-gray-500">Year</p>
                  <p>{student.studentYear}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-5">
          <AttendanceReportGenerator
            studentList={filteredStudents}
            subjectName={"Overall"}
          />
        </div>
      </div>
    );
  };

  const renderView = (responseData) => {
    switch (responseData.status) {
      case API_STATUS.LOADING:
        return <Loader />;
      case API_STATUS.FAILURE:
        return <FailueView error={responseData.errorMsg} />;
      case API_STATUS.SUCCESS:
        return rederSuccessView();
    }
  };

  return (
    <div className="border border-gray-200 rounded-2xl">
      <Tab
        tabList={CLASS_LIST}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      {renderView(responseData)}
    </div>
  );
};

export default StudentList;
