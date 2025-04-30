import approvedODModel from "../../models/approvedODModel.js";
import requestModel from "../../models/requestModel.js"
import { sendMailToStudent } from "../../services/mailService.js";

const addApprovedODRequest = async (requestData) => {

    try {
        const toDate = new Date(requestData.toDate)
        toDate.setUTCHours(23);
        toDate.setUTCMinutes(59);
        toDate.setUTCSeconds(59);

        const odData = {
            studentName: requestData.name,
            studentYear : requestData.studentYear,
            registerNo: requestData.registerNo,
            fromDate: new Date(requestData.fromDate),
            toDate: toDate,
            expireAt: toDate
        }

        const approvedOd = await approvedODModel.insertOne(odData)

        console.log(approvedOd);

    } catch (error) {
        console.log(error);

    }
}

const handleRequest = async (req, res) => {
    try {
        const { requestId, action } = req.body
        console.log("HOD LOG");

        console.log(req.body);

        const updatedRequest = await requestModel.findByIdAndUpdate({ _id: requestId }, { $set: { status: action ? 'approved' : 'rejected' } })
        console.log(updatedRequest);


        if (!updatedRequest) {
            res.json({ success: false, message: "Request Not Found" })
            return
        }

        res.json({ success: true, message: "Action Updated" })

        sendMailToStudent(updatedRequest, 'HOD')
        if (updatedRequest.requestType == 'od' && action) {
            addApprovedODRequest(updatedRequest)
        }
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

const getRequestList = async (req, res) => {
    try {
        const requestList = await requestModel.find({})
        res.json({ success: true, requestList })
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export { handleRequest, getRequestList }