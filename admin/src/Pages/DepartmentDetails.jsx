import { useSelector } from "react-redux";
import Heading from "..//Components/stateLessComponents/Heading";
import Loader from "..//Components/stateLessComponents/Loader";
import FailueView from "..//Components/stateLessComponents/FailueView";
import { useState } from "react";
import { API_STATUS } from "../app/appConstants";
import FacultyList from "../Components/DepartmentPageComponent/FacultyList";
import Tab from "../Components/stateLessComponents/Tab";
import StudentList from "../Components/DepartmentPageComponent/StudentList";
import SubjectList from "../Components/DepartmentPageComponent/SubjectList";
import NotFound from "../Components/stateLessComponents/NotFound"

const tabList = ["Faculty" , "Student" , "Subject"]

const DepartmentDetails = () => {
  const { facultyList, status } = useSelector((state) => state.department);
  const [currentTab , setCurrentTab] = useState(tabList[0])


  const renderSuccessView = () => {
    return (
      <div className="p-4 ">
        <Tab tabList={tabList} currentTab={currentTab} setCurrentTab={setCurrentTab}/>
        {(() => {
          switch(currentTab){
            case tabList[0]:
              return <FacultyList facultyList={facultyList} />
            case tabList[1]:
              return <StudentList />
            case tabList[2]:
              return <SubjectList />
            default:
              return <NotFound />
          }
        })()}
      </div>
    )
  }
  const renderView = (status) => {
    switch (status) {
      case API_STATUS.LOADING:
        return <Loader />;
      case API_STATUS.FAILURE:
        return <FailueView />;
      case API_STATUS.SUCCESS:
        return renderSuccessView()
    }
  };
  return (
    <div className="border border-gray-200 bg-white rounded-xl h-full p-3">
      <Heading title={"Department Details"} />
      {renderView(status)}
    </div>
  );
};

export default DepartmentDetails;
