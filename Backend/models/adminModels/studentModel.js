
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true
    },
    registerNo : {
        type : String,
        required : true,
        unique : true,
    },
    gender : {
        type : String,
        required : true,
    },
    mobileNo : {
        type : String,
        required: true,
    },
    studentYear : {
        type : String,
        required : true
    },
    email : {
        type : String,
    },
    password : {
        type : String
    },
    parentMobileNo : {
        type : String ,
        unique : true
    },
    fingerId: {
        type: Number,
        required : true,
        unique : true
    },
    rfidUID : {
        type: String,
    }
} )

const studentModel = mongoose.models.student || mongoose.model("student" , studentSchema)

export default studentModel