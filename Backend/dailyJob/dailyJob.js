import mongoose from "mongoose";
import { dailyAttendanceModel } from "../models/DbModels.js";
import studentModel from "../models/adminModels/studentModel.js";
import subjectModel from "../models/adminModels/subjectModel.js";
import attendanceRecordModel from "../models/attendanceRecordModel.js";
import { RecordingSettingsContextImpl } from "twilio/lib/rest/video/v1/recordingSettings.js";

const getStudentId = async (studentRegNo) => {
    let student = await studentModel.findOne({ registerNo: studentRegNo })
    return student._id.toString()
}

const getRecordOfEachPeriod = async (periodData) => {
    let records = await Promise.all(periodData.absentRegisterNos.map(async (studentRegNo) => {
        let record = {
            subjectCode: periodData.subjectCode,
            day: periodData.day,
            year: periodData.year,
            status: "absent",
            period: periodData.period,
            recordedAt: new Date(periodData.date).toISOString()
        }
        let studentId = await getStudentId(studentRegNo)
        record.studentId = studentId

        return record
    }))

    return records
}


const updateAttendanceRecords = async (today) => {
    try {
        const dailyAttendance = await dailyAttendanceModel.find({ day: today })

        let records = await Promise.all(dailyAttendance.map(async (eachPeriod) => await getRecordOfEachPeriod(eachPeriod)))
        records = records.flat(Infinity)
        console.log(records);
        if (records.length <= 0) return;
        await attendanceRecordModel.insertMany(records)
        return true;

    } catch (error) {
        console.log(error);
        return false
    }
}

const updateTakenPeriod = async (today) => {
    try {
        const eachSubjectTakenCount = await dailyAttendanceModel.aggregate([
            {
                $match: { day: today }
            },
            {
                $group: {
                    _id: {
                        subjectCode: "$subjectCode",
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $addFields: {
                    subjectCode: "$_id.subjectCode",
                }
            },
            {
                $project: {
                    subjectCode: 1,
                    count: 1,
                    _id: 0
                }
            }
        ])

        const getCount = (subjectCode) => {
            let subject = eachSubjectTakenCount.find(item => item.subjectCode === subjectCode)
            return subject ? subject.count : 0
        }
        const subjects = await subjectModel.find({ facultyId: { $ne: null } })

        subjects.forEach(async subject => {
            let count = getCount(subject.code)
            subject.takenPeriod += count
            await subject.save()
        })

        return true
    } catch (error) {
        console.log(error);
        return false
    }

}

const deleteRecords = async (today) => {
    try {
        await dailyAttendanceModel.deleteMany({ day: today })
    } catch (error) {
        console.log(error);
    }
}


const dailyJob = async () => {
    try {
        let dayIndex = new Date().getDay() - 1;

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

        if (dayIndex <= -1 && dayIndex >= days.length) {
            return;
        }
        if (!days[dayIndex]) {
            return;
        }

        let today = days[dayIndex]

        //Updating Records and subject
        await updateAttendanceRecords(today)
        await updateTakenPeriod(today)

        // deleterecord function call
        await deleteRecords(today)

        console.log("Job Done");

    } catch (error) {
        console.log(error);
    }
}

export default dailyJob