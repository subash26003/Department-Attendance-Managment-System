import React, { useEffect, useState } from 'react'
import Tab from "../Components/stateLessComponents/Tab"
import { API_STATUS, CLASS_LIST, WEEK_DAYS } from '../app/appConstants'
import {toast} from 'react-toastify'
import api from '../api/api'
import Loader from './stateLessComponents/Loader'
import FailueView from './stateLessComponents/FailueView'
import AttendanceDisplay from './HomePageComponents/AttendanceDisplay'

const CurrentClassAttendance = () => {

    const [selectedClass , setSelectedClass] = useState(CLASS_LIST[0])
    const [apiResponse , setApiResponse] = useState({status : API_STATUS.LOADING , errMsg : ""})

    const [currentClassAttendance , setCurrentClassAttendance] = useState();

    useEffect(() => {

        const getAttendanceData = async (selectedClass) => {
            try {
                let day = WEEK_DAYS[new Date().getDay()]
                if(!day) return
                
                const response = await api.get(`/getTodayUpdate/${selectedClass}`,{params : {day : day}})
                const data = response.data
    
                if(data.success){
                    setCurrentClassAttendance(data.todayAttendance)
                    setApiResponse({status : API_STATUS.SUCCESS})
                }else{
                    setApiResponse({status : API_STATUS.FAILURE , errMsg : data.message})
                    toast.error(data.message)
                }
            } catch (error) {
                console.log(error.message);
                toast.error(error.message.substring(0 , 30))
            }
        }
        setApiResponse(API_STATUS.LOADING)
        getAttendanceData(selectedClass)

    },[selectedClass])

    const renderView = (apiResponse) => {
        switch(apiResponse.status){
            case API_STATUS.LOADING:
                return <Loader />
            case API_STATUS.FAILURE:
                return <FailueView error={apiResponse.errMsg} />
            case API_STATUS.SUCCESS:
                return <AttendanceDisplay attendanceData={currentClassAttendance} />
        }
    }

  return (
    <div>
        <Tab tabList={CLASS_LIST} currentTab={selectedClass} setCurrentTab={setSelectedClass}/>
        <div>
            {renderView(apiResponse)}
        </div>
    </div>
  )
}

export default CurrentClassAttendance