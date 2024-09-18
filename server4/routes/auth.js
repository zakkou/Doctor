const express = require("express");
const router = express.Router();
const { Signup, login,getUser,getAllUser,AddSecretary } = require("../controllers/auth");
const {requireLogin} = require('../middlwares/requireLogin')
router.post("/signup", Signup);
router.post("/add-secretary", requireLogin,AddSecretary);
router.post("/login", login);
router.get("/user",requireLogin, getUser); 
router.get("/users", getAllUser);
  
module.exports = router;