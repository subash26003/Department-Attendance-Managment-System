import Title from "../components/Title";
import Timetable from "../components/Timetable";
import StudentProfile from "../components/StudentProfile";
import { withApiStatus } from "../components/HOComponent/withApiStatus";
import BarChartComponent from "../components/chart/ReportChart";
import StudentDashboard from "../components/StudentDashboard";

const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center py-5 md:px-10 gap-5 ">
      <div className="w-full border border-gray-300 rounded-2xl p-2 bg-white">
        <Title title={"Timetable"} />
        <Timetable />
      </div>
      <div className=" flex flex-col justify-center border border-gray-300 rounded-2xl w-full p-2 bg-white">
        <Title title={"Academic Report"} />
        <StudentDashboard />
      </div>
    </div>
  );
};

export default withApiStatus(Home);
