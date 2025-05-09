import mongoose from "mongoose";

const dailyAttendanceSchema = new mongoose.Schema({
    
  date: String,
  day: String,
  year: String,
  period: Number,
  subjectCode: String,
  absentRegisterNos: [String]

}, { collection: "dailyAttendance" }); // specify existing collection name

const dailyAttendanceModel = mongoose.model("DailyAttendance", dailyAttendanceSchema);


const db = mongoose.connection

const adminDataModel = db.collection("adminData")

export {dailyAttendanceModel , adminDataModel}