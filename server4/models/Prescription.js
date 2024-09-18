const mongoose = require("mongoose"); // Erase if already required
// Declare the Schema of the Mongo model
const prescriptionSchema = new mongoose.Schema(
  {

    
    date: {
      type: Date,
      required: true,
    },
   
    medications: {
      type: String,
      required: true, 
    },
    patientName: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    _doctor: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
//Export the model
module.exports = mongoose.model("Prescription", prescriptionSchema);
