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


const adminDataSchema = new mongoose.Schema({
  email : {
    type : String , 
    required : true
  },
  hodMail : {
    type : String,
    required : true
  },
  password : {
    type : String,
    required : true
  }
})

const adminDataModel = mongoose.models.adminData || mongoose.model("adminData" , adminDataSchema)

export {dailyAttendanceModel , adminDataModel}