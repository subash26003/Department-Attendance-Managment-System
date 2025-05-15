import express from "express";
import { registerStudent, getClassWiseStudentList, listStudentWithAttendancePer, editStudentData } from '../controllers/adminControllers/studentControl.js'
import { getSubjectList, registerSubject, updateSubject } from "../controllers/adminControllers/subjectControl.js"
import { getFacultyList, registerFaculty, updateFacultyData } from "../controllers/adminControllers/facultyControl.js"

import { uploadTimeTable, getTimetableData } from "../controllers/adminControllers/timetableControl.js";
import { getTodayUpdate } from "../controllers/adminControllers/dailyUpdatesControl.js";
import { getRequestList, handleRequest } from "../controllers/adminControllers/requestsControl.js";
import { getAttendanceDashboard, getSemesterData, getStudentAcademicReport, getStudentReport, handleAdminLogin, handleAdminSignup, removeStudent, updateSemesterData } from "../controllers/adminControllers/adminControl.js";
import adminAuth from "../middleware/adminAuth.js";
import subjectModel from "../models/adminModels/subjectModel.js";
import attendanceRecordModel from "../models/attendanceRecordModel.js";
import studentModel from "../models/adminModels/studentModel.js";
import { getAllStudentAttendancePercentage } from "../controllers/commonFunctions/controllers.js";


const adminRoute = express.Router()

adminRoute.post("/login", handleAdminLogin)
adminRoute.post("/signup", handleAdminSignup)

//Semester Data
adminRoute.post("/semesters" , updateSemesterData)
adminRoute.get("/semesters" , getSemesterData)

// Student register and listing
adminRoute.post("/register/student", registerStudent)
adminRoute.get("/studentList", getClassWiseStudentList)
adminRoute.get("/studenList/:year", listStudentWithAttendancePer)
adminRoute.delete("/student/:_id" , removeStudent)
//Edit data
adminRoute.put("/edit/student", editStudentData)
adminRoute.put("/edit/faculty", updateFacultyData)
adminRoute.put("/edit/subject", updateSubject)

// Faculty register and listing
adminRoute.post("/register/faculty", registerFaculty)
adminRoute.get('/facultyList', getFacultyList)

// Subject Register and listing
adminRoute.post("/register/subject", registerSubject)
adminRoute.get('/subjectList', getSubjectList)

//Upload TimeTable
adminRoute.post('/uploadTimeTable', uploadTimeTable)
adminRoute.get("/listTimeTable", getTimetableData)

// Daily Updates
adminRoute.get("/getTodayUpdate/:year", getTodayUpdate)

adminRoute.get("/requestlist", getRequestList)
adminRoute.post("/updaterequest", handleRequest)

// Dashboard endpoint
adminRoute.get('/dashboard', getAttendanceDashboard )
adminRoute.get("/student/report" , adminAuth , getStudentReport)
adminRoute.get("/report" , getStudentAcademicReport)

export default adminRoute