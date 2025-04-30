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

const initialState = {
    facultyList : [],
    subjectList:[],
    status : API_STATUS.LOADING,
    classList : ['year1' , 'year2'],
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
    }

    
})

export const {updateCurrentClass} = departmentSlice.actions

export default departmentSlice.reducer