import React, { useContext } from "react";
import "./App.css";
import { StudentDataContext } from "./context/StudentDataContext";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import StudentProfile from "./components/StudentProfile";
import Requests from "./pages/Requests";
import NotFound from "./components/StatelessComponent/NotFound";
const App = () => {
  return (
    <>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="request" element={<Requests />} />
            
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
