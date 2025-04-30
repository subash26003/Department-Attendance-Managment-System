import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema({
    studentId: {
        type: String,
    },
    subjectCode: {
        type: String
    },
    date: {
        type: Date
    },
    day: {
        type: String
    },
    period: {
        type: Number,
    },
    year: {
        type: String
    },
    status: {
        type: String
    },
    recordedAt: {
        type: Date
    }

}, {
    collection : 'attendanceRecords'
})

const attendanceRecordModel = mongoose.models.attendanceRecords || mongoose.model("attendanceRecords", attendanceRecordSchema)

export default attendanceRecordModel