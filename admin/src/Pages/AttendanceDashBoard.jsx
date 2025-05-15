import { useEffect, useState, useMemo } from "react";
import Heading from "../Components/stateLessComponents/Heading";
import { API_STATUS } from "../app/appConstants";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import api from "../api/api";
import Loader from "../Components/stateLessComponents/Loader";
import FailueView from "../Components/stateLessComponents/FailueView";
import AttendanceSummary from "../Components/DashboardComponents/AttendanceSummary";
import SubjectWiseAnalysis from "../Components/DashboardComponents/SubjectWiseAnalysis";
import StudentAttendanceHistory from "../Components/DashboardComponents/StudentAttendanceHistory";
import { useSelector } from "react-redux";

const AttendanceDashBoard = () => {
  const {dates} = useSelector((state) => state.department)

  const [data, setData] = useState();
  const [apiResponse, setApiResponse] = useState({
    status: API_STATUS.LOADING,
    errMsg: "",
  });

  const [viewMode, setViewMode] = useState("summary");

  const [selectedYear, setSelectedYear] = useState("year1");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const [startDate, setStartDate] = useState(dates[selectedYear]?.startDate);
  const [endDate, setEndDate] = useState(dates[selectedYear]?.endDate);

  // Filter data based on selections

  const { subjectList } = useSelector((state) => state.department);

  const filteredSubjects = useMemo(() => {
    return subjectList.filter(
      (item) => item.year == selectedYear || selectedYear == "all"
    );
  }, [selectedYear, subjectList]);

  const token = Cookies.get("admin_token");

  const fetchAttendanceRecords = async () => {
    setApiResponse({ status: API_STATUS.LOADING });
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let year = selectedYear == "all" ? "" : selectedYear;
      let subjectCode = selectedSubject == "all" ? "" : selectedSubject;
      let sDate = startDate === "" ? "" : new Date(startDate).toISOString().split('T')[0];
      let eDate = startDate == "" ? "" : new  Date(endDate).toISOString().split("T")[0]
      if(sDate > eDate){
        toast.info("Start should Less then End")
        sDate = ""
        eDate = ""
      }

      let query = `/dashboard?year=${year}&subjectCode=${subjectCode}&startDate=${sDate}&endDate=${eDate}`;
      const response = await api.get(query, options);

      if (response.data.success) {
        setData(response.data.data);
        setApiResponse({ status: API_STATUS.SUCCESS });
      } else {
        setApiResponse({
          status: API_STATUS.FAILURE,
          errMsg: response.data.message,
        });
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
      setApiResponse({ status: API_STATUS.FAILURE, errMsg: error.message });
    }
  };
  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const renderSuccessView = () => {
    return (
      <div className=" p-1 md:p-4 bg-gray-50 min-h-full">
        {viewMode === "summary" && (
          <AttendanceSummary data={data.studentSummary} />
        )}
        {viewMode === "subject" && (
          <SubjectWiseAnalysis data={data.subjectSummary} />
        )}
        {viewMode === "student" && (
          <StudentAttendanceHistory data={data.studentSummary} startDate={startDate} endDate={endDate} />
        )}
      </div>
    );
  };

  const renderView = () => {
    switch (apiResponse.status) {
      case API_STATUS.LOADING:
        return <Loader />;
      case API_STATUS.FAILURE:
        return <FailueView error={apiResponse.errMsg} />;
      case API_STATUS.SUCCESS:
        return renderSuccessView();
    }
  };

  return (
    <div className="border border-gray-200 bg-white rounded-xl h-full md:p-3">
      <Heading title={" Attendance Dashboard"} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Academic Year
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setSelectedSubject("all");
            }}
          >
            <option value="year1">First Year</option>
            <option value="year2">Second Year</option>
            <option value="year3">Third Year</option>
            <option value="year4">Fourth Year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
            }}
          >
            <option value="all">All Subjects</option>
            {filteredSubjects.map((item) => (
              <option key={item._id} value={item.code}>
                {item.code}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={() => {
              setSelectedYear("year1");
              setSelectedSubject("all");
            }}
            className="w-full p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Reset Filters
          </button>
          <button
            onClick={fetchAttendanceRecords}
            className="w-full p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            viewMode === "summary"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setViewMode("summary")}
        >
          Summary
        </button>

        <button
          className={`py-2 px-4 font-medium ${
            viewMode === "subject"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setViewMode("subject")}
        >
          Subject Analysis
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            viewMode === "student"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setViewMode("student")}
        >
          Student History
        </button>
      </div>
      {renderView()}
    </div>
  );
};

export default AttendanceDashBoard;
