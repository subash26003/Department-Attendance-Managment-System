import React, {  useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from "../assets/anna_university_logo.webp" 
import { GiHamburgerMenu } from "react-icons/gi";
import { IoChevronBackSharp } from "react-icons/io5";
import {FaUserCircle} from 'react-icons/fa'
import Cookies from 'js-cookie'

const Navbar = () => {
    const [showMenu , setShowMenu] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        Cookies.remove("admin_token")
        navigate("/login" , {replace : true})
    }

  return (
    <div className='bg-white px-5 md:px-10 py-3 flex items-center justify-between  font-medium'>
        <Link to="/"><img src={Logo} className='w-14 md:w-24 ' alt="logo"/></Link>
        <div className='lg:flex items-center self-center w-full  lg:m-auto gap-5 hidden text-gray-800'>
            <div className='lg:flex justify-center w-full m-auto  gap-5'>
                <NavLink to='/' className='navlink text-xl border-blue-500 '>Home</NavLink>
                <NavLink to='/today/update' className='navlink text-xl border-blue-500 '>TodayUpdates</NavLink>
                <NavLink to='/deptdetails' className='navlink text-xl border-blue-500 '>Department</NavLink>
                <NavLink to='/requests' className='navlink text-xl border-blue-500 '>Requests</NavLink>
                <NavLink to='/register' className='navlink text-xl border-blue-500 '>Register</NavLink>
                <NavLink to='/timetable' className='navlink text-xl border-blue-500 '>Timetable</NavLink>
            </div>
            <div className='group relative'>
                <FaUserCircle  className='text-5xl text-gray-400 cursor-pointer'/>
                <div className='group-hover:block hidden absolute right-0 text-xl card-shadow bg-white rounded-lg w-52'>
                    <p onClick={handleLogout} className=' p-2 text-gray-700 cursor-pointer'>Logout</p>
                </div>
            </div>
        </div>
        <GiHamburgerMenu onClick={() => setShowMenu(true)} className='cursor-pointer lg:hidden w-5 text-2xl'/>
        {/* {Mobile Menu} */}
        <div className={`'hidden lg:w-0 absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${showMenu ? 'w-full' : 'w-0'} '`}>
            <div className='flex flex-col text-gray-600'>
                <div onClick={() => setShowMenu(false)} className='flex items-center gap-2 cursor-pointer px-4 py-4'>
                    <IoChevronBackSharp className='text-2xl' />
                    <p>Back</p>
                </div>
                <NavLink onClick={() => setShowMenu(false)} to='/' className="nav-links py-4 px-4 border-b">HOME</NavLink>
                <NavLink onClick={() => setShowMenu(false)} to='/today/update' className="nav-links py-4 px-4 border-b">TODAYUPDATES</NavLink>
                <NavLink onClick={() => setShowMenu(false)} to='/deptdetails' className="nav-links py-4 px-4 border-b">DEPARTMENT</NavLink>
                <NavLink onClick={() => setShowMenu(false)} to='/register' className="nav-links py-4 px-4 border-b">Register</NavLink>
                <NavLink onClick={() => setShowMenu(false)} to='/timetable' className="nav-links py-4 px-4 border-b">Timetable</NavLink>
            </div>
        </div>
    </div>
  )
}

export default Navbar