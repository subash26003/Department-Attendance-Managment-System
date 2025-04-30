import mongoose from "mongoose";

const db = mongoose.connection
const dailyAttendanceModel = db.collection("dailyAttendance")
const adminDataModel = db.collection("adminData")

export {dailyAttendanceModel , adminDataModel}