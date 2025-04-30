
import mongoose from "mongoose";

const subjectScheme = new mongoose.Schema({
    name : {
        type : String
    },
    code : {
        type : String,
        unique : true
    },
    duration : {
        type : String,
    },
    year : {
        type : String
    },
    subjectType : {
        type : String
    },
    facultyId : {
        type : String
    },
    type : {
        type : String
    },
    totalPeriods: {
        type : Number,
    },
    takenPeriod: {
        type : Number,
        default : 0
    }
}, {minimize : false})

const subjectModel = mongoose.models.subject || mongoose.model("subject" , subjectScheme)


export default subjectModel

