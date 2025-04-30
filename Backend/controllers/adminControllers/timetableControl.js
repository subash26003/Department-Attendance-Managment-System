
import timeTableModel from "../../models/timeTableModel.js";


// Upload Timetable

const uploadTimeTable = async (req, res) => {
    try {
        const { formatedData } = req.body
        const year = formatedData[0].year

        await timeTableModel.deleteMany({ year: year})
        await timeTableModel.insertMany(formatedData)
        console.log(formatedData);
        res.json({ success: true, message: "TimeTable Uploaded" })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

const getTimetableData = async (req, res) => {
    try {
        const timetableData = await timeTableModel.find({})
        console.log(timetableData);

        res.json({ success: true, timetableData })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export {
    uploadTimeTable, getTimetableData
}