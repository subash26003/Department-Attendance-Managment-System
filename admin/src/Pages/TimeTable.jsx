import { useState } from "react"
import TimetableForm from "../Components/TimetableForm"
import Heading from "../Components/stateLessComponents/Heading"
import { useSelector } from "react-redux"
import { API_STATUS } from "../app/appConstants"
import Loader from "../Components/stateLessComponents/Loader"
import FailueView from "../Components/stateLessComponents/FailueView"


const TimeTable = () => {
    const {status} = useSelector((state) => state.department)

    const renderView = () => {
      switch(status){
        case API_STATUS.LOADING:
          return <Loader />
        case API_STATUS.FAILURE:
          return <FailueView />
          case API_STATUS.SUCCESS:
            return <TimetableForm />
      }
    }
    
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl md:p-3">
        <Heading title={"Class Timetables"} />
        {renderView()}
    </div>
  )
}

export default TimeTable