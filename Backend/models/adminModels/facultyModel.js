
import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required: true,
        unique : true
    },
    gender : {
        type : String,
        required : true
    },
    classAdvisor : {
        type : String,
    },
} , {minimize : false})

const facultyModel = mongoose.models.faculty || mongoose.model("faculty" , facultySchema)

export default facultyModel