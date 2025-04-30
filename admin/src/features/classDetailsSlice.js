import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import { API_STATUS } from "../app/appConstants";

export const getClassWiseStudentList = createAsyncThunk('classDetails/getClassWiseStudentList', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/studentList')
    const responseData = response.data

    if (responseData.success) {
      return responseData.classList
    }

    rejectWithValue(responseData.message)
  } catch (error) {
    rejectWithValue(error.message)
  }
})

export const getCurrentTimetable = createAsyncThunk('classDetails/getCurrentTimetable', async (currentClass, { getState }) => {

  const { demoTable } = getState().timetable
  const day = 'Monday'
  let timeTable = demoTable.filter(item => item.year == currentClass && item.day == day)

  return timeTable
})


const initialState = {
  classData: [],
  response: {
    status: API_STATUS.LOADING,
    error: "",
    message: ''
  },
  currentClass: 'year1',
  currentTimetable: {}
}

const classDetailsSlice = createSlice({
  name: 'classDetails',
  initialState,
  reducers: {
    setCurrentClass: (state, action) => {
      state.currentClass = action.payload
      
    },
    
  },
  extraReducers(builder) {
    (builder)
      .addCase(getClassWiseStudentList.pending, (state) => {
        state.response.status = API_STATUS.LOADING
      })
      .addCase(getClassWiseStudentList.fulfilled, (state, action) => {

        // state.classData = action.payload
        state.response.status = API_STATUS.SUCCESS
      })
      .addCase(getClassWiseStudentList.rejected, (state, action) => {
        state.response.status = API_STATUS.LOADING
        state.response.message = action.payload.message
      })
      .addCase(getCurrentTimetable.pending, (state) => {
        state.response.status = API_STATUS.LOADING
      })
      .addCase(getCurrentTimetable.fulfilled, (state, action) => {

        state.currentTimetable = action.payload[0]
      })
  }
})

export const { setCurrentClass } = classDetailsSlice.actions

export default classDetailsSlice.reducer