const mongoose = require("mongoose");

const secretarySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,  // ObjectId for reference
      ref: "User",  // Name of the model the doctorId refers to
    },
  
  },
  { timestamp: true }
);

module.exports = mongoose.model("Secretary", secretarySchema);  