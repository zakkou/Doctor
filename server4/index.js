const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const contactUs = require("./routes/contact");
const auth = require("./routes/auth");
const payment = require("./routes/payment"); 
const secretary = require("./routes/secretary");
const reservation = require("./routes/reservation"); 
const prescription = require("./routes/prescription"); 
const notification = require("./routes/notification"); 
// const doctor = require("./routes/doctor");
const config = require("dotenv").config();
// const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
/* -------------------------------------------------------------------------- */
/*                              CONNECT DATABASE                              */
/* -------------------------------------------------------------------------- */
mongoose
  .connect("mongodb+srv://wajihmaaoui:WgIXcrKgPjvi6EAW@cabinet0.pulyu.mongodb.net/?retryWrites=true&w=majority&appName=cabinet0")
  .then(() => {
    console.log("MongoDB Connection Succeeded.");
  })
  .catch((err) => {
    console.error("Error in DB connection: " + err);  
  });
app.use(cors());
app.use(bodyParser.json());

/* -------------------------------------------------------------------------- */
/*                                   ROUTING                                  */
/* -------------------------------------------------------------------------- */
app.use("/api", contactUs);
app.use("/api", auth); 
app.use("/api", secretary);
app.use("/api", payment);
app.use("/api", reservation);
app.use("/api", prescription);
app.use("/api", notification);
// app.use("/api", doctor);
/* -------------------------------------------------------------------------- */
/*                               CONNECT SERVER                               */
/* -------------------------------------------------------------------------- */


app.listen(port, () => console.log(`Server running on port ${port}`));
module.exports = app