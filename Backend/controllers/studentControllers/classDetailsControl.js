import studentModel from "../../models/adminModels/studentModel.js"



const getTimetable = async (req, res) => {
    try {
        const {regNo} = req 
        console.log(regNo);
        
        const data = await studentModel.aggregate([
            {
                $match : {registerNo : regNo}
            },
            {
                $lookup : {
                    from : "timetables",
                    localField : "studentYear",
                    foreignField : 'year',
                    as : "studentTimetable"
                }
            },
            {
                $unwind : "$studentTimetable"
            },
            {
                $addFields : {
                    year : "$studentTimetable.year",
                    day : "$studentTimetable.day",
                    periods : "$studentTimetable.periods",
                    
                }
            },
            {
                $project : {
                    year : 1,
                    day : 1,
                    periods : 1
                }
            }
        ])

        console.log(data);
        
        const days = ["Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday"]
    
        const timetable = days.map((day) => {
            const match = data.filter(item => item.day.toLowerCase() == day.toLowerCase())
            return match[0]
        })

        res.json({success : true , timetable})
    } catch (error) {
        console.error(error);
        res.json({success : false , message : error.message})
    }
}

export {getTimetable}