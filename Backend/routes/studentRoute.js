import express from "express"
import { handleInitialData, handleLogin, handleSignUp, handleVerifyOtp } from "../controllers/studentControllers/studentController.js"
import { studentAuth } from "../middleware/studentAuth.js"
import { getTimetable } from "../controllers/studentControllers/classDetailsControl.js"
import { getRequestList, handleStudentRequest } from "../controllers/studentControllers/requests.js"

const studentRoute = express.Router()

studentRoute.post("/signup", handleSignUp)
studentRoute.post("/login" , handleLogin)
studentRoute.post("/verifyOtp" , handleVerifyOtp)

studentRoute.get("/initialData" , studentAuth , handleInitialData)

studentRoute.get("/timetable" , studentAuth , getTimetable)

studentRoute.post("/submitrequest" , studentAuth , handleStudentRequest) 

studentRoute.get("/myrequests" , studentAuth , getRequestList)

export default studentRoute