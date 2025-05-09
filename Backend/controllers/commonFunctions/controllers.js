import studentModel from "../../models/adminModels/studentModel.js";
import subjectModel from "../../models/adminModels/subjectModel.js";
import attendanceRecordModel from "../../models/attendanceRecordModel.js";
import mongoose from "mongoose";

export const getStundetOverAllAttendancePercentage = async (studentYear, startDate, endDate) => {
  try {

    const data = await studentModel.aggregate([
      // Filter students by year if specified
      {
        $match: {
          ...(studentYear ? { studentYear: studentYear } : {})
        }
      },

      // Convert _id to string for lookup
      {
        $addFields: {
          studentId: { $toString: "$_id" }
        }
      },

      // Join with attendance records (preserve students with no records)
      {
        $lookup: {
          from: "attendanceRecords",
          let: { studentId: "$studentId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$studentId", "$$studentId"] },
                    { $eq: ["$status", "absent"] },
                    ...(startDate ? [{ $gte: ["$recordedAt", new Date(startDate).toISOString()] }] : []),
                    ...(endDate ? [{ $lte: ["$recordedAt", new Date(endDate).toISOString()] }] : [])
                  ]
                }
              }
            },
            {
              $group: {
                _id: "$subjectCode",
                absentCount: { $sum: 1 }
              }
            }
          ],
          as: "absentRecords"
        }
      },

      // Join with subjects to get total periods
      {
        $lookup: {
          from: "subjects",
          localField: "studentYear",
          foreignField: "year",
          as: "subjects"
        }
      },

      // Calculate attendance for each subject
      {
        $addFields: {
          subjectAttendance: {
            $map: {
              input: "$subjects",
              as: "subject",
              in: {
                subjectCode: "$$subject.code",
                subjectName: "$$subject.name",
                takenPeriod: "$$subject.takenPeriod",
                absentCount: {
                  $let: {
                    vars: {
                      matchedRecord: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$absentRecords",
                              as: "record",
                              cond: { $eq: ["$$record._id", "$$subject.code"] }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: {
                      $ifNull: ["$$matchedRecord.absentCount", 0]
                    }
                  }
                },
                percentage: {
                  $cond: [
                    { $eq: ["$$subject.takenPeriod", 0] },
                    100, // If no periods, consider 100% attendance
                    {
                      $multiply: [
                        {
                          $divide: [
                            {
                              $subtract: [
                                "$$subject.takenPeriod",
                                {
                                  $ifNull: [
                                    {
                                      $let: {
                                        vars: {
                                          matchedRecord: {
                                            $arrayElemAt: [
                                              {
                                                $filter: {
                                                  input: "$absentRecords",
                                                  as: "record",
                                                  cond: { $eq: ["$$record._id", "$$subject.code"] }
                                                }
                                              },
                                              0
                                            ]
                                          }
                                        },
                                        in: "$$matchedRecord.absentCount"
                                      }
                                    },
                                    0
                                  ]
                                }
                              ]
                            },
                            "$$subject.takenPeriod"
                          ]
                        },
                        100
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      },

      // Calculate overall attendance percentage
      {
        $addFields: {
          attendancePercentage: {
            $avg: "$subjectAttendance.percentage"
          }
        }
      },

      // Project final output
      {
        $project: {
          _id: 1,
          studentId: "$registerNo",
          studentName: "$name",
          registerNo: 1,
          studentYear: 1,
          mobileNo: 1,
          gender: 1,
          email: 1,
          attendancePercentage: {
            $ifNull: ["$attendancePercentage", 100] // 100% if no records
          },
          subjectDetails: "$subjectAttendance"
        }
      },

      { $sort: { registerNo: 1 } }
    ])

    return data
  } catch (error) {
    console.error(error);
  }
}

export const subjectsAttendancePercentageOfEachStudent = async (subjectCode, startDate, endDate) => {
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
                  { $eq: ["$subjectCode", subjectCode] },
                  ...(startDate ? [{ $gte: ["$recordedAt", new Date(startDate).toISOString()] }] : []),
                  ...(endDate ? [{ $lte: ["$recordedAt", new Date(endDate).toISOString()] }] : [])
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
        $match: { studentYear: year }
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
      { $sort: { registerNo: 1 } }
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
