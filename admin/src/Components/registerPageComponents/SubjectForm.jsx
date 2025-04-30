import { useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import InputCard from "../stateLessComponents/InputCard";
import { useSelector } from "react-redux";
import Heading from "../stateLessComponents/Heading";

const durations = [50, 100, 150];

const SubjectForm = ({mode ="register" , subjectData = {}}) => {
  const { classList, facultyList } = useSelector((state) => state.department);

  const [formData, setFormData] = useState({
    subjectName: subjectData?.name ||"",
    subjectCode: subjectData?.code ||"",
    duration: subjectData?.duration ||"50",
    year: subjectData?.year ||"year1",
    facultyId: subjectData?.facultyId ||"",
    type: subjectData?.name ||"theory",
    totalPeriods: subjectData?.totalPeriods ||30,
  });

  const handleUpdateSubject = async (data) => {
    try {
      data._id = subjectData._id
      const response = await api.put(`/edit/subject`, data);
      const responseData = response.data;
      console.log(responseData);
      if (responseData.success) {
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  const registerDataInDatabase = async (type, data) => {
    try {
      if(mode == "edit") {
        handleUpdateSubject(data)
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
    const subjectData = {
      name: formData.subjectName,
      code: formData.subjectCode,
      duration: formData.duration,
      year: formData.year,
      facultyId: formData.facultyId,
      type : formData.type,
      totalPeriods : Number(formData.totalPeriods)
    };

    registerDataInDatabase("subject", subjectData);
    if(mode == 'edit') return;
    console.log(subjectData);
    setFormData((pre) => ({ ...pre, subjectName: "", subjectCode: "" }));

  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((pre) => ({ ...pre, [name]: value }));
  };

  return (
    <>
    {mode == "edit" && <Heading title={"Subject Info"} />}
      <form
        onSubmit={handleFormSubmition}
        className="py-5 px-10 rounded w-full flex flex-col items-center gap-5"
      >

          <InputCard
            value={formData.subjectName}
            onChangeFunction={onChangeHandler}
            labelName={"Subject Name"}
            name={"subjectName"}
            type={"text"}
          />
          <InputCard
            value={formData.subjectCode}
            onChangeFunction={onChangeHandler}
            labelName={"Subject Code"}
            name={"subjectCode"}
            type={"text"}
          />
          <div className="flex flex-col gap-1 w-full md:w-[75%] ">
            <label htmlFor="duration" className="text-gray-950 font-semibold w-full">
              Duration (1 == 50 mins)
            </label>
            <select
              value={formData.duration}
              onChange={onChangeHandler}
              name="duration"
              id="duration"
              className="border border-gray-500  h-10 p-2 rounded"
            >
              {durations.map((item, index) => (
                <option key={index} value={item}>
                  {item / 50} period
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full md:w-[75%] ">
            <label htmlFor="year" className="text-gray-950 font-semibold">
              Year
            </label>
            <select
              value={formData.year}
              onChange={onChangeHandler}
              name="year"
              id="year"
              className="border border-gray-500  h-10 p-2 rounded"
            >
              {classList.map((item, index) => (
                <option key={index} value={item}>
                  {item.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
      
        
          <div className="flex flex-col gap-1 w-full md:w-[75%] ">
            <label htmlFor="faculty" className="text-gray-950 font-semibold">
              Faculty
            </label>
            <select
              value={formData.facultyId}
              onChange={onChangeHandler}
              name="facultyId"
              id="faculty"
              className="border border-gray-500  h-10 p-2 rounded"
            >
              <option>Select Faculty</option>
              {facultyList.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-full md:w-[75%] ">
            <label htmlFor="type" className="text-gray-950 font-semibold">
              Type
            </label>
            <select
              value={formData.type}
              onChange={onChangeHandler}
              name="type"
              id="type"
              className="border border-gray-500 h-10 p-2 rounded"
            >
              <option value={"theory"}>Theory</option>
              <option value={"lab"}>Lab</option>
              <option value={"free"}>Free</option>
            </select>
          </div>
        
          <InputCard
            value={formData.totalPeriods}
            onChangeFunction={onChangeHandler}
            labelName={"Total Periods"}
            name={"totalPeriods"}
            type={"number"}
          />
        

        <button className="w-40 h-10 bg-teal-400 mt-5 text-white text-xl font-bold rounded hover:cursor-pointer">
          {mode == "edit" ? "Update" : "Submit"}
        </button>
      </form>
    </>
  );
};

export default SubjectForm;
