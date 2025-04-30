import { NavLink } from "react-router-dom";

const SideBar = () => {
    return (
        <div className="hidden lg:block">
            <ul className="space-y-4">
                <NavLink
                    to="/"
                    className="sidebar-link text-xl w-full sm:w-60 h-20 rounded-tr rounded-br shadow bg-white mt-1 flex justify-center items-center text-roboto font-semibold text-gray-700"
                >
                    <li>
                        <p>Home</p>
                    </li>
                </NavLink>
                <NavLink
                    to="/deptdetails"
                    className="sidebar-link text-xl w-full sm:w-60 h-20 rounded-tr rounded-br shadow bg-white mt-1 flex justify-center items-center text-roboto font-semibold text-gray-700"
                >
                    <li>
                        <p>Department</p>
                    </li>
                </NavLink>
                <NavLink
                    to="/register"
                    className="sidebar-link text-xl w-full sm:w-60 h-20 rounded-tr rounded-br shadow bg-white mt-1 flex justify-center items-center text-roboto font-semibold text-gray-700"
                >
                    <li>
                        <p>Register</p>
                    </li>
                </NavLink>
                <NavLink
                    to="/timetable"
                    className="sidebar-link text-xl w-full sm:w-60 h-20 rounded-tr rounded-br shadow bg-white mt-1 flex justify-center items-center text-roboto font-semibold text-gray-700"
                >
                    <li>
                        <p>TimeTable</p>
                    </li>
                </NavLink>
            </ul>
        </div>
    );
};

export default SideBar;
