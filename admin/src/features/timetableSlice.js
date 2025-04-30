import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";
import { API_STATUS } from "../app/appConstants";

export const getTimeTable = createAsyncThunk("timetable/getClassWiseStudentList" , async (_ , {rejectWithValue}) => {
        const response = await api.get("/listTimeTable")
        const {timetableData} = await response.data
        // console.log(timetableData);
        
        return timetableData
})


const timings = [
    "09:10 - 10:00",
    "10:00 - 10:50",
    "11:10 - 12:00",
    "12:00 - 12:50",
    "1:50 - 2:40",
    "2:40 - 3:30",
    "3:40 - 4:30",
  ];

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];


const initialState = {
    status : API_STATUS.LOADING,
    error : null,
    demoTable : [],
    timings
}

const timetableSlice = createSlice({
    name : 'timetable',
    initialState,
    reducers : {},
    extraReducers(builder){
        (builder)
        .addCase(getTimeTable.pending , (state ) => {
            state.status  = API_STATUS.LOADING
        })
        .addCase(getTimeTable.fulfilled , (state , action) => {
            state.status = API_STATUS.SUCCESS
            state.demoTable  = action.payload
        })
        .addCase(getTimeTable.rejected  , (state , action) => {
            state.status = API_STATUS.FAILURE
            state.error = action.payload
        })
    }
})


export default timetableSlice.reducer