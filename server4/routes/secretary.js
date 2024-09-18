const express = require("express");
const router = express.Router();
const { getAllsec, deleteSecretary,editSecretary } = require("../controllers/secretary");
const { requireLogin } = require('../middlwares/requireLogin')

router.get("/getAllsec/:doctorId", requireLogin, getAllsec);
router.delete("/deleteSecretary/:id", requireLogin, deleteSecretary);
router.put("/editSecretary/:id", requireLogin, editSecretary);

module.exports = router; 