const express = require("express");
const router = express.Router();
const { addPrescription,getPrescriptionByDoctor,deletePrescription ,editPrescription} = require("../controllers/prescription");
const {requireLogin} = require('../middlwares/requireLogin')

router.post("/add-prescription",requireLogin, addPrescription); 
router.delete("/deletePrescription/:id",requireLogin, deletePrescription); 
router.get("/getAllPrescriptions/:doctorId",requireLogin, getPrescriptionByDoctor); 
router.put("/editPrescription/:id",requireLogin, editPrescription); 
  
module.exports = router;   