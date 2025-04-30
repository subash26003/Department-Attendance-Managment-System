import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subjects',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'students',
    required: true
  },
  internal1: {
    type: Number,
    min: 0,
    max: 100
  },
  internal2: {
    type: Number,
    min: 0,
    max: 100
  }
}, { timestamps: true });

const markModel = mongoose.models.marks || mongoose.model('marks', marksSchema);

export default markModel