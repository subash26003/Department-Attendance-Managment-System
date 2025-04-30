import React, { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";
import api from "../api/api";
import Cookies from "js-cookie";
import { API_STATUS, StudentDataContext } from "../context/StudentDataContext";

const Login = () => {
  const emailRef = useRef();
  const otpRef = useRef();
  const navigate = useNavigate();
  const { setUser } = useContext(StudentDataContext);
  const [loading , setLoading] = useState(API_STATUS.IDLE)
  const token = Cookies.get("STD_JWT_TOKEN");

  useEffect(() => {
    if (token) {
      setUser((pre) => !pre);
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  const handleLoginRequest = async () => {

    try {
      console.log(loading === API_STATUS.LODING);
      
      if(loading === API_STATUS.LODING){
        toast.info("Request Already Sent")
        return 
      }

      setLoading(API_STATUS.LODING)
      const email = emailRef.current.value
      const response = await api.post("/login", {email});
      const data = response.data;
      if (!data.success) {
        setLoading(API_STATUS.FAILURE)
        toast.error(data.message);
      }else{
        toast.success(data.message)
        setLoading(API_STATUS.SUCCESS)
      }
      

    } catch (error) {
      setLoading(API_STATUS.FAILURE)
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const verifyOTP = async (email , otp) => {
    try {
      const formData = {email , otp}
      console.log(formData);
      
      const response = await api.post("/verifyOtp", formData);
      const data = response.data;
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setUser(true);
      const token = data.token;
      Cookies.set("STD_JWT_TOKEN", token, { expires: 30 });
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const otp = otpRef.current.value;
    if (!validator.isEmail(email)) {
      toast.info("Invalid Email");
      return;
    }
    if (otp.length < 6) {
      toast.info("Enter the Valid OTP");
      return;
    }

    verifyOTP(email, otp );
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]  w-full bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              ref={emailRef}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            onClick={handleLoginRequest}
            className=" bg-blue-500 text-white py-2 px-2 rounded-lg hover:bg-blue-600 transition"
          >
            Generate OTP
          </button>
          <div>
            <label className="block text-gray-600 mb-1">OTP</label>
            <input
              type="text"
              ref={otpRef}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your otp"
              
            />
          </div>
          <button
            onClick={handleSubmit}
            className=" bg-blue-500 text-white py-2 px-2 rounded-lg hover:bg-blue-600 transition"
          >
            Verify OTP
          </button>
        </div>
        <p className="text-center mt-5">
          Not Registered yet?{" "}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
