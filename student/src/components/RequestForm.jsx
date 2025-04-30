import React, { Fragment, useContext, useEffect, useRef } from "react";
import Title from "../components/Title";
import { StudentDataContext } from "../context/StudentDataContext";
import InputCard from "../components/StatelessComponent/InputCard";
import { toast } from "react-toastify";
import api from "../api/api";

const RequestForm = () => {

  const { studentData, token } = useContext(StudentDataContext);
  const { student } = studentData;
  console.log(student);

  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);
  const requestTypeRef = useRef(null);
  const reasonRef = useRef(null);

  const postRequest = async (formData) => {
    try {
      
      const response = await api.post("/submitrequest", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const {data} = response 
      if(data.success){
        toast.success(data.message)
      }else{
        toast.err(data.message)
      }
      
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const prepareForm = (e) => {
    e.preventDefault();

    const fromDate = new Date(fromDateRef.current.value);
    const toDate = new Date(toDateRef.current.value);
    const currentDate = new Date();
 
    if ( currentDate.getDate() > toDate.getDate() ) {
      toast.info("Invalid Date");
      return;
    }
    let getPerimission = true;
    const totalDays = Math.ceil((toDate - fromDate) / (1000 * 3600 * 24));
    if (totalDays < 0) {
      toast.info("Date mismatch");
    } else if (totalDays > 5) {
      getPerimission = confirm(
        "Confirm Leave request for " + totalDays + " Days"
      );
    }

    if (!getPerimission) {
      return;
    }

    const requestType = requestTypeRef.current.value;
    const requestReason = reasonRef.current.value;
    const { name, registerNo, studentYear, parentMobileNo } = student;
    const formData = {
      name,
      registerNo,
      studentYear,
      parentMobileNo,
      fromDate,
      toDate,
      requestType,
      requestReason,
      noOfDays: Number.parseInt(totalDays) == 0 ? 1 : Number.parseInt(totalDays),
    };

    fromDateRef.current.value = ""
    toDateRef.current.value = ""
    reasonRef.current.value = ""
    console.log(formData);
    postRequest(formData);
  };

  return (
    <Fragment>
      <Title title={"Request Form"} />
      <form
        onSubmit={prepareForm}
        className="flex flex-col items-center gap-5 min-w-full"
      >
        <InputCard
          labelName={"Name"}
          name={"name"}
          type={"text"}
          value={student.name}
        />
        <InputCard
          labelName={"Register No"}
          name={"regNo"}
          type={"number"}
          value={student.registerNo}
        />
        <InputCard
          labelName={"Parent No"}
          name={"parentNo"}
          type={"number"}
          value={student.parentMobileNo}
        />
        <InputCard
          labelName={"Year"}
          name={"year"}
          type={"text"}
          value={student.studentYear.toUpperCase()}
        />
        <InputCard
          labelName={"Gender"}
          name={"gender"}
          type={"text"}
          value={student.gender}
        />
        <div className="flex flex-col gap-1 w-full md:w-[75%]">
          <label htmlFor={"type"} className="text-gray-950 font-semibold">
            {"Request Type"}
          </label>
          <select
            ref={requestTypeRef}
            className="border border-gray-500  h-10 p-2 rounded"
          >
            <option value="leave">Leave</option>
            <option value="od">On Duty</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 w-full md:flex-row  md:w-[75%]">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor={"fromDate"} className="text-gray-950 font-semibold">
              {"From Date"}
            </label>
            <input
              ref={fromDateRef}
              required
              type="date"
              id="fromDate"
              className="border border-gray-500  h-10 p-2 rounded"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor={"toDate"} className="text-gray-950 font-semibold">
              {"To Date"}
            </label>
            <input
              ref={toDateRef}
              required
              type="date"
              id="toDate"
              className="border border-gray-500  h-10 p-2 rounded"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full md:w-[75%]">
          <label htmlFor={"reason"} className="text-gray-950 font-semibold">
            {"Reason"}
          </label>
          <textarea
            id="reason"
            name="reason"
            required
            ref={reasonRef}
            cols={100}
            rows={5}
            className=" border border-gray-500 p-1"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-700 rounded px-4 py-2 text-white font-semibold  hover:ring ring-blue-400"
        >
          Submit
        </button>
      </form>
    </Fragment>
  );
};


export default RequestForm