import React, { useContext, useEffect, useState } from 'react'
import withApiStatus from '../components/HigherOrderComponent/withApiStatus'
import { API_STATUS, DataContext } from '../context/DataProvider'
import { toast } from 'react-toastify'
import api from '../api/api'
import { Navigate } from 'react-router-dom'
import Loader from '../components/stateLessComponents/Loader'
import Failure from '../components/stateLessComponents/Failure'
import RequestList from '../components/RequestList'

const Requests = () => {
    const {token , facultyData} = useContext(DataContext)
    const [requestList , setRequestList] = useState([])

    const [apiStatus , setApiStatus] = useState({status : API_STATUS.LOADING , errMsg : ""})

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const options = {
                    headers : {
                        'Authorization' : `Bearer ${token}`
                    },
                    body : {year : ''}
                }
                const response = await api.get("/requests" , options)
                const {data} = response

                if(data.success){
                    setRequestList(data.requestList)
                    setApiStatus({status : API_STATUS.SUCCESS})
                }else{
                    setApiStatus({status : API_STATUS.FAILURE , errMsg : data.message})
                    toast.error(data.message)
                }
                
            } catch (error) {
                console.log(error.message);
                toast.error(error.message)
            }
        }
        setApiStatus({status : API_STATUS.LOADING})
        fetchRequest()

    },[])
    
    if(!facultyData.facultyDetails.classAdvisor){
        return <Navigate to='/' />
    }

    const handleRequestStatus = (id , status) => {
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
                return <Failure message={apiStatus.errMsg} />
            case API_STATUS.SUCCESS:
                return <RequestList requestList={requestList} handleRequestStatus={handleRequestStatus}/>
        }
    }
  return (
    <div>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Student Requests</h2>
        {renderView(apiStatus)}
    </div>
  )
}

export default withApiStatus(Requests)