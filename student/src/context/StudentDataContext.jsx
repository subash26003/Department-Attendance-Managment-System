import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";
import api from "../api/api";

export const API_STATUS = Object.freeze({
  LODING: "LOADING",
  FAILURE: "FAILURE",
  SUCCESS: "SUCCESS",
  IDLE : "IDLE"
});

export const StudentDataContext = createContext();

const StudentDataProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [studentData, setStudentData] = useState();
  const [apiStatus, setApiStatus] = useState({
    status: API_STATUS.LODING,
    errMsg: "",
  });

  const setTitle = useCallback((name) => {
    document.title = name
  }, [studentData]);

  const token = useMemo(() => {
    return Cookies.get("STD_JWT_TOKEN");
  }, [user]);

  useEffect(() => {
    console.log("called");

    const fetchAndSet = async (token) => {
      if (user) {
        try {
          const options = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await api.get("/initialData", options);
          const data = response.data;
          if (data.success) {
            setApiStatus({ status: API_STATUS.SUCCESS });
            setStudentData(data.studentData);
            setTitle(data.studentData.student.name)
          } else {
            setApiStatus({ status: API_STATUS.FAILURE, errMsg: data.message });
          }
        } catch (error) {
          console.log(error.message);
          setApiStatus({ status: API_STATUS.FAILURE, errMsg: error.message });
        }
      }
    };
    setApiStatus({status : API_STATUS.LODING})
    fetchAndSet(token)

  }, [token, user]);

  const value = {
    token,
    user,
    setUser,
    apiStatus,studentData , setStudentData
  };

  return (
    <StudentDataContext.Provider value={value}>
      {children}
    </StudentDataContext.Provider>
  );
};

export default StudentDataProvider;
