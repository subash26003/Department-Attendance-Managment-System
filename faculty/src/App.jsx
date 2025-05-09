import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import {ToastContainer} from 'react-toastify'
import Layout from './components/Layout'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import FacultyProfile from './components/FacultyProfile'
import AdvisorClassDetails from './components/AdvisorClassDetails'
import Subjects from './pages/Subjects'
import Requests from './pages/Requests'
import NotFound from './components/stateLessComponents/NotFound'
import MarksUpload from './pages/MarksUpload'
import StudentReport from './pages/StudentReport'

const App = () => {
  return (
    <>
    <ToastContainer />
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            <Route path="/profile" element={<FacultyProfile />} />
            <Route path="/myclass" element={<AdvisorClassDetails />} />
            <Route path='/requests' element={<Requests />}/>
            <Route path="/mysubjects" element={<Subjects />} />
            <Route path='/markupload' element={<MarksUpload />} />
            <Route path='/studentreport' element={<StudentReport />} />
          </Route>
          
          <Route path='/login' element={<Login />} />
         </Route>
         <Route path="*" element={<NotFound />} />
       </Routes>
    </>
  )
}

export default App