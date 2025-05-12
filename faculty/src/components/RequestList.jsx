import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { DataContext } from "../context/DataProvider";
import api from "../api/api";

const RequestList = ({ requestList , handleRequestStatus}) => {
  const { token } = useContext(DataContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(requestList.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requestList.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleApprove = async (request, action) => {
    console.log(request.status + " " + action);
    
    if((action == 'approve' && request.status == 'verified')){
      alert(`Already ${request.status}`)
      return 
    }

    try {

      const options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.post(
        "/updaterequest",
        { requestId: request._id, action: action },
        options
      );

      const { data } = response;
      if(data.success){
        toast.info("Request Updated");
        handleRequestStatus(request._id , action == 'approve' ? "verified" : "rejected" )
      }else{
        toast.info(data.message);
      }
      
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {currentItems.length === 0 ? (
        <p className="text-center text-gray-500">No requests found.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {currentItems.map((request, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-xl p-5 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-blue-600">
                    {request.name}
                  </h3>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-1">
                  <strong>Register No:</strong> {request.registerNo}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Request Type:</strong> {request.requestType}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>From:</strong> {formatDate(request.fromDate)}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>To:</strong> {formatDate(request.toDate)}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Days:</strong> {request.noOfDays}
                </p>

                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    <strong>Reason:</strong> {request.requestReason}
                  </p>
                </div>
                {(request.status !== "rejected" && request.status !== "approved")&& (
                  <div className="flex justify-between mt-2 ">
                    {request.status != "approved" && request.status != "verified" ? (<button
                      onClick={() => handleApprove(request, "approve")}
                      className="px-4 font-semibold py-2 hover:cursor-pointer text-white border-0 bg-green-500 rounded"
                    >
                      Approve
                    </button>): null}
                    <button
                      onClick={() => handleApprove(request, "reject")}
                      className="px-4 font-semibold py-2 hover:cursor-pointer text-white border-0 bg-red-500 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-1 border rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-1 border rounded-lg hover:bg-blue-500 hover:text-white ${
                      currentPage === number
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-1 border rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RequestList;
