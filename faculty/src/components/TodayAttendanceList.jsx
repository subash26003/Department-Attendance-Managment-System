import React, { useContext, useEffect, useState } from "react";
import { API_STATUS, DataContext, WEEK_DAYS } from "../context/DataProvider";
import Tab from "./stateLessComponents/Tab";
import { toast } from "react-toastify";
import api from "../api/api.js";
import Loader from "./stateLessComponents/Loader.jsx";
import Failure from "./stateLessComponents/Failure.jsx";
import AbsentStudentList from "./StudentList.jsx";

const filteredPeriods = WEEK_DAYS.filter(day => !["Sunday" , "Saturday"].includes(day))
console.log(filteredPeriods);
console.log(filteredPeriods[new Date().getDay() - 2]);

const TodayAttendanceList = () => {

  const { facultyData, token } = useContext(DataContext);
  const { dayWisePeriods, facultyDetails } = facultyData;
  const { subjects } = facultyDetails;

  const todayPeriods = dayWisePeriods[filteredPeriods[new Date().getDay() - 1]];

  const tabList = todayPeriods.map(
    (item) => item.period + "-" + item.subjectName
  );

  const [selectedPeriod, setSelectedPeriod] = useState(tabList[0]);
  const [apiResponse, setApiResponse] = useState({
    status: API_STATUS.LOADING,
    errMsg: "",
  });

  const [attendanceList, setAttendanceList] = useState();

  useEffect(() => {
    let arr = selectedPeriod.split("-");
    let period = arr[0],
      subjectName = arr[1];
    const subjectData = subjects.filter((item) => item.name == subjectName)[0];
    console.log(subjectData);
    console.log(arr);

    const requestParams = {
      subjectCode: subjectData.code,
      period: period,
      day : WEEK_DAYS[new Date().getDay()]
    };

    const getTodayAttendanceList = async (requestParams) => {
      try {
        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: requestParams,
        };
        const response = await api.get(`/todayAttendance`, options);

        const data = response.data;

        if (data.success) {
          setAttendanceList(data.data);
          setApiResponse({ status: API_STATUS.SUCCESS });
        } else {
          toast.error(data.message);
          setApiResponse({ status: API_STATUS.FAILURE, errMsg: "Attendance Not Updated" });
        }
      } catch (error) {
        toast.error(error.message);
        setApiResponse({ status: API_STATUS.FAILURE, errMsg: error.message });
        console.log(error.message);
      }
    };

    getTodayAttendanceList(requestParams);
  }, [selectedPeriod]);

  const renderView = (apiResponse) => {
    switch (apiResponse.status) {
      case API_STATUS.LOADING:
        return <Loader />;
      case API_STATUS.FAILURE:
        return <Failure message={apiResponse.errMsg} />;
      case API_STATUS.SUCCESS:
        return <AbsentStudentList data={attendanceList} />;
    }
  };
  return (
    <div>
      <Tab
        tabList={tabList}
        currentTab={selectedPeriod}
        setCurrentTab={setSelectedPeriod}
      />
      {renderView(apiResponse)}
    </div>
  );
};

export default TodayAttendanceList;
