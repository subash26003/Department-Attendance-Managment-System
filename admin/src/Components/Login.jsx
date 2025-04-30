import React, {useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import validator from "validator";
import api from "../api/api";
import Cookies from "js-cookie";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const token = Cookies.get("admin_token");

  if (token) {
    console.log("Logged");
    return <Navigate to={"/"} replace />
  }

  const handleLoginRequest = async (formData) => {
    try {
      const response = await api.post("/login", formData);
      const data = response.data;
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      const token = data.token;
      Cookies.set("admin_token", token, { expires: 30 });
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    if (password.length < 8) {
      toast.info("Invalid Password");
      passwordRef.current.value = "";
      return;
    }
    if (!validator.isEmail(email)) {
      toast.info("Invalid Email");
      return;
    }

    handleLoginRequest({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]  w-full bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              ref={passwordRef}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
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
