import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Heading from "../Components/stateLessComponents/Heading";
import Tab from "../Components/stateLessComponents/Tab";

const formTypeList = ["Student" , "Faculty" , "Subject"]

const Register = () => {

  const navigate = useNavigate();

  
  const [formSelection, setFormSelection] = useState(formTypeList[0]);
  

  useEffect(() => {
    switch (formSelection) {
      case formTypeList[0]:
        navigate("/register/student");
        return;
      case formTypeList[1]:
        navigate("/register/faculty" );
        break
      case formTypeList[2]:
        navigate("/register/subject");
        break
    }
  }, [formSelection, navigate]);

  

  return (
    <div className="w-full flex flex-col items-center  py-5 bg-white border rounded-xl border-gray-300">
      <Heading title={"REGISTER FORM"} />
      <Tab tabList={formTypeList} currentTab={formSelection} setCurrentTab={setFormSelection} />
      <div className="w-full flex justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default Register;
