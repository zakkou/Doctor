const express = require("express");
const router = express.Router();
const { addPayment,getPaymentsByDoctor,deletePayment,editPayment } = require("../controllers/payment");
const {requireLogin} = require('../middlwares/requireLogin')

router.post("/add-payment",requireLogin, addPayment); 
router.get("/getAllPayment/:doctorId",requireLogin, getPaymentsByDoctor); 
router.delete("/deletePayment/:id", requireLogin, deletePayment);
router.put("/edit-payment/:id",requireLogin, editPayment); 
  
module.exports = router; 