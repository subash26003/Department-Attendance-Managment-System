import { Route, Routes } from "react-router-dom";
import TodayAttendance from "./Pages/TodayAttendance";
import "./App.css";
import Layout from "./Pages/Layout";
import DepartmentDetails from "./Pages/DepartmentDetails";
import Register from "./Pages/Register";
import { ToastContainer } from "react-toastify";
import TimeTable from "./Pages/TimeTable";
import SubjectForm from "./Components/registerPageComponents/SubjectForm";
import StudentFrom from "./Components/registerPageComponents/StudentFrom";
import FacultyForm from "./Components/registerPageComponents/FacultyForm";
import Requests from "./Pages/Requests";
import ProtectedRoute from "./Components/ProtectedRoute";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import NotFound from "./Components/stateLessComponents/NotFound";
import StudentEditor from "./Components/Editors/StudentEditor";
import FacultyEditor from "./Components/Editors/FacultyEditor";
import SubjectEditor from "./Components/Editors/SubjectEditor";
import AttendanceDashBoard from "./Pages/AttendanceDashBoard";
import SemesterSetup from "./Pages/SemesterSetup";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route index element={<AttendanceDashBoard />} />
            <Route path="/today/update" element={<TodayAttendance />} />
            <Route path="/deptdetails" element={<DepartmentDetails />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/register" element={<Register />}>
              <Route path="student" element={<StudentFrom />} />
              <Route path="subject" element={<SubjectForm />} />
              <Route path="faculty" element={<FacultyForm />} />
            </Route>
            <Route path="/editstudent" element={<StudentEditor />} />
            <Route path="/editfaculty" element={<FacultyEditor />} />
            <Route path="/editsubject" element={<SubjectEditor />} />
            <Route path="/timetable" element={<TimeTable />} />
            <Route path="/setup" element={<SemesterSetup />} />

          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
