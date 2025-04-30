import { configureStore } from "@reduxjs/toolkit";
import classDetailsReducer, { getClassWiseStudentList } from '../features/classDetailsSlice'
import departmentReducer, { getFacultyList , getSubjectList} from '../features/departmentSlice'
import timetableReducer, { getTimeTable } from '../features/timetableSlice'
  
const store = configureStore({
    reducer : {
        classDetails : classDetailsReducer,
        department : departmentReducer,
        timetable : timetableReducer
    }
})

store.dispatch(getTimeTable())
store.dispatch(getFacultyList())
store.dispatch(getSubjectList())
store.dispatch(getClassWiseStudentList())

export default store