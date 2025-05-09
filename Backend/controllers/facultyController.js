import facultyModel from "../models/adminModels/facultyModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import studentModel from "../models/adminModels/studentModel.js";
import subjectModel from "../models/adminModels/subjectModel.js"
import timeTableModel from "../models/timeTableModel.js"
import { getAllStudentAttendancePercentage, getStudentList, getStundetOverAllAttendancePercentage, subjectsAttendancePercentageOfEachStudent } from './commonFunctions/controllers.js'
import { dailyAttendanceModel } from "../models/DbModels.js";
import requestModel from "../models/requestModel.js";
import { sendMailToHOD, sendMailToStudent } from "../services/mailService.js";
import { sendOtpToFaculty } from "../services/OtpService.js";
import otpModel from "../models/optModel.js";
import markModel from "../models/markModel.js";
import sendMessageToParents from "../services/smsService.js";
import mongoose from "mongoose";


const generateToken = async (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY)
    return token
}



const handleLogin = async (req, res) => {
    try {
        const { email } = req.body
        console.log(email);

        const faculty = await facultyModel.findOne({ email: email })

        if (!faculty) {
            res.json({ success: false, message: "You are Unauthorized" })
            return
        }

        const optExist = await otpModel.findOne({ email: email })

        if (optExist) {
            res.json({ success: false, message: "Otp Already Sent" })
            return
        }

        let Otp = Math.floor(100000 + (Math.random() * 900000)).toString()

        await sendOtpToFaculty(faculty.email, Otp)

        res.json({ success: true, message: "OTP sent" })
        const expireTime = new Date(Date.now() + (5 * 60 * 1000))

        const otpData = await otpModel({
            email: faculty.email,
            otp: Otp,
            expireAt: expireTime
        })

        await otpData.save();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body
        const faculty = await facultyModel.findOne({ email: email })

        if (!faculty) {
            res.json({ success: false, message: "Invalid Email" })
            return
        }

        const otpData = await otpModel.findOne({ email: email })

        if (otpData.otp !== otp) {
            res.json({ success: false, message: "Invalid OTP" })
            return
        }



        const payload = {
            id: faculty._id.toString()
        }
        const token = await generateToken(payload)

        res.json({ success: true, token })

        await otpModel.deleteOne({ email: email })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const getClassAdvisorData = async (year) => {
    try {
        const studentList = await studentModel.find({ studentYear: year[year.length - 1] })
        const timeTable = await periodModel.find({})

    } catch (error) {
        console.log(error);

    }
}

const getFacultyTimeTable = async (subjectList) => {

    const timeTable = await timeTableModel.find({ periods: { $in: subjectList } })
    // list of all periods taken by the staff of every class
    let sample = timeTable.map(item => {
        let period = []
        for (let i = 0; i < item.periods.length; i++) {
            let sub = item.periods[i]
            if (subjectList.indexOf(sub) !== -1) {
                let obj = { "period": i + 1, subjectName: sub, year: item.year, day: item.day }
                period.push(obj)
            }
        }
        return period

    })


    //------------------------------------------------------
    // flaten the array -> list of object which has
    // {
    //     period: 2,
    //     subjectName: 'Chemistry',
    //     year: 'year2',
    //     day: 'Tuesday'
    //   },
    //------------------------------------------------------

    sample = sample.flat(Infinity)

    let dayWisePeriods = {}

    sample.map(item => {
        if (!dayWisePeriods[item.day]) {
            dayWisePeriods[item.day] = []
        }
        dayWisePeriods[item.day].push(item)
    })


    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const sortedTimetable = Object.fromEntries(
        dayOrder
            .filter(day => dayWisePeriods[day]) // only include existing keys
            .map(day => [day, dayWisePeriods[day]])
    );

    Object.keys(sortedTimetable).map(key => {
        let dayPeriod = sortedTimetable[key]
        dayPeriod[key] = dayPeriod.sort((a, b) => Number(a.period) - Number(b.period))
    })


    return sortedTimetable
}

const getInitialData = async (req, res) => {
    try {
        const f_id = req.id
        const faculty = await facultyModel.findOne({ _id: f_id })

        if (!faculty) {
            res.json({ success: false, message: "Unauthorized Access" })
            return
        }
        // getting the faculty sbjects
        const subjects = await subjectModel.find({ facultyId: f_id }, { name: 1, code: 1, _id: 1 })
        const subjectArray = subjects.map(item => {
            return { name: item.name, code: item.code, _id: item._id.toString() }
        })
        let studentList = []
        if (faculty.classAdvisor?.length > 0) {
            studentList = await getAllStudentAttendancePercentage(faculty.classAdvisor)
            if (studentList.length <= 0) {
                studentList = await studentModel.find({ studentYear: faculty.classAdvisor }).sort({ registerNo: 1 })
            }
        }

        let facultyDetails = { name: faculty.name, email: faculty.email, gender: faculty.gender, classAdvisor: faculty.classAdvisor, subjects: subjectArray }

        let dayWisePeriods = await getFacultyTimeTable(subjectArray.map(item => item.name))

        const data = { dayWisePeriods, facultyDetails, studentList }

        res.json({ success: true, data })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

// For particular subject
const getStudentListWithAttendancePercentage = async (req, res) => {
    try {
        const { subjectCode } = req.params;

        let studentList = await subjectsAttendancePercentageOfEachStudent(subjectCode)
        if (studentList.length > 0) {
            res.json({ success: true, studentList })
            return
        } else {
            studentList = await getStudentList(subjectCode)
        }

        res.json({ success: true, studentList })
    } catch (error) {
        console.error("e -> " + error.message);
        res.json({ success: false, message: error.message })
    }
}

// Daily Attendance
const getTodaySubjectAttendanceList = async (req, res) => {
    

    try {
        const { subjectCode, period , day} = req.query
        const data = await dailyAttendanceModel.aggregate([
            { $match: { subjectCode: subjectCode, day: day, period: parseInt(period) } },
            {
                $lookup: {
                    from: "students",
                    localField: "year",
                    foreignField: "studentYear",
                    as: "allStudents"
                },
            }
        ])

        if (!data[0]) {
            res.json({ success: false, message: "Not Updated" })
            return
        }

        const { absentRegisterNos, allStudents } = data[0]

        let finalResult = allStudents.map(student => {

            if (absentRegisterNos.includes(student.registerNo)) {
                student['status'] = 'absent'
            } else {
                student['status'] = 'present'
            }
            const studentdata = {
                "name": student.name,
                "registerNo": student.registerNo,
                "gender": student.gender,
                "studentYear": student.studentYear,
                "status": student.status
            }
            return studentdata
        })

        finalResult.sort((a, b) => parseInt(a.registerNo) - parseInt(b.registerNo))

        const attendanceData = { count: absentRegisterNos.length, studentList: finalResult }

        res.json({ success: true, data: attendanceData })

    } catch (error) {
        console.error("e -> " + error.message);
        res.json({ success: false, message: error.message })
    }
}

const updateDailyAttendance = async (req , res , next) => {
    try {
        const { subjectCode, period , day , registerNo , action} = req.body

        console.log(subjectCode , period , day);
        
        
        const attendance = await dailyAttendanceModel.findOne({subjectCode , period : Number.parseInt(period) , day})
        console.log(attendance);
        
        if(action === "remove"){
            attendance.absentRegisterNos = attendance.absentRegisterNos.filter(no => no !== registerNo);
        }else{
            if (!attendance.absentRegisterNos.includes(registerNo)) {
                attendance.absentRegisterNos.push(registerNo);
            }
        }
        await attendance.save();
        req.query.subjectCode = subjectCode; 
        req.query.period = period; 
        req.query.day = day; 

        console.log(attendance);
        
        next();
                
    } catch (error) {
        res.json({success : false , message : "Server Error"})
        console.log(error);
        
    }
}

const getRequestList = async (req, res) => {
    try {
        const faculty = await facultyModel.findOne({ _id: req.id })
        if (!faculty.classAdvisor) {
            res.json({ success: false, message: "No Request List" })
            return
        }
        const list = await requestModel.find({ sender: 'student', studentYear: faculty.classAdvisor })
        console.log(list);

        res.json({ success: true, requestList: list })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

const handleRequestApprovel = async (req, res) => {
    try {
        const { requestId, action } = req.body

        const updatedRequest = await requestModel.findByIdAndUpdate({ _id: requestId }, { $set: { status: action == 'reject' ? 'rejected' : "verified" } })
        if (!updatedRequest) {
            res.json({ success: false, message: "No Request" })
            return
        }

        res.json({ success: true, message: "Approved" })
        sendMailToHOD(updatedRequest)
        sendMailToStudent(updatedRequest, 'Class Advisor')

    } catch (error) {
        console.error("e -> " + error.message);
        res.json({ success: false, message: error.message })
    }
}


const uploadSubjectMarks = async (req, res) => {
    try {
        const marksData = JSON.parse(req.body.body);
        console.log(typeof marksData);

        const operations = marksData.map(mark => {
            return markModel.findOneAndUpdate(
                { subjectId: mark.subjectId, studentId: mark.studentId },
                { $set: mark },
                { upsert: true, new: true }
            );
        });

        await Promise.all(operations);
        res.status(200).json({ success: true, message: 'Marks updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to update marks' });
    }
}

const getStudentListWithMarks = async (req, res) => {
    try {
        const { subjectCode } = req.params;

        const data = await subjectModel.aggregate([
            {
                $match: { code: subjectCode }
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
                    from: "marks",
                    let: {
                        subjectId: { $toString: "$_id" },
                        studentId: { $toString: "$students._id" }
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$subjectId", "$$subjectId"] },
                                        { $eq: ["$studentId", "$$studentId"] }
                                    ]
                                }
                            }
                        },
                        {
                            $project: {
                                internal1: 1,
                                internal2: 1,
                                _id: 0
                            }
                        }
                    ],
                    as: "marks"
                }
            },
            {
                $unwind: {
                    path: "$marks",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    subjectCode: "$code",
                    subjectName: "$name",
                    studentId: "$students._id",
                    registerNo: "$students.registerNo",
                    studentName: "$students.name",
                    studentYear: "$students.studentYear",
                    marks: {
                        internal1: "$marks.internal1",
                        internal2: "$marks.internal2"
                    }
                }
            },
            {
                $sort: {
                    registerNo: 1
                }
            }
        ])
        res.json({ success: true, studentList: data })
    } catch (error) {
        console.log(error);
        res.json({ success: true, message: error.message })
    }
}

const sendStudentReport = async (req, res) => {
    try {
        const { studentData } = req.body
        console.log(studentData);
        
        const student = await studentModel.findById({_id : new mongoose.Types.ObjectId(studentData.studentId)})
        console.log(student);
        
        let message = `Report - ${student.name}\n`;

        studentData.report.forEach((subj, i) => {
            message += `${i + 1}) ${subj.subjectCode} - M:${subj.marks.internal1}, A:${subj.attendance.percentage}%\n`;
        });

        

        await sendMessageToParents(message , student.parentMobileNo)
        res.json({ success: true })

    } catch (error) {
        res.json({ success: false, message: "Server Error" })
        console.log(error);
    }
}


export { handleLogin, getInitialData, getStudentListWithAttendancePercentage, getTodaySubjectAttendanceList, getRequestList, handleRequestApprovel, verifyOtp, uploadSubjectMarks, getStudentListWithMarks, sendStudentReport ,updateDailyAttendance}