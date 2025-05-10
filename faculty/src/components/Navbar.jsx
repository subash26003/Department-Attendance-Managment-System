import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/anna_university_logo.webp";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoChevronBackSharp } from "react-icons/io5";
import Cookies from "js-cookie";
import { FaUserCircle } from "react-icons/fa";
import { DataContext } from "../context/DataProvider";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const naviagte = useNavigate();
  const { setUser, facultyData } = useContext(DataContext);

  const handleLogout = () => {
    setUser(false);
    Cookies.remove("jwt_token");
    naviagte("/login", { replace: true });
  };
  return (
    <div className="bg-white px-5 md:px-10 py-3 flex items-center justify-between lg:justify-start  font-medium shadow-lg">
      <Link to="/">
        <img src={Logo} className="w-14 md:w-24 self-start" alt="logo" />
      </Link>
      <div className="lg:flex items-center self-center w-full  lg:m-auto gap-5 hidden text-gray-800">
        <div className="lg:flex justify-center w-full m-auto  gap-5">
          <NavLink to="/" className="navlink text-xl border-blue-500 ">
            Home
          </NavLink>
          <NavLink
            to="/mysubjects"
            className="navlink text-xl border-blue-500 "
          >
            MySubjects
          </NavLink>
          {facultyData?.facultyDetails.classAdvisor && (
            <>
              <NavLink
                to="/myclass"
                className="navlink text-xl border-blue-500 "
              >
                Myclass
              </NavLink>
              <NavLink
                to="/requests"
                className="navlink text-xl border-blue-500 "
              >
                Requests
              </NavLink>
            </>
          )}
          <NavLink
            to="/markupload"
            className="navlink text-xl border-blue-500 "
          >
            Marks
          </NavLink>
          <NavLink
            to="/att/history"
            className="navlink text-xl border-blue-500 "
          >
            History
          </NavLink>
        </div>
        <div className="group relative">
          <FaUserCircle className="text-5xl text-gray-400 cursor-pointer" />
          <div className="group-hover:block hidden absolute right-0 text-xl card-shadow bg-white rounded-lg w-52">
            <p
              onClick={() => naviagte("/profile")}
              className=" p-2  hover:bg-gray-100 text-gray-700 cursor-pointer"
            >
              Profile
            </p>
            <p
              onClick={handleLogout}
              className="border-t p-2 hover:bg-gray-100 text-gray-700 cursor-pointer"
            >
              Logout
            </p>
          </div>
        </div>
      </div>
      <GiHamburgerMenu
        onClick={() => setShowMenu(true)}
        className="cursor-pointer lg:hidden w-5 text-2xl"
      />
      {/* {Mobile Menu} */}
      <div
        className={`'hidden lg:w-0 absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          showMenu ? "w-full" : "w-0"
        } '`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setShowMenu(false)}
            className="flex items-center gap-2 cursor-pointer px-4 py-4"
          >
            <IoChevronBackSharp className="text-2xl" />
            <p>Back</p>
          </div>

          <NavLink
            onClick={() => setShowMenu(false)}
            to="/"
            className="nav-links py-4 px-4 border-b"
          >
            HOME
          </NavLink>
          {facultyData?.facultyDetails.classAdvisor && (
            <>
              <NavLink
                onClick={() => setShowMenu(false)}
                to="/myclass"
                className="nav-links py-4 px-4 border-b"
              >
                Myclass
              </NavLink>
              <NavLink
                onClick={() => setShowMenu(false)}
                to="/requests"
                className="nav-links py-4 px-4 border-b"
              >
                Requests
              </NavLink>
            </>
          )}
          <NavLink
            onClick={() => setShowMenu(false)}
            to="/mysubjects"
            className="nav-links py-4 px-4 border-b"
          >
            MySubjects
          </NavLink>
          <NavLink
            onClick={() => setShowMenu(false)}
            to="/markupload"
            className="nav-links py-4 px-4 border-b"
          >
            Marks
          </NavLink>
          <NavLink
            onClick={() => setShowMenu(false)}
            to="/att/history"
            className="nav-links py-4 px-4 border-b"
          >
            History
          </NavLink>
          <NavLink
            onClick={() => setShowMenu(false)}
            to="/profile"
            className="nav-links py-4 px-4 border-b"
          >
            PROFILE
          </NavLink>
          <p
            onClick={() => {
              setShowMenu(false);
              handleLogout();
            }}
            className="nav-links py-4 px-4 border-b cursor-pointer"
          >
            LOGOUT
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
