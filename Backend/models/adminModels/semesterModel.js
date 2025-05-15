import mongoose from 'mongoose'

const semesterSchema = new mongoose.Schema({
  noOfYears: {
    type: Number,
    required: true
  },
  dates: {
    type: [
      {
        year: {
          type: String,
          required: true
        },
        startDate: {
          type: Date,
          required: true
        },
        endDate: {
          type: Date,
          required: true
        }
      }
    ],
    required: true
  }
});


const semesterModel = mongoose.models.semester || mongoose.model('semester' , semesterSchema)

export default semesterModel