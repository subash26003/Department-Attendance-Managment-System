import studentModel from "../../models/adminModels/studentModel.js";
import subjectModel from "../../models/adminModels/subjectModel.js";
import attendanceRecordModel from "../../models/attendanceRecordModel.js";
import mongoose from "mongoose";

export const getStundetOverAllAttendancePercentage = async (studentYear) => {
    let data = []
    try {

        data = await studentModel.aggregate([
            { $match: { ...(studentYear ? { studentYear: studentYear } : {}) } },

            // JOIN attendance and student by ID
            {
                $addFields: {
                    studentId: { $toString: "$_id" }
                }
            },
            {
                $lookup: {
                    from: "attendanceRecords",
                    localField: "studentId",
                    foreignField: "studentId",
                    as: "allAttendance"
                }
            },

            { $unwind: "$allAttendance" },

            { $addFields: { attendanceStatus: "$allAttendance.status" } },

            // filter OUT absent record of each student
            { $match: { attendanceStatus: "absent" } },

            // Group the record of same student in same subjects(count also)
            {
                $group: {
                    _id: {
                        studentId: "$registerNo",
                        studentName: "$name",
                        subjectCode: "$allAttendance.subjectCode",
                    },
                    absent: { $sum: 1 },
                }
            },

            // // JOIN with subject to get the total Periods
            {
                $lookup: {
                    from: "subjects",
                    localField: "_id.subjectCode",
                    foreignField: "code",
                    as: "attendanceWithsubject"
                }
            },

            {
                $unwind: {
                    path: "$attendanceWithsubject",
                    preserveNullAndEmptyArrays: true
                }
            },

            // // get the percentage by divide (absent - totalPeriod) / totalPeriod
            {
                $addFields: {
                    eachSubjectPercentage: {
                        $multiply: [{ $divide: [{ $subtract: ["$attendanceWithsubject.totalPeriods", "$absent"] }, "$attendanceWithsubject.totalPeriods"] }, 100]
                    }
                }
            },

            // // Now group by studentID to get the overAll avg 
            {
                $group: {
                    _id: {
                        studentId: "$_id.studentId",
                        studentName: "$_id.studentName",
                    },
                    attendancePercentage: { $avg: "$eachSubjectPercentage" }
                }
            },

            {
                $addFields: {
                    studentId: "$_id.studentId"
                }
            },

            // // JOIN with student coll to get the basic info of student
            {
                $lookup: {
                    from: "students",
                    localField: "studentId",
                    foreignField: "registerNo",
                    as: "finalResult"
                }
            }, {
                $unwind: "$finalResult"
            },

            {
                $project: {
                    _id: "$finalResult._id",
                    studentId: "$_id.studentId",
                    studentName: "$_id.studentName",
                    attendancePercentage: 1,
                    registerNo: "$finalResult.registerNo",
                    studentYear: "$finalResult.studentYear",
                    mobileNo: "$finalResult.mobileNo",
                    gender: "$finalResult.gender",
                    email: "$finalResult.email" || ""
                }
            },

            { $sort: { registerNo: 1 } }

        ])

        return data
    } catch (error) {
        console.error(error.message);
    } finally {
        return data
    }
}

export const subjectsAttendancePercentageOfEachStudent = async (subjectCode) => {
    const data = await subjectModel.aggregate([
        {
            $match: { code: subjectCode }
        },
        {
            $lookup: {
                from: "students",
                localField: "year",
                foreignField: "studentYear",
                as: "studentWithYear"
            }
        },
        {
            $unwind: "$studentWithYear"
        },
        {
            $addFields: {
                studentId: { $toString: "$studentWithYear._id" }
            }
        },
        {
            $lookup: {
                from: "attendanceRecords",
                let: { studentId: "$studentId", subjectCode: "$subjectCode", status: "$status" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$studentId", "$$studentId"] },
                                    { $eq: ["$subjectCode", subjectCode] }
                                ]
                            }
                        }
                    }
                ],
                as: "studentWithAttendance"
            }
        }, {
            $unwind: "$studentWithAttendance"
        },
        {
            $group: {
                _id: "$studentId",
                absentCount: { $sum: { $cond: [{ $eq: ["$studentWithAttendance.status", "absent"] }, 1, 0] } },
                subjectTotalPeriod: { $first: "$takenPeriod" }
            },
        },
        {
            $addFields: {
                percentage: {
                    $multiply: [{ $divide: [{ $subtract: ["$subjectTotalPeriod", "$absentCount"] }, "$subjectTotalPeriod"] }, 100]
                }
            }
        },
        {
            $addFields: {
                _id: { $toObjectId: "$_id" }
            }
        },

        {
            $lookup: {
                from: "students",
                localField: "_id",
                foreignField: "_id",
                as: "studentData"
            }
        },
        {
            $unwind: "$studentData"
        },
        {
            $addFields: {
                regNo: "$studentData.registerNo"
            }
        },
        {
            $sort: { regNo: 1 }
        },
        {
            $project: {
                _id: "$studentData._id",
                studentName: "$studentData.name",
                registerNo: "$studentData.registerNo",
                gender: "$studentData.gender",
                mobileNo: "$studentData.mobileNo",
                studentYear: "$studentData.studentYear",
                attendancePercentage: "$percentage"
            }
        }

    ])

    return data

}

// Simply List
export const getStudentList = async (subjectCode) => {
    const data = await subjectModel.aggregate([
        { $match: { code: subjectCode } },
        {
            $lookup: {
                from: "students",
                localField: "year",
                foreignField: "studentYear",
                as: "studentWithSubjectYear"
            }
        }, {
            $unwind: "$studentWithSubjectYear"
        },
        {
            $addFields: {
                regNo: "$studentWithSubjectYear.registerNo"
            }
        },
        {
            $sort: { regNo: 1 }
        },
        {
            $project: {
                _id: "$studentWithSubjectYear._id",
                studentName: "$studentWithSubjectYear.name",
                studentYear: "$studentWithSubjectYear.studentYear",
                registerNo: "$studentWithSubjectYear.registerNo",
                mobileNo: "$studentWithSubjectYear.mobileNo",
                gender: "$studentWithSubjectYear.gender",
            }
        }
    ])

    return data

}



const getStudentSubjectWiseAttendanceAttendance = async (studentId) => {
    // First aggregation: Get attendance records with calculated percentages
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
                subjectName: "$subject.name",
                percentage: 1,
                year: "$subject.year",
                presentCount: 1,
                studentId: studentId
            }
        }
    ])


    // Second aggregation: Get all subjects for the student's year
    const studentSubjects = await studentModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(studentId)
            }
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
                            _id: 0,
                            subjectName: "$name",
                            subjectCode: "$code"
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

    // Merge the results

    const student = await studentModel.findOne({ _id: new mongoose.Types.ObjectId(studentId) })


    let subjectAttendance = studentSubjects.map(subject => {
        const attendance = attendanceData.find(item =>
            item.subjectCode === subject.subjectCode
        );
        return {
            subjectName: subject.subjectName,
            subjectCode: subject.subjectCode,
            percentage: attendance?.percentage ?? 100 // Default to 100% if no attendance record
        };
    });
    let average = subjectAttendance.reduce((a, subject) => a + subject.percentage, 0) / subjectAttendance.length

    return average
}
const getAllStudentAttendancePercentage = async (year) => {
    try {
        const students = await studentModel.aggregate([
            {
                $match : {studentYear : year}
            },
            {
                $project: {
                    _id: 1,
                    studentName: "$name",
                    attendancePercentage: 1,
                    registerNo: 1,
                    studentYear: 1,
                    mobileNo: 1,
                    gender: 1,
                    email: 1 || ""
                }
            },
            {$sort : {registerNo : 1}}
        ])

        let studentList = await Promise.all(students.map(async (student) => {
            let obj = student
            let averagePercentage = await getStudentSubjectWiseAttendanceAttendance(student._id.toString())
            obj.attendancePercentage = averagePercentage
            return obj
        }))
        
        return studentList
    } catch (error) {
        return []

    }


}

export { getAllStudentAttendancePercentage, getStudentSubjectWiseAttendanceAttendance }
