import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import { Navigate, Outlet } from 'react-router-dom'
import { StudentDataContext } from '../context/StudentDataContext'

const ProtectedRoute = () => {
    const token =  Cookies.get("STD_JWT_TOKEN") 

    return token ? <Outlet /> : <Navigate to={"/login"}  replace/>
}

export default ProtectedRoute