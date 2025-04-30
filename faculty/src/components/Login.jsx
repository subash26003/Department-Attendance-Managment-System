import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";
import api from "../api/api";
import Cookies from "js-cookie";
import { API_STATUS, DataContext } from "../context/DataProvider";

const Login = () => {
  const emailRef = useRef();
  const optRef = useRef();
  const navigate = useNavigate();
  const { setUser } = useContext(DataContext);

  const token = Cookies.get("jwt_token");

  const [loading , setLoading] = useState(API_STATUS.IDLE)

  if (token) {
    setUser(true);
    navigate("/", { replace: true });
    return;
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      if(loading === API_STATUS.LOADING){
        toast.info("Request Already Sent")
        return
      }
      const email = emailRef.current.value;
      const otp = optRef.current.value;

      if (!validator.isEmail(email)) {
        toast.info("Invalid Email");
        return;
      }
      if (otp.length < 6) {
        toast.info("Invalid OTP");
        return;
      }

      setLoading(API_STATUS.LOADING)
      const response = await api.post("/verifyOtp", { email, otp });
      const data = response.data;

      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setUser(true);
      const token = data.token;
      Cookies.set("jwt_token", token, { expires: 30 });
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleLoginRequest = async (formData) => {
    try {
      if(loading === API_STATUS.LOADING) {
        toast.info("Already Request Sent")
        return
      }
      setLoading(API_STATUS.LOADING)
      const response = await api.post("/login", formData);
      const data = response.data;
      setLoading(API_STATUS.SUCCESS)
      if(!data.success){
        toast.error(data.message);
      }else{
        toast.info(data.message);
      }
      
    } catch (error) {
      setLoading(API_STATUS.FAILURE)
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleSubmit = () => {
    const email = emailRef.current.value;

    if (!validator.isEmail(email)) {
      toast.info("Invalid Email");
      return;
    }

    if (!validator.isEmail(email)) {
      toast.info("Invalid Email");
      return;
    }

    handleLoginRequest({ email });
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
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Generate OTP
          </button>

          <div>
            <label className="block text-gray-600 mb-1">Enter OTP</label>
            <input
              type="text"
              ref={optRef}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your OTP"
            />
          </div>

          <button
            onClick={handleVerifyOtp}
            className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
