import { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../api/api";
import { toast } from "react-toastify";
import InputCard from "../stateLessComponents/InputCard";
import Heading from "../stateLessComponents/Heading";
import { SY } from "pdfmake/build/pdfmake";

const StudentFrom = ({ mode = "register", studentData = {} }) => {
  const { classList } = useSelector((state) => state.department);

  const [formData, setFormData] = useState({
    firstName: studentData?.studentName?.split(" ")[1] || "",
    lastName: studentData?.studentName?.split(" ")[0] || "",
    gender: studentData?.gender || "male",
    mobileNo: studentData?.mobileNo || "",
    regNo: studentData?.registerNo || "",
    year: studentData?.studentYear || "year1",
    parentMobileNo:studentData?.parentMobileNo || "",
  });

  const updateStudentData = async (type , data) => {
    try {
      if(studentData.email){
        data.email = studentData.email
      }
      const response = await api.put(`/edit/${type}` , data) 
      console.log(response.data.success);
      
      if(response.data.success){
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  const registerDataInDatabase = async (type, data) => {
    try {
      if(mode === 'edit') {
        updateStudentData(type , data)
        return
      }
      const response = await api.post(`/register/${type}`, data);
      const responseData = response.data;
      console.log(responseData);
      if (responseData.success) {
        console.log("success");
        toast.success(responseData.message);
      } else {
        console.log("fail");
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFormSubmition = (e) => {
    e.preventDefault();
    const studentData = {
      name: formData.firstName + " " + formData.lastName,
      gender: formData.gender,
      mobileNo: formData.mobileNo,
      registerNo: formData.regNo,
      studentYear: "year" + formData.year.charAt(formData.year.length - 1),
      parentMobileNo: formData.parentMobileNo,
    };
    registerDataInDatabase("student", studentData);

    if(mode === "edit") return;

    setFormData((pre) => ({
      ...pre,
      firstName: "",
      lastName: "",
      mobileNo: "",
      regNo: "",
      parentMobileNo: "",
    }));
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => ({ ...pre, [name]: value }));
  };

  return (
    <>
      {mode === "edit" && <Heading title={"Student Info"} />}
      <form
        onSubmit={handleFormSubmition}
        className="py-5 px-10 rounded w-full flex flex-col items-center gap-5"
      >
        <InputCard
          value={formData.firstName}
          onChangeFunction={onChangeHandler}
          labelName={"First Name"}
          name={"firstName"}
          type={"text"}
        />
        <InputCard
          value={formData.lastName}
          onChangeFunction={onChangeHandler}
          labelName={"Last Name"}
          name={"lastName"}
          type={"text"}
        />
        {studentData?.email && (
          <InputCard
            value={studentData.email}
            onChangeFunction={onChangeHandler}
            labelName={"Email"}
            name={"email"}
            type={"email"}
          />
        )}

        <div className="flex flex-col gap-1 w-full md:w-[75%]">
          <label htmlFor="Gender" className="text-gray-950 font-semibold">
            GENDER
          </label>
          <div className="flex gap-10 mt-2">
            <label htmlFor="male" className="flex items-center">
              <input
                value="male"
                onChange={onChangeHandler}
                type="radio"
                name="gender"
                id="male"
                required
                className="w-10 h-5"
              />{" "}
              Male
            </label>
            <label htmlFor="female" className="flex items-center">
              <input
                value="female"
                onChange={onChangeHandler}
                type="radio"
                name="gender"
                id="female"
                required
                className="w-10 h-5"
              />{" "}
              Female
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full md:w-[75%]">
          <label htmlFor="mobile" className="text-gray-950 font-semibold">
            Mobile No
          </label>
          <input
            value={formData.mobileNo}
            onChange={onChangeHandler}
            type="tel"
            id="mobile"
            name="mobileNo"
            placeholder="Enter Mobile no"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength="10"
            className="border border-gray-500  h-10 p-2 rounded min-w-full"
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
            required
          />
        </div>
        <div className="flex flex-col gap-1 w-full md:w-[75%]">
          <label
            htmlFor="parentMobileNo"
            className="text-gray-950 font-semibold"
          >
            parentMobileNo
          </label>
          <input
            value={formData.parentMobileNo}
            onChange={onChangeHandler}
            type="tel"
            id="parentMobileNo"
            name="parentMobileNo"
            placeholder="Enter Mobile no"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength="10"
            className="border border-gray-500  h-10 p-2 rounded min-w-full"
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
            required
          />
        </div>

        <div className="flex flex-col gap-1 w-full md:w-[75%]">
          <label htmlFor="class" className="text-gray-950 font-semibold">
            CLASS
          </label>
          <select
            value={formData.year}
            onChange={onChangeHandler}
            name="year"
            id="class"
            className="border border-gray-500  h-10 p-2 rounded"
          >
            {classList.map((item, index) => (
              <option key={index} value={item}>
                {item.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 w-full md:w-[75%]">
          <label htmlFor="regno" className="text-gray-950 font-semibold">
            REGISTER NO
          </label>
          <input
            value={formData.regNo}
            onChange={onChangeHandler}
            type="text"
            id="regno"
            name="regNo"
            placeholder="Enter Reg no"
            pattern="[0-9]*"
            inputMode="numeric"
            className="border border-gray-500 h-10 p-2 rounded"
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
            required
          />
        </div>

        <button className="w-40 h-10 bg-teal-400 mt-5 text-white text-xl font-bold rounded hover:cursor-pointer">
          {mode == "edit" ? "Update" : "Submit"}
        </button>
      </form>
    </>
  );
};

export default StudentFrom;
