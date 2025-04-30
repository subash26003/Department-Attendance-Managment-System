import React, { useContext, useEffect, useState } from "react";
import api from "../api/api";
import { API_STATUS, StudentDataContext } from "../context/StudentDataContext";
import Loader from "./Loader";
import Failure from "./Failure";

const MyRequests = () => {
  const { token } = useContext(StudentDataContext);
  const [requests, setRequests] = useState([]);
  const [apiResponse, setApiResponse] = useState({
    status: API_STATUS.LODING,
    errMsg: "",
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setApiResponse({ status: API_STATUS.LODING, errMsg: "" });
    try {
      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await api.get("/myrequests", options);
      const { data } = res;
      if (data.status) {
        setRequests(data.requestList);
        setApiResponse({ status: API_STATUS.SUCCESS, errMsg: "" });
      } else {
        setApiResponse({ status: API_STATUS.FAILURE, errMsg: "" });
      }
    } catch (error) {
      console.log(error.message);

      setApiResponse({
        status: API_STATUS.FAILURE,
        errMsg: "Failed to fetch requests",
      });
    }
  };

  const getListColor = (status) => {
    switch(status){
        case 'approved':
            return 'bg-green-400 text-white'
        case 'rejected':
            return 'bg-red-400 text-white'
        default:
            return 'bg-yellow-300'
    }
  }

  const renderContent = () => {
    switch (apiResponse.status) {
      case API_STATUS.LODING:
        return <Loader />;
      case API_STATUS.FAILURE:
        return <Failure message={apiResponse.errMsg} />;
      case API_STATUS.SUCCESS:
        return requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Register No</th>
                  <th className="py-2 px-4 border-b">Parent Mobile</th>
                  <th className="py-2 px-4 border-b">Year</th>
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-6 border-b w-[300px] text-left">Reason</th>
                  <th className="py-2 px-4 border-b">From</th>
                  <th className="py-2 px-4 border-b">To</th>
                  <th className="py-2 px-4 border-b">Days</th>
                  <th className="py-2 px-4 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, i) => (
                  <tr key={i} className="text-center">
                    <td className="py-2 px-4 border-b">{req.name}</td>
                    <td className="py-2 px-4 border-b">{req.registerNo}</td>
                    <td className="py-2 px-4 border-b">{req.parentMobileNo}</td>
                    <td className="py-2 px-4 border-b">{req.studentYear}</td>
                    <td className="py-2 px-4 border-b">{req.requestType}</td>
                    <td className="py-2 px-6 border-b text-left truncate">{req.requestReason}</td>
                    <td className="py-2 px-4 border-b">{new Date(req.fromDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{new Date(req.toDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">{req.noOfDays}</td>
                    <td className={`py-2 px-4 border-b capitalize ${getListColor(req.status)}`}>{req.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Requests</h2>
      {renderContent()}
    </div>
  );
};

export default MyRequests;
