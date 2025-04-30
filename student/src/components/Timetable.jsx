import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import { API_STATUS, StudentDataContext } from "../context/StudentDataContext";
import { withApiStatus } from "./HOComponent/withApiStatus";

const Timetable = () => {
  const [timetable, setTimetable] = useState([]);
  const { token } = useContext(StudentDataContext);
  const [apiStatus, setApiStatus] = useState({
    status: API_STATUS.LODING,
    errMsg: "",
  });

  const getTimetable = async () => {
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await api.get("/timetable", options);
      const data = response.data;
      if (data.success) {
        setApiStatus({ status: API_STATUS.SUCCESS });
        setTimetable(data.timetable)
      } else {
        toast.error(data.message);
        setApiStatus({ status: API_STATUS.FAILURE });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      setApiStatus({ status: API_STATUS.FAILURE });
    }
  };

  useEffect(() => {
    getTimetable();
  }, []);

  const periodTimings = [
    "8:00-9:00",
    "9:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-1:00",
    "1:00-2:00",
    "2:00-3:00",
  ];

  const successView = () => {
    return (
      <>
        <div className="overflow-auto p-2">
          <table className=" bg-white border border-gray-200 rounded-lg ">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Day / Time
                </th>
                {periodTimings.map((time, index) => (
                  <th
                    key={index}
                    className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                  >
                    <div className="flex flex-col">
                      <span>Period {index + 1}</span>
                      <span className="text-xs font-normal">{time}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timetable.map((dayData , idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                    {dayData.day}
                  </td>
                  {dayData.periods.map((period, periodIndex) => (
                    <td
                      key={periodIndex}
                      className={`px-3 py-2 text-center text-sm border-r border-gray-200 last:border-r-0 ${
                        period === "Free Period"
                          ? "bg-blue-50 text-blue-800"
                          : period.includes("Lab")
                          ? "bg-green-50 text-green-800"
                          : "text-gray-700"
                      }`}
                    >
                      {period}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  const renderView = (status) => {
    switch (status) {
      case API_STATUS.LODING:
        return <p>Loading...</p>;
      case API_STATUS.FAILURE:
        return <p>Failure</p>;
      case API_STATUS.SUCCESS:
        return successView()
    }
  };

  return <>{renderView(apiStatus.status)}</>;
};

export default withApiStatus(Timetable);
