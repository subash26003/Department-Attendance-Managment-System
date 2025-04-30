import mongoose from "mongoose";
import subjectModel from "../../models/adminModels/subjectModel.js";



// Register Subjects
const registerSubject = async (req, res) => {
    try {
        const subjectData = req.body;
        subjectData.totalPeriods = Number(subjectData.totalPeriods)

        const subject = await subjectModel.findOne({ $or: [{ code: subjectData.code }] })
        // console.log(subject);
        console.log("_____".repeat(20));


        if (!subject) {

            let subject = { ...subjectData }
            await subjectModel.insertOne(subject)

            res.json({ success: true, message: "Subject Registered" })
        } else {
            res.json({ success: false, message: "Already Registered" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateSubject = async (req , res) => {
    try {
        const data = req.body 
        const updatedSubject = await subjectModel.findByIdAndUpdate({_id : data._id} , data , {new : true , runValidators : true})

        console.log(updatedSubject);

        res.json({success : true , message : "Subject Updated"})
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//list Subjects
const getSubjectList = async (req, res) => {
    try {
        const subjectList = await subjectModel.find({})
        if (subjectList.length !== 0) {
            res.json({ success: true, data: subjectList })
            return
        }
        res.json({ success: false, message: "Error in fetching" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export {getSubjectList , registerSubject , updateSubject}