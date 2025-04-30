import requestModel from '../../models/requestModel.js'
import { sendMailToFaculty } from '../../services/mailService.js';

const handleStudentRequest = async (req , res) => {
    try {
        const formData = req.body 
        console.log(formData);
        
        const requestData = formData
        
        const newRequest = await requestModel.insertOne(requestData)
        if(!newRequest){
            res.json({success : false , message : "Request not  Submitted"})
        }
        
        
        res.json({success : true , message:"Request Submited"})
        await sendMailToFaculty(newRequest)
    } catch (error) {
        res.json({success : false , message : "Server Error -> " + error.message})
        console.log(error.message);
        
    }
}

const getRequestList = async (req , res) => {
    try {
        const {regNo} = req
        const requestList  = await requestModel.find({registerNo : regNo})

        res.json({status : true , requestList })
    } catch (error) {
        res.json({success : false , message : "Server Error -> " + error.message})
        console.log(error.message);
    }
}

export {handleStudentRequest , getRequestList}