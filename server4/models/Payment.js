const mongoose = require("mongoose"); // Erase if already required
// Declare the Schema of the Mongo model
const paymentSchema = new mongoose.Schema(
  {
    doctorName:{
      type: String,
    },
    patientName:{
      type: String,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    paymentDetails: {
      type: String, 
      required: true,
    },
    date: {
      type: String, 
     
    },
    paymentDoctor:  { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
//Export the model
module.exports = mongoose.model("Payment", paymentSchema);
