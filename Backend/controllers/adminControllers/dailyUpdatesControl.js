import mongoose from "mongoose";
import timeTableModel from "../../models/timeTableModel.js";
import { dailyAttendanceModel } from "../../models/DbModels.js";

const getCurrentAttendance = async (year , day) => {
    try {
      console.log(year , day);
      
        const data = await dailyAttendanceModel.aggregate([
            { $match: { year: year , day : day}},
            {
              $lookup: {
                from: "subjects",
                localField: "subjectCode",
                foreignField: "code",
                as: "SubjectData"
              }
            },
            { $unwind: "$SubjectData" },
            {
              $lookup: {
                from: "students",
                localField: "absentRegisterNos",
                foreignField: "registerNo",  
                as: "AbsentStudents"
              }
            },
            {
              $project: {
                _id: 1,
                date: 1,
                day: 1,
                year: 1,
                period: 1,
                subjectCode: "$SubjectData.code",
                subjectName: "$SubjectData.name",
                facultyId: "$SubjectData.facultyId",
                absentList: {
                  $map: {
                    input: "$AbsentStudents",
                    as: "student",
                    in: {
                      registerNo: "$$student.registerNo",
                      name: "$$student.name"
                    }
                  }
                }
              }
            },
            { $sort: { period: 1 } }
          ])

        const timeTable = await timeTableModel.findOne({ year:year, day: day})

        const periods = [...new Set(timeTable.periods)];
        
        let finalResult = []
        periods.map((subject , idx) => {
            let attendance = data.filter(item => item.subjectName == subject)
        
            attendance = attendance.filter(item => item.facultyId != null)
            if(attendance.length > 0){
                finalResult.push(...attendance)
            }else{
                const obj = {period :  finalResult.length + 1 , subjectName : subject , absentList: null}
                finalResult.push(obj)
            }
            console.log();
        })

        return finalResult
    } catch (error) {
        console.log("Error " + error.message);
        return []
    } 
}

const getTodayUpdate = async (req, res) => {
    try {
        const {year } = req.params
        const {day} = req.query

        const todayAttendance = await getCurrentAttendance(year , day)
        
        res.json({success : true , todayAttendance})
    } catch (error) {
        console.log(error.message);  
        res.json({success : false , message : error.message}) 
    }
}

export {getTodayUpdate}