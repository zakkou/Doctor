const express = require("express");
const router = express.Router();
const { clearNotification,getNotification } = require("../controllers/notification");
const {requireLogin} = require('../middlwares/requireLogin')

// router.post("/add-notification",requireLogin, addNotification); 
router.patch("/clear/:id", requireLogin, clearNotification);
router.get("/get-notification/:id", requireLogin, getNotification);
  
module.exports = router; 