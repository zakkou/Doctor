
const mongoose = require("mongoose"); // Erase if already required
// Declare the Schema of the Mongo model
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
//Export the model
module.exports = mongoose.model("Contact", contactSchema);
