import jwt from "jsonwebtoken";
import studentModel from "../../models/adminModels/studentModel.js";
import attendanceRecordModel from "../../models/attendanceRecordModel.js"
import bcrypt from 'bcrypt'
import mongoose from "mongoose";
import otpModel from "../../models/optModel.js";
import { sendOTPToStudent } from "../../services/OtpService.js";
import markModel from "../../models/markModel.js";

const handleSignUp = async (req, res) => {
    try {
        const formData = req.body
        const { email, regNo } = formData

        const student = await studentModel.findOne({ registerNo: regNo })
        console.log(formData)

        if (!student) {

            res.json({ success: false, message: "Invalid Register No" })
            return
        }

        if (student.email) {
            res.json({ success: false, message: "Already registered" })
            return
        }

        const st = await studentModel.findOne({ email: email })

        if (st) {
            res.json({ success: false, message: "Email exists" })
            return
        }

        await studentModel.findOneAndUpdate({ registerNo: regNo }, { $set: { email: email } })

        res.json({ success: true, message: 'Signed' })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message })
    }
}

const tokenGenerate = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY)
    return token
}

const handleLogin = async (req, res) => {
    try {
        const { email } = req.body
        const student = await studentModel.findOne({ email: email })
        if (!student) {
            res.json({ success: false, message: "Not Registered" })
            return
        }
        const otpData = await otpModel.findOne({ email: email })

        if (otpData) {
            res.json({ success: false, message: "OTP already sent" })
            return
        }
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        const expireTime = new Date(Date.now() + (5 * 60 * 1000))
        const otp = await otpModel.insertOne({ email: email, otp: OTP, expireAt: expireTime })

        sendOTPToStudent(email, OTP)
        res.json({ success: true, message: "OPT sent" })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

const handleVerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        console.log(req.body);

        const otpData = await otpModel.findOne({ email: email })
        console.log(otpData.otp);

        if (otpData.otp !== otp) {
            res.json({ success: false, message: "Invalid OTP" })
            return
        }

        await otpModel.deleteOne({ email })

        const student = await studentModel.findOne({ email: email })
        const token = await tokenGenerate({ regNo: student.registerNo })
        res.json({ success: true, token })

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message })
    }
}

const getSubjectWisePercentage = async (studentId) => {
    try {
        const data = await attendanceRecordModel.aggregate([
            {
                $match: { status: "absent", studentId: studentId }
            },
            {
                $group: {
                    _id: "$subjectCode",
                    totalAbsentCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "subjects",
                    localField: "_id",
                    foreignField: "code",
                    as: "subject"
                }
            },
            {
                $unwind: "$subject"
            },
            {
                $addFields: {
                    presentCount: {
                        $subtract: ["$subject.takenPeriod", "$totalAbsentCount"]
                    },
                }
            },
            {
                $addFields: {
                    percentage: {
                        $multiply: [{ $divide: ["$presentCount", "$subject.takenPeriod"] }, 100]
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    subjectCode: "$_id",
                    percentage: "$subject.percentage",
                    percentage: 1,
                    year: "$subject.year",
                }
            }

        ])

        console.log(data);
        console.error("---".repeat(50));

        const subjects = await studentModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(studentId) }
            },
            {
                $lookup: {
                    from: "subjects",
                    let: { studentYear: "$studentYear" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$year", "$$studentYear"] },
                                        { $ne: ["$facultyId", null] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "studentSubjects"
                }
            },
            {
                $unwind: "$studentSubjects"
            },
            {
                $project: {
                    subjectName: "$studentSubjects.name",
                    code: "$studentSubjects.code"
                }
            }
        ])

        const finalResult = subjects.map((subject) => {
            const sub = data.filter(item => subject.code == item.subjectCode)
            if (sub[0]) {
                return { subjectName: subject.subjectName, subjectCode: sub[0].subjectCode, percentage: sub[0].percentage }
            }

            return { subjectName: subject.subjectName, subjectCode: subject.code, percentage: 100 }
        })

        console.error(finalResult);
        return finalResult
    } catch (error) {
        console.error(error.message)

    }
}

const getAcademicReport = async (studentId) => {
    try {
        const studentObjectId = new mongoose.Types.ObjectId(studentId);

        // Get attendance data with percentages
        const attendanceData = await attendanceRecordModel.aggregate([
            {
                $match: {
                    status: "absent",
                    studentId: studentId
                }
            },
            {
                $group: {
                    _id: "$subjectCode",
                    totalAbsentCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "subjects",
                    localField: "_id",
                    foreignField: "code",
                    as: "subject"
                }
            },
            {
                $unwind: "$subject"
            },
            {
                $addFields: {
                    presentCount: {
                        $subtract: ["$subject.takenPeriod", "$totalAbsentCount"]
                    },

                }
            },
            {
                $addFields: {
                    percentage: {

                        $multiply: [
                            { $divide: ["$presentCount", "$subject.takenPeriod"] },
                            100
                        ]

                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    subjectCode: "$_id",
                    attendancePercentage: "$percentage",
                    presentCount: 1,

                }
            }
        ])

        // Get marks data
        const marksData = await markModel.aggregate([
            {
                $match: { studentId: studentId }
            },
            {
                $addFields: {
                    subjectObjId: { $toObjectId: "$subjectId" }
                }
            },
            {
                $lookup: {
                    from: "subjects",
                    localField: "subjectObjId",
                    foreignField: "_id",
                    as: "subject"
                }
            },
            {
                $unwind: "$subject"
            },

            {
                $project: {
                    _id: 0,
                    subjectCode: "$subject.code",
                    internal1: 1,
                    internal2: 1,
                }
            }
        ])



        // Get all enrolled subjects
        const enrolledSubjects = await studentModel.aggregate([
            {
                $match: { _id: studentObjectId }
            },
            {
                $lookup: {
                    from: "subjects",
                    let: { studentYear: "$studentYear" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$year", "$$studentYear"] },
                                        { $ne: ["$facultyId", null] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                subjectName: "$name",
                                subjectCode: "$code",
                                takenPeriod: "$takenPeriod"
                            }
                        }
                    ],
                    as: "subjects"
                }
            },
            {
                $unwind: "$subjects"
            },
            {
                $replaceRoot: { newRoot: "$subjects" }
            }
        ])

        // Combine all data
        const academicReport = enrolledSubjects.map(subject => {
            const attendance = attendanceData.find(a => a.subjectCode === subject.subjectCode);
            const marks = marksData.find(m => m.subjectCode === subject.subjectCode);

            return {
                subjectCode: subject.subjectCode,
                subjectName: subject.subjectName,
                attendance: {
                    percentage: attendance?.attendancePercentage ?? 100,
                    classesAttended: attendance?.presentCount,
                    totalClasses: subject.takenPeriod
                },
                marks: marks ? {
                    internal1: marks.internal1,
                    internal2: marks.internal2,
                    average: marks.average
                } : null
            };
        });

        return academicReport
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const handleInitialData = async (req, res) => {
    try {
        const { regNo } = req

        const student = await studentModel.findOne({ registerNo: regNo })

        if (!student) {
            res.json({ success: false, message: "Student Not Found" })
            return
        }

        const studentReport = await getAcademicReport(student._id.toString())

        const studentData = {student, studentReport}
        res.json({ success: true, studentData })

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message })
    }
}

export { handleSignUp, handleLogin, handleInitialData, handleVerifyOtp, getSubjectWisePercentage }