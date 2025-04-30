import mongoose from "mongoose";

import studentModel from "../../models/adminModels/studentModel.js";

import { getAllStudentAttendancePercentage, getStundetOverAllAttendancePercentage } from "../commonFunctions/controllers.js"

async function getNextFingerId() {
    try {
      
        const lastStudent = await studentModel.findOne({})
            .sort({ fingerId: -1 })
            .select('fingerId')
            .lean();
       
        return lastStudent?.fingerId ? lastStudent.fingerId + 1 : 1;
    } catch (error) {
        console.error('Error generating fingerId:', error);
        throw error;
    }
}

const registerStudent = async (req, res) => {
    try {
        const data = req.body
        const student = await studentModel.find({ registerNo: data.registerNo })
        // console.log(student)
        if (student.length !== 0) {
            return res.json({ success: false, message: "Already Registered" })
        }
        data.fingerId = await getNextFingerId()
        
        const newStudent = await studentModel.insertOne(data)
        if (newStudent) {
            return res.json({ success: true, message: "Registered" })
        }

        res.json({ success: false, message: "Invalid Data" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}

const editStudentData = async (req, res) => {
    try {
        const data = req.body
        console.log(data);
        
        const updatedData =  await studentModel.findOneAndUpdate({registerNo : data.registerNo} , data , {new : true , runValidators : true})
        if(!updatedData){
            res.json({success : false , message : "Issuse in Updation"})
            return
        }
        res.json({ success: true, message: "data received" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });
    }
}



const listStudentWithAttendancePer = async (req, res) => {
    try {
        const { year } = req.params
        console.error(year);

        const studentWithAttendancePer = await getAllStudentAttendancePercentage(year)

        if (studentWithAttendancePer.length != 0) {
            res.json({ success: true, studentList: studentWithAttendancePer })
            return
        }

        const studentList = await studentModel.find({ studentYear: year })

        res.json({ success: true, studentList: studentList })

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message })
    }
}

const getClassWiseStudentList = async (req, res) => {
    try {
        getStundetOverAllAttendancePercentage()
        const classList = await studentModel.aggregate([{
            $group: {
                _id: { $concat: "$studentYear" },
                students: { $push: "$$ROOT" },
                count: { $sum: 1 }
            }
        }])

        if (classList.length !== 0) {
            return res.json({ success: true, classList: classList })
        }
        // console.log(classList)
        res.json({ success: false, message: "Failed to Fetch" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}


export { registerStudent, listStudentWithAttendancePer, getClassWiseStudentList, editStudentData }