import { adminDataModel } from "../../models/DbModels.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import attendanceRecordModel from "../../models/attendanceRecordModel.js"
import subjectModel from "../../models/adminModels/subjectModel.js"
import { getStundetOverAllAttendancePercentage, subjectsAttendancePercentageOfEachStudent } from "../commonFunctions/controllers.js"
import { getSubjectWisePercentage } from "../studentControllers/studentController.js"
import markModel from "../../models/markModel.js"
import studentModel from "../../models/adminModels/studentModel.js"
import mongoose from "mongoose"
import semesterModel from "../../models/adminModels/semesterModel.js"


const generateToken = async (payload) => {
    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY)

    return token
}

const handleAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(email, password);

        const admin = await adminDataModel.findOne({})
        console.log(admin);

        if (!admin) {
            res.json({ success: false, message: "Invalid Credentials" })
            return
        }

        const verifyPass = await bcrypt.compare(password, admin.password)

        if (verifyPass) {
            res.json({ success: true, token: await generateToken({ email }) })
            return
        }
        res.json({ success: false, message: 'Invalid Credentials' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


const handleAdminSignup = async (req, res) => {
    try {
        const { email, password, hodMail } = req.body

        const admin = await adminDataModel.findOne({})

        if (admin) {
            res.json({ success: false, message: "Not Authorized" })
            return
        }

        const hashedPass = await bcrypt.hash(password, 10)

        const newAdmin = await adminDataModel.insertOne({ email, password: hashedPass, hodMail })

        res.json({ success: true, message: "Signup successfull" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



const getSubjectsAverageAttendance = async (req, res) => {
    try {
        const year = req.body

        console.log(result);
        console.log("ended");


    } catch (error) {
        console.error("Error in aggregation:", error);
        throw error;
    }
};

const getAttendanceDashboard = async (req, res) => {
    try {
        const { year, subjectCode, studentId, startDate, endDate } = req.query;
        console.log(startDate);
        console.log(endDate);


        const subjectSummary = await subjectModel.aggregate([
            {
                $match: {
                    ...(year ? { year: year } : {}),
                    ...(subjectCode ? { code: subjectCode } : {})
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "year",
                    foreignField: "studentYear",
                    as: "students"
                }
            },
            {
                $unwind: "$students"
            },
            {
                $lookup: {
                    from: "attendanceRecords",
                    let: {
                        studentId: { $toString: "$students._id" },
                        subjectCode: "$code"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$studentId", "$$studentId"] },
                                        { $eq: ["$subjectCode", "$$subjectCode"] },
                                        ...(startDate ? [{ $gte: ["$recordedAt", new Date(startDate).toISOString()] }] : []),
                                        ...(endDate ? [{ $lte: ["$recordedAt", new Date(endDate).toISOString()] }] : [])
                                    ]
                                }
                            }
                        }
                    ],
                    as: "attendanceRecords"
                }
            },
            {
                $group: {
                    _id: {
                        subjectCode: "$code",
                        studentId: "$students._id"
                    },
                    takenPeriod: { $first: "$takenPeriod" },
                    absentCount: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: "$attendanceRecords",
                                    as: "record",
                                    cond: { $eq: ["$$record.status", "absent"] }
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    attendancePercentage: {
                        $cond: [
                            { $eq: ["$takenPeriod", 0] },
                            0,
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            { $subtract: ["$takenPeriod", "$absentCount"] },
                                            "$takenPeriod"
                                        ]
                                    },
                                    100
                                ]
                            }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.subjectCode",
                    averagePercentage: { $avg: "$attendancePercentage" }
                }
            },
            {
                $project: {
                    _id: 0,
                    code: "$_id",
                    avgPercentage: { $round: ["$averagePercentage", 2] }
                }
            },
            {
                $sort: { code: 1 }
            }
        ])

        let studentSummary = []
        if (subjectCode) {
            studentSummary = await subjectsAttendancePercentageOfEachStudent(subjectCode, startDate, endDate)
        } else {
            studentSummary = await getStundetOverAllAttendancePercentage(year, startDate, endDate)
        }

        res.json({
            success: true, data: { subjectSummary, studentSummary }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getStudentReport = async (req, res) => {
    try {
        const { studentId } = req.query
        const studentReport = await getSubjectWisePercentage(studentId)
        res.json({ success: true, studentReport })
    } catch (error) {
        console.error("Error in aggregation:", error);
        throw error;
    }
}

const getStudentAcademicReport = async (req, res) => {
    // Convert to ObjectId
    try {
        const { studentId, startDate, endDate } = req.query
        console.log(startDate);
        console.log(endDate);

        const studentObjectId = new mongoose.Types.ObjectId(studentId);

        // Get attendance data with percentages
        const attendanceData = await attendanceRecordModel.aggregate([
            {
                $match: {
                    status: "absent",
                    studentId: studentId,
                    ...(startDate && endDate && {
                        recordedAt: {
                            $gte: new Date(startDate).toISOString(),
                            $lte: new Date(endDate).toISOString()
                        }
                    })
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

        console.log(attendanceData);



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

        console.log(enrolledSubjects);

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

        res.json({ success: true, studentReport: academicReport })
    } catch (error) {
        console.error(error);
        throw error;
    }


};


export const updateSemesterData = async (req, res) => {
    try {
        const { noOfYears, dates } = req.body;
        console.log(req.body);
        
        const updated = await semesterModel.findOneAndUpdate(
            {},
            { noOfYears, dates },
            { new: true, upsert: true }
        );

        res.status(200).json({ message: "Semester data saved", data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getSemesterData = async (req , res) => {
     try {
    const semester = await semesterModel.findOne();
    if (semester) return res.json(semester);
    return res.status(404).json({ message: "No semester found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const removeStudent = async (req , res) => {
    try {
        const {_id} = req.params
        await studentModel.deleteOne({_id : _id})
        res.json({success : true})
    } catch (error) {
        console.log(error);
        res.json({success : false , message : "Network Error"})
    }
} 

export { handleAdminLogin, handleAdminSignup, getAttendanceDashboard, getSubjectsAverageAttendance, getStudentReport, getStudentAcademicReport }