import { useEffect, useState } from "react"
import { API_STATUS } from "../app/appConstants"
import api from "../api/api"
import { toast } from "react-toastify"
import Loader from "../Components/stateLessComponents/Loader"
import FailueView from "../Components/stateLessComponents/FailueView"
import RequestList from "../Components/RequestPageComponents/RequestList"
import Heading from "../Components/stateLessComponents/Heading"

const Requests = () => {

    const [requestList , setRequestList] = useState([])
    const [apiStatus , setApiStatus] = useState({status : API_STATUS.LOADING , errMsg : ""})

    useEffect(() => {

        const fetchRequest = async () => {
            try {
                const response = await api.get('/requestlist') 
                const {data} = response
                if(data.success){
                    setRequestList(data.requestList)
                    setApiStatus({status : API_STATUS.SUCCESS})
                    return
                }else{
                    setApiStatus({status : API_STATUS.FAILURE , errMsg : data.message})
                    toast.error(data.message)
                }
            } catch (error) {
                setApiStatus({status : API_STATUS.FAILURE , errMsg : error.message})
                toast.error(error.message)
            }
        }
        setApiStatus({status : API_STATUS.LOADING})
        fetchRequest()
    },[])

    const changeRequestStatus = (id , status) => {
        setRequestList(pre => {
            const temp = pre.map(request => {
                if(request._id == id){
                    request.status = status
                }
                return request
            })
            return temp
            
        })
    }

   const renderView = (apiStatus) => {
        switch(apiStatus.status){
            case API_STATUS.LOADING:
                return <Loader />
            case API_STATUS.FAILURE:
                return <FailueView message={apiStatus.errMsg} />
            case API_STATUS.SUCCESS:
                return <RequestList requestList={requestList} changeRequestStatus = {changeRequestStatus} />
        }
    }
  return (
    <div>
        <Heading title={"Student Requests"} />
        {renderView(apiStatus)}
    </div>
  )
}

export default Requests