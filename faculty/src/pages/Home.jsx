import React, { useState, useContext } from "react";
import { DataContext } from "../context/DataProvider";
import { API_STATUS } from "../context/DataProvider";
import withApiStatus from "../components/HigherOrderComponent/withApiStatus";
import Loader from "../components/stateLessComponents/Loader";
import Failure from "../components/stateLessComponents/Failure";
import Tab from "../components/stateLessComponents/Tab";
import TodayAttendanceList from "../components/TodayAttendanceList";

const Home = () => {
  return (
    <div className="p-4 sm:p-6">
      <TodayAttendanceList />
    </div>
  );
};

export default withApiStatus(Home, "Today Update");
