import mongoose from "mongoose";

const timeTableSchema = new mongoose.Schema({
    year : {type : String},
    day : {
        type : String
    },
    periods : {
        type : Array,
        default : []
    }
},{minimize : false})

const timeTableModel = mongoose.models.timeTable || mongoose.model("timeTable" , timeTableSchema)

export default timeTableModel