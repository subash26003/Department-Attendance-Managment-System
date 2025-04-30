import { useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import InputCard from "../stateLessComponents/InputCard";
import { useSelector } from "react-redux";
import Heading from "../stateLessComponents/Heading";

const FacultyForm = ({ mode = "register", facultyData = {}}) => {
  
  const { classList } = useSelector((state) => state.department);
  const [formData, setFormData] = useState({
    firstName: facultyData?.name?.split(" ")[1] ||"",
    lastName: facultyData?.name?.split(" ")[2] ||"",
    gender: facultyData?.gender ||"male",
    email: facultyData?.email ||"",
    classAdvisor: facultyData?.classAdvisor ||"",
  });


  const updateFacultyData = async (data) => {
    try {
      // console.log(data);
      data._id = facultyData._id 
      data.classAdvisor = data.classAdvisor == "" ? null : data.classAdvisor 
      console.log(data);
      
       const response = await api.put("/edit/faculty" , data)

       if(response.data.success){
        toast.success(response.data.message)
       }else{
        toast.info(response.data.message)
       }
       
    } catch (error) {
      toast.error(error.message);
    }
  }
  const registerDataInDatabase = async (type, data) => {
    try {
      if(mode == "edit"){
        updateFacultyData(data)
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
    const facultyData = {
      name: formData.firstName + " " + formData.lastName,
      email: formData.email,
      gender: formData.gender,
      classAdvisor: formData.classAdvisor,
    };
    registerDataInDatabase("faculty", facultyData);
    if(mode == "edit") return
    console.log(facultyData);
    setFormData((pre) => ({
      ...pre,
      firstName: "",
      lastName: "",
      email: "",
      classAdvisor: "",
    }));
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => ({ ...pre, [name]: value }));
  };

  return (
    <>
      {mode == "edit" && <Heading title={"Faculty Info"} />}
      <form
        onSubmit={handleFormSubmition}
        className="py-5 px-10 rounded w-full  flex flex-col items-center justify-center gap-5"
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

        <div className="flex flex-col gap-1 w-full md:w-[75%]">
          <label htmlFor="gender" className="text-gray-950 font-semibold">
            Gender
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

        <InputCard
          value={formData.email}
          onChangeFunction={onChangeHandler}
          labelName={"Email"}
          name={"email"}
          type={"text"}
        />

        <div className="flex flex-col gap-1 w-full md:w-[75%]">
          <label htmlFor="classAdvisor" className="text-gray-950 font-semibold">
            CLASS Advisor
          </label>
          <select
            value={formData.classAdvisor}
            onChange={onChangeHandler}
            name="classAdvisor"
            id="classAdvisor"
            className="border border-gray-500 h-10 p-2 rounded"
          >
            <option value=" ">Not Selected</option>
            {classList.map((item, index) => (
              <option key={index} value={item}>
                {item.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <button className="w-40 h-10 bg-teal-400 mt-5 text-white text-xl font-bold rounded hover:cursor-pointer">
          {mode == "edit" ? "Update" : "Submit"}
        </button>
      </form>
    </>
  );
};

export default FacultyForm;
