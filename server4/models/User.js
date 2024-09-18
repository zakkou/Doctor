const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    }, 
  
    password: {
      type: String,
    },
    role: {
      type: String,
    },

    name: {
      type: String,
      required: false,
      max: 32,
    },
   

    _doctor: { type: mongoose.Types.ObjectId, ref: "Doctor" },
    _secretary: { type: mongoose.Types.ObjectId, ref: "Secretary" },
  },
  { timestamp: true }
);
userSchema.plugin(mongoosePaginate);
const User = mongoose.model("User", userSchema);
module.exports = User;