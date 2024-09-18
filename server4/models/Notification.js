
const mongoose = require("mongoose"); // Erase if already required
// Declare the Schema of the Mongo model
const notificationSchema = new mongoose.Schema(
  {
    notification: {
      type: String,
      required: true,
    },
  
    seen: {
      type: Boolean, 
      default: false,
    },
    _secretary: { type: mongoose.Types.ObjectId, ref: "User" },
    _doctor: { type: mongoose.Types.ObjectId, ref: "User" }

  },
  { timestamps: true }
);
//Export the model
module.exports = mongoose.model("Notification", notificationSchema);