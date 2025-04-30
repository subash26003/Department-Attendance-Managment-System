import mongoose from "mongoose";


const ApprovedOdSchema = new mongoose.Schema({
    studentName : {
        type : String,
        required : true
    },
    registerNo : {
        type : String,
        required : true,
    },
    studentYear : {
        type : String,
        required : true,
    },
    fromDate : {
        type : Date,
        required : true
    },
    toDate : {
        type : Date,
        required : true
    },
    expireAt: {
        type : Date,
        required : true,
        index : {expires : 0}
    }
})

const approvedODModel = mongoose.models.approvedOD || mongoose.model('approvedOD' , ApprovedOdSchema)

export default approvedODModel