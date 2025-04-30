import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CurrentClassDetails from "../Components/CurrentClassDetails";
import Loader from "../Components/stateLessComponents/Loader";
import FailueView from "../Components/stateLessComponents/FailueView";
import Heading from "../Components/stateLessComponents/Heading";
import {
  setCurrentClass,
  getCurrentTimetable,
} from "../features/classDetailsSlice";
import { API_STATUS } from "../app/appConstants";
import Tab from "../Components/stateLessComponents/Tab";
import CurrentClassAttendance from "../Components/CurrentClassAttendance";

const TodayAttendance = () => {
  const { currentClass, currentTimetable } = useSelector(
    (state) => state.classDetails
  );
  const { status } = useSelector((state) => state.timetable);
  const dispatch = useDispatch();

  console.log(currentTimetable);

  useEffect(() => {
    dispatch(getCurrentTimetable(currentClass));
  }, [currentClass, status]);

  const renderSuccessView = () => {
    return (
      <div className="flex flex-col w-full h-full  p-3">
        <Heading title={"Today Update"} />
        <CurrentClassAttendance />
      </div>
    );
  };

  const renderView = (status) => {
    switch (status) {
      case API_STATUS.LOADING:
        return <Loader />;
      case API_STATUS.SUCCESS:
        return renderSuccessView();
      case API_STATUS.FAILURE:
        return <FailueView />;
    }
  };

  return <>{renderView(status)}</>;
};

export default TodayAttendance;
