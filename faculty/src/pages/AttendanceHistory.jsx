import React, { useContext, useEffect, useMemo, useState } from "react";
import { API_STATUS, DataContext } from "../context/DataProvider";
import withApiStatus from "../components/HigherOrderComponent/withApiStatus";
import Tab from "../components/stateLessComponents/Tab";
import { toast } from "react-toastify";
import api from "../api/api";
import Failure from "../components/stateLessComponents/Failure";
import Loader from "../components/stateLessComponents/Loader";
import AttendanceMatrix from "../components/AttendanceMatrix";

const AttendanceHistory = () => {

  const { facultyData, token , semesterDates} = useContext(DataContext);

  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2025-05-10");

  const [apiStatus, setApiStatus] = useState({
    status: API_STATUS.LOADING,
    errMsg: "",
  });

  const subjectsList = useMemo(() => {
    return facultyData.facultyDetails.subjects;
  }, [facultyData]);

  const subjectNames = useMemo(() => {
    return subjectsList.map((item) => item.name);
  }, [subjectsList]);

  const [selectedSubject, setSelectedSubject] = useState(subjectNames[0]);
  const [responseData, setResponseData] = useState();

  const getAttendanceDatas = async (code) => {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate: fromDate,
          endDate: toDate,
        },
      };
      const response = await api.get(`/attendance/history/${code}`, options);
      const data = response.data;
      console.log(data);
      if (data.success) {
        setResponseData(data.data);
        setApiStatus({ status: API_STATUS.SUCCESS });
      } else {
        toast.error(response.message);
        setApiStatus({ status: API_STATUS.FAILURE, errMsg: data.message });
      }
    } catch (error) {
      toast.error(error.message);
      setApiStatus({ status: API_STATUS.FAILURE, errMsg: error.message });
      console.log(error.message);
    }
  };
  useEffect(() => {
    let code = "";
    for (let i = 0; i < subjectsList.length; i++) {
      if (subjectsList[i].name == selectedSubject) {
        code = subjectsList[i].code;
        break;
      }
    }
    setApiStatus({ status: API_STATUS.LOADING });
    getAttendanceDatas(code);
  }, [selectedSubject , fromDate , toDate]);

  useEffect(() => {
    let subject = subjectsList.find(item => item.name == selectedSubject)
    if(subject){
      let {year }= subject
      setFromDate(semesterDates[year]?.startDate)
      setToDate(semesterDates[year]?.endDate)
    }
   
  },[selectedSubject])

  const renderView = (apiStatus) => {
    switch (apiStatus.status) {
      case API_STATUS.LOADING:
        return <Loader />;
      case API_STATUS.FAILURE:
        return <Failure message={apiStatus.errMsg} />;
      case API_STATUS.SUCCESS:
        return (
          <AttendanceMatrix
            students={responseData.studentList}
            absents={responseData.attendanceHistory}
          />
        );
    }
  };
  return (
    <div className="md:p-2">
      <Tab
        tabList={subjectNames}
        currentTab={selectedSubject}
        setCurrentTab={setSelectedSubject}
      />

      <div className="flex gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      {renderView(apiStatus)}
    </div>
  );
};

export default withApiStatus(AttendanceHistory, "Attendance Overview");
