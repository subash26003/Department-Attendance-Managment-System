import express from "express";
import {getInitialData, handleLogin , getStudentListWithAttendancePercentage , getTodaySubjectAttendanceList , getRequestList , handleRequestApprovel, verifyOtp, uploadSubjectMarks, getStudentListWithMarks, sendStudentReport, updateDailyAttendance, getStudentHistoryAttendance} from '../controllers/facultyController.js'
import facultyAuth from "../middleware/facultyAuth.js";
import { getSemesterData, getStudentAcademicReport } from "../controllers/adminControllers/adminControl.js";

const facultyRoute = express.Router()

facultyRoute.post("/login", handleLogin)
facultyRoute.post("/verifyOtp", verifyOtp)

facultyRoute.get("/initialData" , facultyAuth , getInitialData)

// getSemester Dates
facultyRoute.get("/semester" , facultyAuth , getSemesterData)

facultyRoute.get("/liststudent/:subjectCode" ,facultyAuth , getStudentListWithAttendancePercentage)

// Today Attendance
facultyRoute.get("/todayAttendance" ,facultyAuth ,  getTodaySubjectAttendanceList)
facultyRoute.post("/updateAttendance" , facultyAuth , updateDailyAttendance, getTodaySubjectAttendanceList)


facultyRoute.get("/requests" , facultyAuth , getRequestList)

facultyRoute.post("/updaterequest" , facultyAuth , handleRequestApprovel)

facultyRoute.get("/studentListWithMarks/:subjectCode" ,facultyAuth ,getStudentListWithMarks )
facultyRoute.post("/uploadmarks" ,   uploadSubjectMarks)

//Student Report
facultyRoute.get("/studentreport" , facultyAuth , getStudentAcademicReport)

facultyRoute.post("/sendSMS", facultyAuth , sendStudentReport)

//getHistory Data

facultyRoute.get("/attendance/history/:subjectCode", facultyAuth , getStudentHistoryAttendance )

export default facultyRoute