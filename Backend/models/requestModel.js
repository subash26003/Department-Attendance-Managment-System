import express from "express";
import mongoose from "mongoose";


const RequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    registerNo: {
        type: String,
        required: true
    },
    parentMobileNo: {
        type: String,
        required: true
    },
    studentYear: {
        type: String,
        required: true
    },
    requestType: {
        type: String,
        required: true,
    },
    requestReason: {
        type: String,
        required: true
    },
    fromDate: {
        type: Date,
        required: true
    },
    toDate: {
        type: Date,
        required: true
    },
    noOfDays: {
        type: Number,
        required: true
    },
    status : {
        type : String,
        default : "pending"
    },
    sender : {
        type : String,
        default : 'student'
    }
} , {minimize : false})

const requestModel = mongoose.models.request || mongoose.model("request" , RequestSchema)
 

export default requestModel