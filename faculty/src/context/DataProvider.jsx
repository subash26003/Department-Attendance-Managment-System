/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../api/api";
import { toast } from "react-toastify";

export const DataContext = createContext();

export const API_STATUS = {
  LOADING: "Loading",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  IDLE: "IDLE",
};

export const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DataProvider = ({ children }) => {
  const token = Cookies.get("jwt_token");

  const [facultyData, setFacultyData] = useState();
  const [apiStatus, setApiStatus] = useState({
    status: API_STATUS.LOADING,
    err: "",
  });

  const [user, setUser] = useState(token ? true : false);
  const [semesterDates, setSemesterDates] = useState();

  const getInitialData = async () => {
    setApiStatus({ status: API_STATUS.LOADING });
    const option = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await api.get("/initialData", option);
      const data = response.data;
      if (data.success) {
        console.log(data);

        setFacultyData(data.data);
        setApiStatus({ status: API_STATUS.SUCCESS });
      } else {
        toast.error(data.message);
        console.log(data);

        setApiStatus({ err: data.message, status: API_STATUS.FAILURE });
      }
    } catch (error) {
      setApiStatus({ err: error.message, status: API_STATUS.FAILURE });
      console.log(error.message + " ERROR");
    }
  };

  const getSemesterDates = async () => {
    try {
      const option = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.get("/semester", option);

      const data = response.data;
      if (data) {
        let dates = {};
        data.dates.forEach((item) => {
          let obj = {};
          let sDate = item.startDate.split("T")[0];
          let eDate = item.endDate.split("T")[0];
          let year = "year" + item.year;
          obj = {
            startDate: sDate,
            endDate: eDate,
          };
          dates[year] = obj;
        });
        setSemesterDates(dates);
        console.log(dates);
        
      }
    } catch (error) {
      console.log(error.message + " ERROR");
    }
  };

  const setDocumentTitle = (name) => {
    document.title = name;
  };

  useEffect(() => {
    if (facultyData?.facultyDetails) {
      const name = facultyData?.facultyDetails.name || "Faculty";
      setDocumentTitle(name);
    }
  }, [facultyData, apiStatus.status]);

  useEffect(() => {
    if (user) {
      getInitialData();
      getSemesterDates();
    }
  }, [token, user]);

  const value = {
    token,
    facultyData,
    apiStatus,
    setFacultyData,
    setUser,
    user,
    semesterDates
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
