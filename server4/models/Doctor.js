const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    speciality:{
      type:String,
    }
  },
  { timestamp: true }
);

module.exports = mongoose.model("Doctor", doctorSchema); 