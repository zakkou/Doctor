const express = require("express");
const router = express.Router();
const { addReservation, getReservationByDoctor, editReservation, deleteReservation } = require("../controllers/reservation");
const { requireLogin } = require('../middlwares/requireLogin')

router.post("/add-reservation", requireLogin, addReservation);
router.get("/getAllReservation/:doctorId", requireLogin, getReservationByDoctor);
router.delete("/deleteReservation/:id", requireLogin, deleteReservation);
router.put("/editReservation/:id", requireLogin, editReservation);
module.exports = router;   