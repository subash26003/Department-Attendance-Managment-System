import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expireAt : {
    type : Date,
    required : true,
    index : {expires : 0}
  }
});

const otpModel = mongoose.models.Otp || mongoose.model('Otp', otpSchema);

export default otpModel
