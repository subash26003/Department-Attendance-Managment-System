import express from "express";
import nodemailer from 'nodemailer'
import mongoose from "mongoose";
import facultyModel from "../models/adminModels/facultyModel.js";
import requestModel from "../models/requestModel.js";
import { adminDataModel } from "../models/DbModels.js";

const fromMail = process.env.GMAIL
const password = process.env.APP_PASSWORD

const sendMailToFaculty = async (requestData) => {
    try {
        const {studentYear} = requestData
    
        const faculty = await facultyModel.findOne({classAdvisor : studentYear})

        if(!faculty) return

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : fromMail,
                pass : password
            }
        })
        

        const mailOptions = {
            from : fromMail,
            to: faculty.email.trim(),
            subject : `New Request For ${requestData.requestType} from Student`,
            html: `
            <h3>New  ${requestData.requestType} Request</h3>
            <p><strong>Student:</strong> ${requestData.name}</p>
            <p><strong>Class:</strong> ${requestData.studentYear}</p>
            <p><strong>From:</strong> ${requestData.fromDate}</p>
            <p><strong>To:</strong> ${requestData.toDate}</p>
            <p><strong>No of Days:</strong> ${requestData.noOfDays}</p>
            <p><strong>Reason:</strong> ${requestData.requestReason}</p>
            
          `,

        }
        
        await transporter.sendMail(mailOptions)
        console.log("Mail Sent");
        
    } catch (error) {
        console.log(error);
    }
}


const sendMailToHOD = async (requestData) => {
    try {
        const adminData = await adminDataModel.findOne({})
        const {hodMail} = adminData 

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : email,
                pass : password
            }
        })
        
        const mailOptions = {
            from : fromMail,
            to: hodMail.trim(),
            subject :  `New Request For ${requestData.requestType} from Student`,
            html: `
            <h3>New  ${requestData.requestType} Request</h3>
            <p><strong>Student:</strong> ${requestData.name}</p>
            <p><strong>Class:</strong> ${requestData.studentYear}</p>
            <p><strong>From:</strong> ${requestData.fromDate}</p>
            <p><strong>To:</strong> ${requestData.toDate}</p>
            <p><strong>No of Days:</strong> ${requestData.noOfDays}</p>
            <p><strong>Reason:</strong> ${requestData.requestReason}</p>
            <p style="font-weight: bold; color: red;"><strong>Status:</strong> Approved By Class Advisor</p>
          `,
        }

        await transporter.sendMail(mailOptions)
        console.log("Mail sent to HOD");
        
    } catch (error) {
        console.log(error);
    }
}

const sendMailToStudent = async (request , sender) => {
    try {
        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : fromMail,
                pass : password
            }
        })

        const student = await requestModel.aggregate([
            {$match : {_id : request._id}},
            {$lookup : {
                from : 'students',
                localField : 'registerNo',
                foreignField : 'registerNo',
                as : 'requestedStudent'
            }},
            {$unwind : "$requestedStudent"},
            {$project : {
                studentName : "$requestedStudent.name",
                registerNo : "$requestedStudent.registerNo",
                studentYear : "$requestedStudent.studentYear",
                studentEmail : "$requestedStudent.email",
            }}

        ])
        console.log(student);
        
        const {studentEmail} = student[0]

        if(!studentEmail){
            console.log("Student Email Not found");
            return
        }

        console.log(studentEmail);
        
        const mailOptions = {
            from : fromMail,
            to : studentEmail,
            subject : "Update on your Request",
            html: `
            <h3>Your Request for ${request.requestType} has been updated by ${sender}</h3>
            <p><strong>Details</strong></p>
            <p><strong>From:</strong> ${request.fromDate}</p>
            <p><strong>To:</strong> ${request.toDate}</p>
            <p><strong>No of Days:</strong> ${request.noOfDays}</p>
            <p><strong>Reason:</strong> ${request.requestReason}</p>
            <p style="font-weight: bold; color: red;"><strong>Status:</strong> Updated By ${sender}</p>
          `,
        }

        await transporter.sendMail(mailOptions)

        console.log("Mail sent to student");
        
    } catch (error) {
        console.log(error);
        
    }
}

export {sendMailToFaculty , sendMailToHOD , sendMailToStudent} 