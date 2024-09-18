const mongoose = require("mongoose"); // Erase if already required
// Declare the Schema of the Mongo model
const reservationSchema = new mongoose.Schema(
  {

    
    appointmentDate: {
      type: Date,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    description: {
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
module.exports = mongoose.model("Reservation", reservationSchema);
