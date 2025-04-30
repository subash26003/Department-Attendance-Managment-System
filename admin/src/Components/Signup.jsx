import { useRef } from "react";
import { toast } from "react-toastify";
import validator from "validator";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Signup() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const reEnterPasswordRef = useRef(null);

  const navigate = useNavigate();

  const token = Cookies.get("admin_token");
  if (token) {
    navigate("/", { replace: true });
    return;
  }

  const signupRequest = async (formData) => {
    try {
      const response = await api.post("/signup", formData);

      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }

      navigate("/login");
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let email = emailRef.current.value;
    let password = passwordRef.current.value;

    if (password != reEnterPasswordRef.current.value) {
      toast.info("Password Not Match");
      passwordRef.current.value = "";
      reEnterPasswordRef.current.value = "";
      return;
    }

    if (!validator.isEmail(email)) {
      toast.info("Enter the Valid Email");
      return;
    }
    if (password.length < 8) {
      toast.info("Enter the valid Password");
      return;
    }
    let formData = { email, password };
    console.log(formData);
    signupRequest(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              ref={emailRef}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              name="password"
              ref={passwordRef}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">
              Re-Enter Password
            </label>
            <input
              type="password"
              name="password"
              ref={reEnterPasswordRef}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-5">
          Already Registered?{" "}
          <span
            className="text-blue-600 underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
