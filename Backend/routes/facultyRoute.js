import express from "express";
import {getInitialData, handleLogin , getStudentListWithAttendancePercentage , getTodaySubjectAttendanceList , getRequestList , handleRequestApprovel, verifyOtp, uploadSubjectMarks, getStudentListWithMarks, sendStudentReport} from '../controllers/facultyController.js'
import facultyAuth from "../middleware/facultyAuth.js";
import { getStudentAcademicReport } from "../controllers/adminControllers/adminControl.js";

const facultyRoute = express.Router()

facultyRoute.post("/login", handleLogin)
facultyRoute.post("/verifyOtp", verifyOtp)

facultyRoute.get("/initialData" , facultyAuth , getInitialData)

facultyRoute.get("/liststudent/:subjectCode" ,facultyAuth , getStudentListWithAttendancePercentage)

facultyRoute.get("/todayAttendance" ,facultyAuth ,  getTodaySubjectAttendanceList)

facultyRoute.get("/requests" , facultyAuth , getRequestList)

facultyRoute.post("/updaterequest" , facultyAuth , handleRequestApprovel)

facultyRoute.get("/studentListWithMarks/:subjectCode" ,facultyAuth ,getStudentListWithMarks )
facultyRoute.post("/uploadmarks" ,   uploadSubjectMarks)

//Student Report
facultyRoute.get("/studentreport" , facultyAuth , getStudentAcademicReport)

facultyRoute.post("/sendSMS", facultyAuth , sendStudentReport)

export default facultyRoute