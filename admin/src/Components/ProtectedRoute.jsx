import React from 'react'
import Cookies from 'js-cookie'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = () => {
    const token = Cookies.get("admin_token")

  return token ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute