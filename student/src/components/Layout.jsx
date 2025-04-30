import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
        <Navbar />
        <div className='w-full flex-1 px-2 md:px-16 bg-gray-100 pt-5 pb-10 h-screen'>
            <div className='border border-gray-300 pb-5 rounded-2xl  flex flex-col min-h-[80dvh]'>
              <Outlet />
            </div>
        </div>
        
    </div>
  )
}

export default Layout