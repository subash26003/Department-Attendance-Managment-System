import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";
import { API_STATUS } from "../app/appConstants";

export const getFacultyList = createAsyncThunk("department/getFacultyList" , async( ) => {
    const response = await api.get("/facultyList")
    return response.data
})

export const getSubjectList = createAsyncThunk("department/getSubjectList" , async() => {
    const response = await api.get("/subjectList")
    return response.data
})

export const getSemesterData = createAsyncThunk("department/getSemesterData" , async () => {
    const response = await api.get("/semesters")
    const data = response.data
    let numOfYears = data.noOfYears
    let dates = {}
    data.dates.forEach(item => {
            let obj = {};
            let sDate = item.startDate.split("T")[0]
            let eDate = item.endDate.split("T")[0]
            let year = "year" + item.year 
            obj =  {
                startDate : sDate,
                endDate : eDate
            }
            dates[year] = obj
          })
    
    const classes = Array.from({length : numOfYears} , (_ , i) => 'year' + ( i + 1))

    return {classes , dates}
})

const initialState = {
    facultyList : [],
    subjectList:[],
    status : API_STATUS.LOADING,
    classList : [],
    dates : {}
}

const departmentSlice = createSlice({
    name : 'department',
    initialState,
    reducers : {
        updateCurrentClassList : (state , action) => {
            state.currentClassList = action.payload
        }
    },

    extraReducers(builder){
        (builder)
        .addCase(getFacultyList.pending , (state) => {
            state.status = API_STATUS.LOADING
        })
        .addCase(getFacultyList.fulfilled , (state , action) => {
          
            if(action.payload.success === true){
                let list = action.payload.data
                state.facultyList = list
                state.status = API_STATUS.SUCCESS
            }else{
                state.status = API_STATUS.FAILURE
            }
        })
        .addCase(getFacultyList.rejected , (state) => {
            state.status = API_STATUS.FAILURE
        })
        .addCase(getSubjectList.fulfilled , (state , action) => {
            state.subjectList = action.payload.data
            state.status = API_STATUS.SUCCESS
            // console.log(action.payload.data)
        })
        .addCase(getSemesterData.fulfilled , (state , action) => {
            state.classList = action.payload.classes
            state.dates = action.payload.dates
        })
    }

    
})

export const {updateCurrentClass} = departmentSlice.actions

export default departmentSlice.reducer