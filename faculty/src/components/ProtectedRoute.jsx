import React from 'react'
import Cookies from 'js-cookie'
import { Navigate, Outlet, Route } from 'react-router-dom'

const ProtectedRoute = () => {

    const token = Cookies.get("jwt_token")

    return token ? <Outlet /> : <Navigate to='/login' replace />
}

export default ProtectedRoute