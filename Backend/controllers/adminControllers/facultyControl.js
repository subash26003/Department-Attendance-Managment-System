
import facultyModel from "../../models/adminModels/facultyModel.js";

//Register Faculty
const registerFaculty = async (req, res) => {
    try {
        const facultyData = req.body

        const faculty = await facultyModel.findOne({ email: facultyData.email })
        if (!faculty) {
            await facultyModel.insertOne(facultyData)
            res.json({ success: true, message: "Faculty Registered" })
        } else {
            res.json({ success: false, message: "Already Registered" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateFacultyData = async (req , res) => {
    try {
        console.log(req.body);
        const facultyData = req.body 
        if(facultyData.classAdvisor){
            const isAdivisorPresent = await facultyModel.findOne({classAdvisor : facultyData.classAdvisor})

            console.log(isAdivisorPresent);

            if(isAdivisorPresent){
                res.json({success : false , message : `${facultyData.classAdvisor} Already have a Advisor`})
                return
            }
            
        }

        await facultyModel.findByIdAndUpdate({_id : facultyData._id} , facultyData , {new : true , runValidators : true})
        
        res.json({success : true , message : "Data Updated"})
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// List out Faculty
const getFacultyList = async (req, res) => {
    try {
        const list = await facultyModel.find({})
        res.json({ success: true, data: list })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {getFacultyList , registerFaculty , updateFacultyData} 